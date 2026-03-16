/**
 * Opus 4.6 prompt templates for COBOL documentation generation.
 *
 * Each prompt is designed for a specific documentation pass:
 *   1. Program Overview — full plain-English documentation
 *   2. Business Rule Extraction — structured rule catalog
 *   3. Dependency Map — Mermaid flowchart generation
 *   4. Dead Code Detection — unused code identification
 *   5. Data Flow Diagram — Mermaid sequence diagram
 */

import type { CobolStructure, ProcessingGroup } from '@/types/cobol';
import type { DependencyGraph } from '@/lib/cobol/call-chain';

const SYSTEM_PROMPT = `You are a senior COBOL systems analyst with 30 years of mainframe experience at major financial institutions. You are documenting a COBOL codebase for knowledge preservation — the original developers are retiring and their institutional knowledge must be captured before it is lost.

Your audience is a modern developer who may have never seen COBOL before. Be thorough, precise, and explain every business concept in plain English. Use markdown formatting throughout.

Rules:
- Reference specific line numbers when describing logic
- Use the exact COBOL data names and paragraph names from the source
- Explain COBOL-specific concepts (COMP-3, REDEFINES, OCCURS, etc.) when they appear
- Flag any patterns that would be different in a modern language
- If something is unclear or ambiguous, say so explicitly rather than guessing`;

export function buildOverviewPrompt(group: ProcessingGroup): {
  system: string;
  user: string;
} {
  const prog = group.primaryProgram;
  const copybooks = group.copybooks;
  const calledPrograms = group.calledPrograms;

  let userPrompt = `Analyze this COBOL program and produce comprehensive documentation.

PROGRAM: ${prog.programId}
FILE: ${prog.file.filename}
LINES: ${prog.file.lineCount}
REFERENCED COPYBOOKS: ${prog.copyStatements.map((c) => c.copybookName).join(', ') || 'None'}
CALLS: ${prog.callStatements.map((c) => c.programName).join(', ') || 'None'}

--- SOURCE CODE START ---
${prog.file.content}
--- SOURCE CODE END ---`;

  for (const cb of copybooks) {
    userPrompt += `\n\n--- COPYBOOK: ${cb.filename} ---\n${cb.content}\n--- END COPYBOOK ---`;
  }

  for (const called of calledPrograms) {
    userPrompt += `\n\n--- CALLED PROGRAM: ${called.programId} (${called.file.filename}) ---\n${called.file.content}\n--- END CALLED PROGRAM ---`;
  }

  userPrompt += `

Produce the following sections in markdown:

## 1. Program Summary
One paragraph: what does this program do in plain English? What is its role in the larger system?

## 2. Business Purpose
What business function does this serve? What would break if it stopped running? Who relies on its output?

## 3. Inputs and Outputs
- What files does it read? (FD entries, SELECT statements)
- What files does it write?
- What data does it receive via LINKAGE SECTION?
- What data does it pass to called programs?
- What screens does it display? (if CICS)

## 4. Processing Logic
Step-by-step description of the PROCEDURE DIVISION logic. Use numbered steps. For each step, reference the paragraph name and line numbers.

## 5. Business Rules
Extract every conditional (IF/EVALUATE/WHEN) that represents a business rule. For each rule:
- What condition is being tested
- What action is taken
- Why this matters to the business

## 6. Data Structures
Document every 01-level item in WORKING-STORAGE and LINKAGE SECTION. For group items, document key subordinate fields. Explain the business meaning of each field.

## 7. Error Handling
How does the program handle errors? What happens on failure? Are there ABEND codes or return codes?

## 8. Dependencies
List all CALL and COPY dependencies with brief descriptions of what each provides.

## 9. Modernization Notes
What patterns in this code would be different in a modern language? Flag deprecated features, GOTOs, anti-patterns, or complex constructs that would benefit from refactoring.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}

export function buildBusinessRulePrompt(group: ProcessingGroup): {
  system: string;
  user: string;
} {
  const prog = group.primaryProgram;

  let userPrompt = `Extract all business rules from this COBOL program.

PROGRAM: ${prog.programId}

--- SOURCE CODE ---
${prog.file.content}
--- END SOURCE CODE ---`;

  for (const cb of group.copybooks) {
    userPrompt += `\n\n--- COPYBOOK: ${cb.filename} ---\n${cb.content}\n--- END COPYBOOK ---`;
  }

  userPrompt += `

A business rule is any conditional logic that enforces a business constraint, validates data, calculates a result, or makes a decision.

For each business rule, output a markdown table row with these columns:

| Rule ID | Location | Condition | Action | Business Meaning | Severity | Data Fields |
|---------|----------|-----------|--------|-----------------|----------|-------------|

Where:
- **Rule ID**: BR-${prog.programId}-{sequence number, starting at 001}
- **Location**: Paragraph name and line numbers
- **Condition**: The IF/EVALUATE condition described in plain English
- **Action**: What happens when the condition is true
- **Business Meaning**: Why this rule exists from a business perspective
- **Severity**: CRITICAL (affects money or compliance), IMPORTANT (affects correctness), or INFORMATIONAL (logging/display)
- **Data Fields**: COBOL field names involved

Output the table header once, then one row per rule. If there are no business rules, state that explicitly.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}

