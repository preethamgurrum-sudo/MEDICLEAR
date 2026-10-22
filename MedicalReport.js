// MedicalReport data model

export const MedicalReportStatus = {
  PROCESSING: "processing",
  COMPLETED: "completed",
  ERROR: "error",
};

export const ReportTypes = {
  LAB_RESULTS: "lab_results",
  PRESCRIPTION: "prescription",
  DISCHARGE_SUMMARY: "discharge_summary",
  RADIOLOGY: "radiology",
  PATHOLOGY: "pathology",
  OTHER: "other",
};

export const SeverityLevels = {
  NORMAL: "normal",
  ATTENTION: "attention",
  URGENT: "urgent",
};

export const FindingStatus = {
  NORMAL: "normal",
  ABNORMAL: "abnormal",
  CRITICAL: "critical",
};

export const createMedicalReportTemplate = () => ({
  title: "",
  report_type: ReportTypes.OTHER,
  original_file_url: "",
  original_text: "",
  language: "en",
  simplified_summary: "",
  key_terms: [],
  key_findings: [],
  recommendations: [],
  status: MedicalReportStatus.PROCESSING,
});