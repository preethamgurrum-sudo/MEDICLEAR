import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Languages, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import FileUploader from "../components/upload/FileUploader";
import TextInput from "../components/upload/TextInput";
import LanguageSelector from "../components/upload/LanguageSelector";
import ProcessingState from "../components/upload/ProcessingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DOMPurify from 'dompurify';
import { detectReportType } from '../utils/reportTypeDetector';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';

const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        inlineData: {
          data: typeof reader.result === 'string' ? reader.result.split(',')[1] : '',
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const hasSelectedLanguage = searchParams.get('step') === 'upload';

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadMode, setUploadMode] = useState("file");

  const canSubmit =
    (uploadMode === "file" && file) ||
    (uploadMode === "text" && pastedText.trim());

  const handleAnalyze = async () => {
    setIsProcessing(true);
    setProcessingStep(1);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        alert("Live AI Error: Please ensure VITE_GEMINI_API_KEY is defined in your .env file and RESTART your terminal (npm run dev).");
        setIsProcessing(false);
        return;
      }

      setProcessingStep(2);

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const languageMap = {
        'en': 'English', 'hi': 'Hindi', 'te': 'Telugu', 'ta': 'Tamil', 
        'kn': 'Kannada', 'ml': 'Malayalam', 'mr': 'Marathi', 
        'bn': 'Bengali', 'gu': 'Gujarati', 'pa': 'Punjabi'
      };
      const targetLangName = languageMap[language] || 'English';

      let contents = [];
      const systemPrompt = `You are a friendly, empathetic expert pharmacist and medical AI. Your job is to read complex medical documents (especially highly illegible handwritten Indian doctor prescriptions or lab reports) and translate them so a regular person can easily understand them.
Carefully analyze the image. If it is a prescription, you must confidently read the doctor's handwriting and extract ALL medications, exact dosages, frequencies, and durations.

CRITICAL INSTRUCTION 1: You MUST translate every medical term into extremely simple, everyday language. Imagine you are explaining this to a 10-year-old child.
CRITICAL INSTRUCTION 2: You MUST format all the explanatory text (summary, explanations, terms, recommendations) completely in ${targetLangName}. The JSON keys must remain in English, but the VALUES must be written in ${targetLangName}.
CRITICAL INSTRUCTION 3: For PRESCRIPTIONS, in the "key_terms" list, the "term" MUST be formatted clearly as "Medicine Name - Dosage (Frequency)". For example: "Paracetamol - 500mg (1-0-1 After Meals)". The "simple_explanation" MUST clearly explain what the medicine is for and exactly how/when to take it in plain language.
CRITICAL INSTRUCTION 4: The "recommendations" array MUST contain Fast Recovery Tips. Give the user the best, safest actionable advice on how to recover faster and feel better, based strictly on their diagnosis/document. 

Return ONLY a strictly valid JSON object. Do NOT wrap the JSON in markdown blocks (no \`\`\`json). Use this EXACT schema:
{
  "report_type": "prescription",
  "simplified_summary": "A warm, comforting 2-sentence summary of the overall document, written at a 5th-grade reading level.",
  "key_terms": [
    {
      "term": "Medicine Name - Dosage (Frequency) OR Name of test", 
      "original_context": "The exact handwritten text from the prescription (e.g., 'T. Pcm 500 bid x 5d')", 
      "simple_explanation": "Explain this medicine or test. For medicines, explicitly state HOW, WHEN, and for HOW LONG to take it (e.g., 'Take 1 tablet in morning and 1 at night after food for 5 days. This is for your fever.'). NEVER use medical jargon here.", 
      "severity": "normal"
    }
  ],
  "key_findings": [
    {
      "finding": "Main clinical observation or diagnosis (e.g., Viral Fever)", 
      "explanation": "Explain what this finding means for the person's body in simple, everyday language.", 
      "status": "warning"
    }
  ],
  "recommendations": ["A fast recovery tip (e.g., 'Rest completely and drink warm liquids so your body can heal faster.')", "Another fast recovery tip"]
}
Only use "normal", "attention", or "urgent" for severity and status. If handwriting is completely unreadable, make your best professional guess based on context but add a gentle note warning the user to verify with a pharmacist.`;

      if (uploadMode === "file" && file) {
        const imagePart = await fileToGenerativePart(file);
        contents = [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { inline_data: imagePart.inlineData }
            ]
          }
        ];
      } else {
        contents = [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: DOMPurify.sanitize(pastedText) }
            ]
          }
        ];
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      const data = await response.json();
      
      if (!response.ok) {
          throw new Error(data.error?.message || "Unknown Google API Error");
      }

      if (!data.candidates || !data.candidates[0]) {
          throw new Error("AI did not return any results. Please try a clearer image.");
      }

      let textResponse = data.candidates[0].content.parts[0].text;
      
      const firstBrace = textResponse.indexOf('{');
      const lastBrace = textResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
          textResponse = textResponse.slice(firstBrace, lastBrace + 1);
      } else {
          throw new Error("AI failed to format the medical data. Please try again.");
      }

      const aiData = JSON.parse(textResponse);
      const reportId = Date.now().toString();
      
      const newReport = {
        id: reportId,
        title: "Medical Report Analysis",
        language,
        created_date: new Date().toISOString(),
        ...aiData
      };

      const existingReports = JSON.parse(localStorage.getItem("reports")) || [];
      existingReports.unshift(newReport);
      localStorage.setItem("reports", JSON.stringify(existingReports));

      setIsProcessing(false);
      navigate(`/report/${reportId}`);

    } catch (err) {
      console.error("AI Extraction failed:", err);
      // Suppressed alert to prevent blocking UI on high demand errors
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProcessingState step={processingStep} />
      </div>
    );
  }

  if (!hasSelectedLanguage) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {t('welcome')} <span className="text-primary">MediClear</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t('select_language')}
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            {t('sub_select_language')}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {[
            { code: 'en', label: 'English', flag: '🇬🇧' },
            { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
            { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
            { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
            { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
            { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
            { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
            { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
            { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
            { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
          ].map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setSearchParams({ step: 'upload' });
              }}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all shadow-sm bg-card"
            >
              <span className="text-4xl mb-2">{lang.flag}</span>
              <span className="text-base font-semibold">{lang.label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <section className="py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Heart className="w-4 h-4" />
            {t('ai_powered')}
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
            {t('understand_reports')}
            <br />
            <span className="text-primary">{t('medical_reports')}</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-10">
            {t('upload_desc')}
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {[
            {
              icon: Zap,
              title: t('instant_analysis'),
              desc: t('instant_analysis_desc'),
            },
            {
              icon: Languages,
              title: t('multilingual'),
              desc: t('multilingual_desc'),
            },
            {
              icon: ShieldCheck,
              title: t('secure'),
              desc: t('secure_desc'),
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl bg-card border shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary" />
              </div>

              <span className="text-sm font-semibold text-foreground mb-1">
                {f.title}
              </span>

              <span className="text-xs text-muted-foreground">
                {f.desc}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      <motion.section className="max-w-xl mx-auto pb-20">
        <Card className="border shadow-sm">
          <CardContent className="p-6 space-y-5">
            <Tabs
              value={uploadMode}
              onValueChange={setUploadMode}
            >
              <TabsList className="w-full mb-4">
                <TabsTrigger value="file" className="flex-1 text-sm">
                  {t('upload_tab')}
                </TabsTrigger>

                <TabsTrigger value="text" className="flex-1 text-sm">
                  {t('paste_tab')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file">
                <FileUploader
                  file={file}
                  onFileSelect={setFile}
                  onRemove={() => setFile(null)}
                />
              </TabsContent>

              <TabsContent value="text">
                <TextInput
                  value={pastedText}
                  onChange={setPastedText}
                />
              </TabsContent>
            </Tabs>

            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full h-12 text-base font-medium mt-2"
            >
              {t('analyze_btn')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}