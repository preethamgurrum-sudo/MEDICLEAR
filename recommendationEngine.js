export function generateRecommendations(findings, severityLevel) {
  const recommendations = [];

  // Severity-based recommendations
  if (severityLevel === 'critical') {
    recommendations.push("⚠️ Seek immediate medical attention or visit an emergency room.");
    recommendations.push("Do not ignore these critical findings.");
  } else if (severityLevel === 'warning') {
    recommendations.push("Schedule a consultation with your primary care physician soon.");
    recommendations.push("Consider repeating the test in 2-4 weeks to monitor changes.");
  }

  // Findings-based recommendations (basic heuristics)
  findings.forEach(finding => {
    const text = finding.finding.toLowerCase();
    
    if (text.includes("sugar") || text.includes("glucose") || text.includes("hba1c")) {
      recommendations.push("Maintain a low glycemic index diet and exercise regularly.");
    }
    
    if (text.includes("cholesterol") || text.includes("lipid") || text.includes("ldl")) {
      recommendations.push("Reduce saturated fat intake and increase cardiovascular activity.");
    }
    
    if (text.includes("blood pressure") || text.includes("bp") || text.includes("hypertension")) {
      recommendations.push("Monitor sodium intake and practice stress management.");
    }
    
    if (text.includes("hemoglobin") || text.includes("iron") || text.includes("anemia")) {
      recommendations.push("Ensure adequate iron and Vitamin C intake in your diet.");
    }
  });

  // Base suggestions if list is still small
  if (recommendations.length < 2 && severityLevel === 'normal') {
    recommendations.push("Maintain a balanced diet and stay hydrated.");
    recommendations.push("Continue routine health checkups annually.");
  }

  // Deduplicate recommendations
  return [...new Set(recommendations)];
}

export function calculateOverallSeverity(findings, keyTerms) {
  // Rough heuristic: if any finding is critical, overall is critical
  // If any is warning, overall is warning. Else normal.
  
  const allSeverities = [
    ...(findings || []).map(f => f.status || 'normal'),
    ...(keyTerms || []).map(k => k.severity || 'normal')
  ];
  
  if (allSeverities.includes('critical')) return 'critical';
  if (allSeverities.includes('warning') || allSeverities.includes('abnormal')) return 'warning';
  
  return 'normal';
}
