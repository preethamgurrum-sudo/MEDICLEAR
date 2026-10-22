export function detectReportType(text) {
  if (!text || typeof text !== "string") return "unknown";
  
  const lowerText = text.toLowerCase();
  
  // Basic heuristics for report type detection
  if (lowerText.match(/\b(mri|ct scan|x-ray|radiology|ultrasound)\b/)) {
    return "radiology";
  }
  
  if (lowerText.match(/\b(haemoglobin|wbc|rbc|platelets|lipid profile|sgpt|sgot|thyroid|tsh|blood|serum|plasma|lab)\b/)) {
    return "lab_report";
  }
  
  if (lowerText.match(/\b(histopathology|biopsy|cytology|malignancy|carcinoma)\b/)) {
    return "pathology";
  }
  
  if (lowerText.match(/\b(rx|prescription|tab|cap|syrup|dosage|bd|tds|od|medicines)\b/)) {
    return "prescription";
  }
  
  if (lowerText.match(/\b(discharge summary|admission|discharge date|course in hospital|chief complaints)\b/)) {
    return "discharge_summary";
  }
  
  return "general_report";
}
