import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Image as ImageIcon, Loader2, Edit3, Trash2, MapPin, Phone } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAuraSystemPrompt } from '../../lib/auraSystemPrompt';

const NEARBY_HOSPITALS = {
  "Hyderabad": [
    { name: "Apollo Hospitals, Jubilee", phone: "1066", dist: "4.2 km" },
    { name: "Care Hospitals, Banjara", phone: "040-6165", dist: "5.1 km" }
  ],
  "Delhi": [
    { name: "AIIMS New Delhi", phone: "011-2658", dist: "3.5 km" },
    { name: "Max Hospital, Saket", phone: "011-2651", dist: "6.0 km" }
  ],
  "Jaipur": [
    { name: "Fortis Escorts Hospital", phone: "0141-254", dist: "2.8 km" },
    { name: "SMS Medical Hospital", phone: "0141-256", dist: "4.5 km" }
  ]
};

let genAI;
try {
  genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
} catch (e) {
  console.warn('Gemini API key missing. Aura will not work properly.');
}

export function AuraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('aura_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [{ 
      role: 'model', 
      text: "Hi, I'm Aura. Are you or someone else experiencing a health issue? Tell me or show me a photo, and I'll give you immediate advice on what to do right now." 
    }];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showHospitals, setShowHospitals] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('aura_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-aura', handleOpen);
    return () => window.removeEventListener('open-aura', handleOpen);
  }, []);

  // Chat history manually managed with the messages state

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const deleteMessagePair = (userIndex) => {
    setMessages(prev => {
      const newMessages = [...prev];
      newMessages.splice(userIndex, 2);
      return newMessages;
    });
  };

  const editMessage = (idx, text) => {
    setInputText(text);
    deleteMessagePair(idx);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;
    if (!genAI) {
      setMessages(prev => [...prev, { role: 'model', text: "System is not initialized. Please check API Key."}]);
      return;
    }

    const textToSend = inputText;
    const imageToSend = selectedImage;
    const userMessage = { role: 'user', text: textToSend, image: imageToSend };
    
    setMessages(prev => [...prev, userMessage]);
    
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowHospitals(false);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: getAuraSystemPrompt() 
      });

      const contents = [];
      for (const msg of messages) {
        if (msg.role === 'model' && (msg.text.includes("I'm having trouble connecting") || msg.text.includes("Hi, I'm Aura"))) {
          continue; 
        }
        
        const parts = [];
        if (msg.text) parts.push({ text: msg.text });
        if (msg.image) {
          const base64Data = msg.image.split(',')[1];
          const mimeType = msg.image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
          parts.push({ inlineData: { data: base64Data, mimeType } });
        }
        
        if (contents.length === 0 && msg.role === 'model') continue; 
        if (contents.length > 0 && contents[contents.length-1].role === msg.role) continue; 
        
        // Remove empty turns which causes errors
        if (parts.length > 0) {
           contents.push({ role: msg.role, parts });
        }
      }

      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents.pop(); 
      }

      const currentParts = [];
      if (textToSend) currentParts.push({ text: textToSend });
      if (imageToSend) {
        const base64Data = imageToSend.split(',')[1];
        const mimeType = imageToSend.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
        currentParts.push({ inlineData: { data: base64Data, mimeType } });
      }
      
      if (currentParts.length > 0) {
         contents.push({ role: 'user', parts: currentParts });
      }

      const result = await model.generateContent({ contents });
      const responseText = result.response.text();
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      speak(responseText); 
    } catch (error) {
      console.error("Aura Chat Error:", error);
      const fallbackAdvice = "Here are some general immediate tips while you wait for professional help:\n- **Stay calm** and get into a safe, comfortable resting position.\n- **For a wound**: Apply steady pressure with a clean cloth to stop bleeding.\n- **For a fever**: Stay hydrated and place a cool, damp compress on your forehead.\n\n*(Note: I'm having trouble connecting to AI services right now. If this is a severe emergency, please seek professional emergency medical services immediately.)*";
      setMessages(prev => [...prev, { role: 'model', text: fallbackAdvice }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Your browser doesn't support speech recognition.");
    
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputText(prev => {
          const newText = prev ? prev + ' ' + transcript : transcript;
          setTimeout(() => {
            const btn = document.getElementById('aura-send-btn');
            if (btn && !btn.disabled) btn.click();
          }, 400);
          return newText;
        });
      }
    };
    recognition.onerror = (event) => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary/90 hover:scale-105 transition-all z-50 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Slide-out Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-card border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Aura Assistant</h3>
              <p className="text-xs text-muted-foreground">Immediate First-Aid & Care</p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
              
              {/* User Message Actions */}
              {msg.role === 'user' && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center gap-1 mr-2">
                  <button onClick={() => editMessage(idx, msg.text)} className="p-1.5 focus:outline-none bg-muted hover:bg-muted-foreground/20 text-muted-foreground rounded-full shadow-sm" title="Edit Message">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteMessagePair(idx)} className="p-1.5 focus:outline-none bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full shadow-sm" title="Delete Message">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className={`relative max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
                {msg.image && (
                  <img src={msg.image} alt="User Upload" className="max-w-full rounded-lg mb-2 border border-primary/20 max-h-48 object-cover" />
                )}
                <div 
                  className="text-sm whitespace-pre-wrap leading-relaxed" 
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')
                  }} 
                />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground max-w-[80%] rounded-2xl px-4 py-3 rounded-bl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Aura is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card relative">
          
          {/* Hospital Locator Popover */}
          {showHospitals && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-popover text-popover-foreground rounded-xl shadow-xl border border-border p-3 max-h-64 overflow-y-auto">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Nearby Emergency Hospitals</h4>
                <button onClick={() => setShowHospitals(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="space-y-3">
                {Object.entries(NEARBY_HOSPITALS).map(([city, hospitals]) => (
                  <div key={city}>
                    <h5 className="text-xs font-bold text-muted-foreground mb-1 mt-1 uppercase tracking-widest">{city}</h5>
                    {hospitals.map((h, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-muted/40 rounded-lg mb-1 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{h.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3"/> {h.phone}</span>
                        </div>
                        <span className="text-xs font-semibold text-primary">{h.dist}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="mb-3 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-border" />
              <button onClick={removeSelectedImage} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 relative">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            
            <button
              onClick={() => setShowHospitals(!showHospitals)}
              className={`p-2 shrink-0 rounded-full ${showHospitals ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
              title="Locate Hospitals"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-muted-foreground hover:bg-muted rounded-full shrink-0" title="Add a photo">
              <ImageIcon className="w-5 h-5" />
            </button>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Ask for immediate advice..."
              className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            
            <button onClick={toggleRecording} className={`p-2 shrink-0 rounded-full ${isRecording ? 'bg-destructive/20 text-destructive' : 'text-muted-foreground hover:bg-muted'}`} title="Voice input">
              {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            
            <button id="aura-send-btn" onClick={handleSend} disabled={isLoading || (!inputText.trim() && !selectedImage)} className="p-2 bg-primary text-primary-foreground rounded-full shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
