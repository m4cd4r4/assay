# Assay

COBOL codebase documentation generator powered by Claude Opus 4.6.
https://assay.software

## Project Structure
- `src/lib/cobol/` — COBOL parsing, grouping, dependency resolution
- `src/lib/ai/` — Anthropic API client, prompt templates, batch processing
- `src/lib/output/` — Markdown, Mermaid, knowledge base generation
- `src/types/` — TypeScript type definitions
- `public/demo/` — Sample COBOL files for testing

## Stack
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS (glassmorphism design)
- Zustand (state management)
- Anthropic SDK (Claude Opus 4.6, 1M context)
- Vercel (hosting)

## Key Design Decisions
- Read-only tool — never modifies source code
- Regex parser for V1 (COBOL's rigid format makes this viable)
- No database — stateless processing pipeline
- 5-pass documentation: overview, business rules, dependency map, dead code, data flow
- Privacy-first: source code processed via API, not stored persistently

## Business Context
- Product of Solaisoft Pty Ltd, trading as Assay
- Target: banks, government, insurance running COBOL
- Pricing: $20-80K per engagement based on codebase size
- API cost: $8-170 per engagement (97-99% margin)
