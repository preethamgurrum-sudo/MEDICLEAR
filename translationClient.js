/**
 * Simplified translation client acting as an abstraction over 
 * Google Translate API, OpenAI API, or other translation providers.
 */
export async function translateText(text, targetLanguage) {
  if (!text || targetLanguage === "en") return text;
  
  // NOTE: This is a placeholder wrapper.
  // In a production app, you would dispatch a request to your backend proxy 
  // or a serverless function that securely holds the API key and calls the translation model.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dummy translations for demo purposes
      let translated = `[${targetLanguage.toUpperCase()}] ${text}`;
      
      if (typeof text === 'object') {
          resolve(text);
          return;
      }

      if (targetLanguage === 'hi') {
        if (text.includes("Consult doctor")) translated = "लक्षण बने रहने पर डॉक्टर से मिलें";
        else if (text.includes("normal")) translated = "सामान्य";
        else if (text.includes("High")) translated = "उच्च";
      }

      resolve(translated);
    }, 400); // simulate network latency
  });
}

/**
 * Convenience method for translating complex structured JSON outputs from NLP pipeline
 */
export async function translateReportStructure(report, targetLanguage) {
  if (targetLanguage === "en") return report;
  
  // Create a deep copy to translate
  const translated = JSON.parse(JSON.stringify(report));
  
  // Translate main summary
  if (translated.simplified_summary) {
    translated.simplified_summary = await translateText(translated.simplified_summary, targetLanguage);
  }
  
  // Translate key findings
  if (translated.key_findings && Array.isArray(translated.key_findings)) {
    for (let i = 0; i < translated.key_findings.length; i++) {
        translated.key_findings[i].finding = await translateText(translated.key_findings[i].finding, targetLanguage);
        translated.key_findings[i].explanation = await translateText(translated.key_findings[i].explanation, targetLanguage);
    }
  }

  // Translate recommendations
  if (translated.recommendations && Array.isArray(translated.recommendations)) {
    for (let i = 0; i < translated.recommendations.length; i++) {
        translated.recommendations[i] = await translateText(translated.recommendations[i], targetLanguage);
    }
  }

  return translated;
}
