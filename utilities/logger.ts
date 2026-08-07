import { TestInfo } from '@playwright/test';

export async function logStep(testInfo: TestInfo, message: string): Promise<void> {
  await testInfo.attach('execution-log', { body: `[${new Date().toISOString()}] ${message}\n`, contentType: 'text/plain' });
}
