export function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicitUrl) {
    try {
      return new URL(explicitUrl).toString().replace(/\/+$/, '');
    } catch {
      // Fall through to VERCEL_URL and localhost
    }
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    try {
      return new URL(
        vercelUrl.startsWith('http://') || vercelUrl.startsWith('https://')
          ? vercelUrl
          : `https://${vercelUrl}`,
      )
        .toString()
        .replace(/\/+$/, '');
    } catch {
      // Fall through to localhost
    }
  }

  return 'http://localhost:3000';
}