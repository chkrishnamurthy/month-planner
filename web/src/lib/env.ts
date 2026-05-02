const normalizeUrl = (url: string): string => url.trim().replace(/\/+$/, '');

export function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL;
  if (typeof configured === 'string' && configured.trim()) {
    return normalizeUrl(configured);
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3001';
  }

  throw new Error(
    'Missing API base URL. Set VITE_API_URL for production deploys (for example, your hosted API origin).'
  );
}
