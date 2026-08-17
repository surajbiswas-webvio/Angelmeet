import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith('replace-with-')) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://app.angelmeet.ai',
  email: () => required('E2E_EMAIL'),
  password: () => required('E2E_PASSWORD')
};
