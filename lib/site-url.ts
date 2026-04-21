export function getSiteUrl(): string {
  try {
    const explicitUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (explicitUrl) {
      try {
        const url = new URL(explicitUrl);
        return url.toString().replace(/\/+$/, '');
      } catch {
        // Fall through to VERCEL_URL
      }
    }
  } catch {
    // Fall through to VERCEL_URL
  }

  try {
    const vercelUrl = process.env.VERCEL_URL?.trim();
    if (vercelUrl) {
      try {
        const urlString = vercelUrl.startsWith('http://') || vercelUrl.startsWith('https://')
          ? vercelUrl
          : `https://${vercelUrl}`;
        const url = new URL(urlString);
        return url.toString().replace(/\/+$/, '');
      } catch {
        // Fall through to localhost
      }
    }
  } catch {
    // Fall through to localhost
  }

  return 'http://localhost:3000';
}