export function buildDependencyMapPrompt(graph: DependencyGraph): {
  system: string;
  user: string;
} {
  const edgeDescriptions = graph.edges.map((e) => {
    const style = e.type === 'CALL' ? 'solid arrow' : 'dashed arrow';
    const dynamic = e.isDynamic ? ' (dynamic)' : '';
    return `${e.from} --[${e.type}${dynamic}]--> ${e.to}`;
  });

  const userPrompt = `Generate a Mermaid flowchart showing the dependencies between these COBOL programs and copybooks.

PROGRAM NODES: ${[...graph.programNodes].join(', ')}
COPYBOOK NODES: ${[...graph.copybookNodes].join(', ')}

RELATIONSHIPS:
${edgeDescriptions.join('\n')}

${graph.unresolvedCalls.length > 0 ? `UNRESOLVED CALLS (external programs not in this codebase): ${graph.unresolvedCalls.join(', ')}` : ''}
${graph.unresolvedCopies.length > 0 ? `UNRESOLVED COPYBOOKS (not found in this codebase): ${graph.unresolvedCopies.join(', ')}` : ''}

Generate a valid Mermaid diagram using:
- graph TD (top-down layout)
- Solid arrows (-->) for CALL relationships
- Dashed arrows (-.->)  for COPY relationships
- Rectangle nodes for programs
- Rounded nodes for copybooks (use (( )) syntax)
- If there are more than 15 nodes, group related programs into subgraphs by logical business domain
- Use brief labels on arrows when helpful
- Mark unresolved/external references with a distinct style (e.g., dashed border)

Output ONLY the Mermaid diagram code block, starting with \`\`\`mermaid and ending with \`\`\`. No other text.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}

export function buildDeadCodePrompt(group: ProcessingGroup): {
  system: string;
  user: string;
} {
  const prog = group.primaryProgram;

  let userPrompt = `Analyze this COBOL program to identify dead code — paragraphs, sections, or data items that are defined but never referenced.

PROGRAM: ${prog.programId}

PARSED STRUCTURE:
- Paragraphs: ${prog.paragraphs.map((p) => p.name).join(', ')}
- Data items (01-level): ${prog.dataItems.filter((d) => d.level === 1).map((d) => d.name).join(', ')}
- COPY statements: ${prog.copyStatements.map((c) => c.copybookName).join(', ') || 'None'}
- CALL statements: ${prog.callStatements.map((c) => c.programName).join(', ') || 'None'}

--- SOURCE CODE ---
${prog.file.content}
--- END SOURCE CODE ---`;

  for (const cb of group.copybooks) {
    userPrompt += `\n\n--- COPYBOOK: ${cb.filename} ---\n${cb.content}\n--- END COPYBOOK ---`;
  }

  userPrompt += `

For each potential dead code item, output a markdown table row:

| Type | Name | Lines | Confidence | Recommendation | Reason |
|------|------|-------|------------|----------------|--------|

Where:
- **Type**: PARAGRAPH, SECTION, DATA-ITEM, or COPYBOOK-FIELD
- **Name**: The COBOL identifier
- **Lines**: Line number(s)
- **Confidence**: HIGH (definitely unused), MEDIUM (likely unused but could be called dynamically), LOW (used in a non-obvious way)
- **Recommendation**: REMOVE, REVIEW, or KEEP
- **Reason**: Brief explanation

Be conservative — only flag HIGH confidence items as REMOVE. Consider that:
- Paragraphs may be called via PERFORM THRU ranges
- Data items may be part of REDEFINES groups
- Fields may be accessed via reference modification
- Dynamic CALLs may reference paragraphs indirectly`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}

export function buildDataFlowPrompt(group: ProcessingGroup): {
  system: string;
  user: string;
} {
  const prog = group.primaryProgram;

  let userPrompt = `Trace the data flow through this COBOL program and generate a Mermaid sequence diagram.

PROGRAM: ${prog.programId}
FILE DESCRIPTORS: ${prog.fileDescriptors.map((f) => f.name).join(', ') || 'None'}
LINKAGE ITEMS: ${prog.dataItems.filter((d) => d.level === 1).map((d) => d.name).join(', ')}

--- SOURCE CODE ---
${prog.file.content}
--- END SOURCE CODE ---`;

  for (const cb of group.copybooks) {
    userPrompt += `\n\n--- COPYBOOK: ${cb.filename} ---\n${cb.content}\n--- END COPYBOOK ---`;
  }

  userPrompt += `

Generate:

1. A Mermaid sequence diagram showing data movement between:
   - Input files (READ operations)
   - Working storage (MOVE, COMPUTE, ADD, etc.)
   - Called programs (CALL ... USING)
   - Output files (WRITE operations)
   - Screens (SEND MAP, DISPLAY)

2. After the diagram, a brief narrative description of each major data transformation.

Output the Mermaid diagram in a code block (\`\`\`mermaid ... \`\`\`), followed by the narrative as a numbered list.`;

  return { system: SYSTEM_PROMPT, user: userPrompt };
}
