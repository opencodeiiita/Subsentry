/**
 * Simple rule-based parser for extracting subscription info from emails.
 * No heavy dependencies, focuses on common patterns and graceful failures.
 */

/**
 * Extracts the merchant or service name from subject and snippet.
 */
function extractServiceName(subject, snippet) {
  if (!subject) return "Unknown Service";

  // Common patterns for service names often appearing at the start or with specific markers
  const cleanSubject = subject.toLowerCase();
  
  // List of known services to prioritize (optional, but helps accuracy)
  const commonServices = ["netflix", "spotify", "adobe", "youtube", "disney+", "amazon prime", "icloud", "hulu", "hbo", "slack", "zoom"];
  
  for (const service of commonServices) {
    if (cleanSubject.includes(service) || snippet.toLowerCase().includes(service)) {
      // Return capitalized version
      return service.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }

  // Fallback: Try to find name before "subscription", "receipt", "renewal", etc.
  const markers = ["subscription", "receipt", "renewal", "payment", "membership"];
  for (const marker of markers) {
    const index = cleanSubject.indexOf(marker);
    if (index > 2) {
      const name = subject.substring(0, index).trim().replace(/your\s+/i, "").replace(/[-–—:]/g, "").trim();
      if (name) return name;
    }
  }

  return "Subscription Service";
}

/**
 * Identifies billing frequency hints (monthly, annual, etc.)
 */
function extractBillingHints(subject, snippet) {
  const text = (subject + " " + snippet).toLowerCase();
  
  if (text.includes("monthly") || text.includes("per month")) return "Monthly";
  if (text.includes("annual") || text.includes("yearly") || text.includes("per year")) return "Annual";
  if (text.includes("weekly")) return "Weekly";
  
  // Default hints if no frequency is found
  if (text.includes("renew")) return "Renewal";
  if (text.includes("charge")) return "Charged";
  
  return "Subscription";
}

/**
 * Extracts payment amount using regex.
 * Handles common currency symbols and USD/INR formats.
 */
function extractAmount(subject, snippet) {
  const text = (subject + " " + snippet);
  
  // Regex patterns for amounts:
  // 1. $ XX.XX or € XX.XX etc.
  // 2. XX.XX USD or XX.XX INR etc.
  const amountRegex = /([$£€₹¥]|USD|INR|EUR|GBP)\s*(\d+([.,]\d{2})?)|\b(\d+([.,]\d{2})?)\s*([$£€₹¥]|USD|INR|EUR|GBP)\b/gi;
  
  const match = amountRegex.exec(text);
  if (match) {
    // Return the full matched string for clarity
    return match[0].trim();
  }
  
  return null;
}

/**
 * Orchestrates extraction into a structured object.
 */
function parseEmail(emailData) {
  try {
    const { subject, snippet, date } = emailData;
    
    return {
      service: extractServiceName(subject, snippet),
      billingHint: extractBillingHints(subject, snippet),
      amount: extractAmount(subject, snippet),
      date: date || new Date().toISOString(),
      originalSubject: subject
    };
  } catch (error) {
    console.error("Parser Error:", error);
    // Graceful failure
    return {
      service: "Unknown Subscription",
      billingHint: "Error Parsing",
      amount: null,
      date: new Date().toISOString()
    };
  }
}

module.exports = {
  parseEmail,
  extractServiceName,
  extractBillingHints,
  extractAmount
};
