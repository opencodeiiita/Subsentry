const extractAmount = (text) => {
  const match = text.match(/([$£€₹¥]|USD|INR|EUR)\s*(\d+([.,]\d{2})?)/i) || 
                text.match(/(\d+([.,]\d{2})?)\s*([$£€₹¥]|USD|INR|EUR)/i);
  return match ? match[0] : null;
};

const extractBilling = (text) => {
  const t = text.toLowerCase();
  if (t.includes('month') || t.includes('monthly')) return 'Monthly';
  if (t.includes('year') || t.includes('annual') || t.includes('yearly')) return 'Annual';
  return 'Renewal';
};

const extractName = (subject, snippet) => {
  const fullText = (subject + ' ' + snippet).toLowerCase();
  const known = ['netflix', 'spotify', 'adobe', 'youtube', 'disney+', 'amazon', 'hulu', 'apple', 'google'];
  
  for (const s of known) {
    if (fullText.includes(s)) return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Fallback: try to grab first part of subject
  return subject
    .split(/[|:-]/)[0]
    .replace(/Your |subscription |receipt |payment /gi, '')
    .trim() || 'Subscription';
};

module.exports = { extractAmount, extractBilling, extractName };
