export function getSiteUrl(): string {
  const FALLBACK = 'http://localhost:3000';

  try {
    const explicitUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (explicitUrl && typeof explicitUrl === 'string' && explicitUrl.length > 0) {
      const trimmed = explicitUrl.trim();
      if (trimmed.length > 0) {
        try {
          const url = new URL(trimmed);
          return url.toString().replace(/\/+$/, '');
        } catch {
          // Invalid URL, fall through
        }
      }
    }
  } catch {
    // Fall through
  }

  try {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl && typeof vercelUrl === 'string' && vercelUrl.length > 0) {
      const trimmed = vercelUrl.trim();
      if (trimmed.length > 0) {
        try {
          const urlString = trimmed.startsWith('http://') || trimmed.startsWith('https://')
            ? trimmed
            : `https://${trimmed}`;
          const url = new URL(urlString);
          return url.toString().replace(/\/+$/, '');
        } catch {
          // Invalid URL, fall through
        }
      }
    }
  } catch {
    // Fall through
  }

  return FALLBACK;
}