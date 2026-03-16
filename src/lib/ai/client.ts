/**
 * Anthropic API client wrapper for Assay.
 *
 * Wraps the official SDK with retry logic, cost tracking,
 * and structured output handling.
 */

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-opus-4-6';
const MAX_OUTPUT_TOKENS = 16384;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Pricing per million tokens (USD)
const PRICING = {
  standard: { input: 5, output: 25 },
  longContext: { input: 10, output: 37.5 },
  batch: { input: 2.5, output: 12.5 },
  batchLongContext: { input: 5, output: 18.75 },
} as const;

export interface ApiCallResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
  model: string;
  durationMs: number;
}

export interface CostTracker {
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  callCount: number;
}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY environment variable is required. Set it in .env.local',
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

function calculateCost(
  inputTokens: number,
  outputTokens: number,
  isLongContext: boolean,
  isBatch: boolean,
): number {
  let pricing;
  if (isBatch && isLongContext) {
    pricing = PRICING.batchLongContext;
  } else if (isBatch) {
    pricing = PRICING.batch;
  } else if (isLongContext) {
    pricing = PRICING.longContext;
  } else {
    pricing = PRICING.standard;
  }

  return (
    (inputTokens / 1_000_000) * pricing.input +
    (outputTokens / 1_000_000) * pricing.output
  );
}

export async function callOpus(
  systemPrompt: string,
  userPrompt: string,
  options: {
    maxTokens?: number;
    isLongContext?: boolean;
    isBatch?: boolean;
  } = {},
): Promise<ApiCallResult> {
  const {
    maxTokens = MAX_OUTPUT_TOKENS,
    isLongContext = false,
    isBatch = false,
  } = options;

  const anthropic = getClient();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const start = Date.now();

      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const durationMs = Date.now() - start;
      const content = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n');

      const inputTokens = response.usage.input_tokens;
      const outputTokens = response.usage.output_tokens;

      return {
        content,
        inputTokens,
        outputTokens,
        cost: calculateCost(inputTokens, outputTokens, isLongContext, isBatch),
        model: MODEL,
        durationMs,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on auth errors or invalid requests
      if (
        lastError.message.includes('401') ||
        lastError.message.includes('400') ||
        lastError.message.includes('invalid')
      ) {
        throw lastError;
      }

      // Retry on rate limits and server errors
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError ?? new Error('Max retries exceeded');
}

export function createCostTracker(): CostTracker {
  return {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    callCount: 0,
  };
}

export function trackCall(tracker: CostTracker, result: ApiCallResult): void {
  tracker.totalInputTokens += result.inputTokens;
  tracker.totalOutputTokens += result.outputTokens;
  tracker.totalCost += result.cost;
  tracker.callCount += 1;
}
