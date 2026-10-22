import html2pdf from 'html2pdf.js';

export const exportReportToPDF = (elementId, filename = 'medical-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const opt = {
    margin:       [0.5, 0.5, 0.5, 0.5],
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};

export const exportReportToJSON = (reportData, filename = 'medical-report.json') => {
  const dataStr = JSON.stringify(reportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const shareReportText = async (reportData) => {
  const text = `Medical Report: ${reportData.title}\nSeverity: ${reportData.severity || 'Normal'}\nSummary: ${reportData.simplified_summary}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Medical Report Summary',
        text: text,
      });
    } catch (err) {
      console.log('Error sharing', err);
    }
  } else {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }
};
