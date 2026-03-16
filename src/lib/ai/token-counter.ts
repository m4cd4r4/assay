/**
 * Token estimation and cost calculation for quoting.
 */

import type { CobolProject } from '@/types/cobol';
import type { CostEstimate } from '@/types/job';

const TOKENS_PER_LINE = 18;
const PASSES_PER_PROGRAM = 5;
const OUTPUT_TOKENS_PER_PASS = 4000;

// Batch API pricing (50% discount)
const BATCH_INPUT_PRICE = 2.5; // per MTok
const BATCH_OUTPUT_PRICE = 12.5; // per MTok
const LONG_CONTEXT_INPUT_PRICE = 5.0; // per MTok (>200K tokens)
const LONG_CONTEXT_OUTPUT_PRICE = 18.75; // per MTok

const PRICING_TIERS = [
  { tier: 'S' as const, maxLines: 25_000, price: 2_500 },
  { tier: 'M' as const, maxLines: 100_000, price: 5_000 },
  { tier: 'L' as const, maxLines: 500_000, price: 12_000 },
  { tier: 'XL' as const, maxLines: Infinity, price: 25_000 },
];

export function estimateProjectCost(project: CobolProject): CostEstimate {
  const totalInputTokens = project.totalLines * TOKENS_PER_LINE;
  const totalOutputTokens = project.totalPrograms * PASSES_PER_PROGRAM * OUTPUT_TOKENS_PER_PASS;

  // Estimate API cost using batch pricing
  const isLongContext = totalInputTokens / project.totalPrograms > 200_000;
  const inputPrice = isLongContext ? LONG_CONTEXT_INPUT_PRICE : BATCH_INPUT_PRICE;
  const outputPrice = isLongContext ? LONG_CONTEXT_OUTPUT_PRICE : BATCH_OUTPUT_PRICE;

  const estimatedApiCost =
    (totalInputTokens / 1_000_000) * inputPrice * PASSES_PER_PROGRAM +
    (totalOutputTokens / 1_000_000) * outputPrice;

  const tier = PRICING_TIERS.find((t) => project.totalLines <= t.maxLines)!;

  return {
    totalLines: project.totalLines,
    totalPrograms: project.totalPrograms,
    totalCopybooks: project.totalCopybooks,
    estimatedTokens: totalInputTokens + totalOutputTokens,
    estimatedApiCost: Math.ceil(estimatedApiCost * 100) / 100,
    pricingTier: tier.tier,
    tierPrice: tier.price,
  };
}
