/**
 * Sanitize a string input to prevent XSS attacks
 * @param input Raw user input string
 * @returns Sanitized string with HTML entities escaped
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize an email address
 * @param email Raw email string
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = email.trim().toLowerCase();
  if (!emailRegex.test(trimmed)) return null;
  return trimmed;
}
