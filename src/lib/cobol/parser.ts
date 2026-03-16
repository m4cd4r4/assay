/**
 * Regex-based COBOL structural parser.
 *
 * COBOL's rigid column-based format makes regex parsing viable for V1.
 * We extract enough structure to:
 *   1. Identify program boundaries and IDs
 *   2. Resolve COPY/CALL dependencies
 *   3. Compute metrics for cost estimation
 *   4. Provide structural context to the LLM
 *
 * This is NOT a full compiler parser. We intentionally skip:
 *   - Expression parsing within statements
 *   - PICTURE clause validation
 *   - Scope terminator matching
 *   - Free-format COBOL (rare in enterprise, handle in V2)
 */

import type {
  CobolFile,
  CobolFileType,
  CobolStructure,
  CobolDivision,
  CobolSection,
  CobolParagraph,
  CobolDataItem,
  CobolFileDescriptor,
  CobolCopyStatement,
  CobolCallStatement,
  CobolMetrics,
} from '@/types/cobol';

// --- Regex patterns ---
// These match fixed-format COBOL (columns 7-72, with 6-char sequence area)

const DIVISION_RE = /^\s{0,6}\s+(\w[\w-]*)\s+DIVISION\b/i;
const SECTION_RE = /^\s{0,6}\s+(\w[\w-]*)\s+SECTION\b/i;
const PARAGRAPH_RE = /^\s{7,11}(\w[\w-]*)\s*\.\s*$/;
const PROGRAM_ID_RE = /\bPROGRAM-ID\.\s*(\w[\w-]*)/i;
const COPY_RE = /\bCOPY\s+['"]?(\w[\w-]*)['"]?(?:\s+REPLACING\s+(.+?))?(?:\s*\.)/i;
const CALL_STATIC_RE = /\bCALL\s+['"](\w[\w-]*)['"]/i;
const CALL_DYNAMIC_RE = /\bCALL\s+(\w[\w-]*)\b(?!\s*['"])/i;
const FD_RE = /^\s{0,6}\s+FD\s+(\w[\w-]*)/i;
const SD_RE = /^\s{0,6}\s+SD\s+(\w[\w-]*)/i;
const LEVEL_RE = /^\s{0,6}\s+(0[1-9]|[1-4][0-9]|77|88)\s+(\w[\w-]*)/;
const PIC_RE = /\bPIC(?:TURE)?\s+IS\s+(.+?)(?:\s|\.)|PIC(?:TURE)?\s+(.+?)(?:\s|\.)/i;
const USAGE_RE = /\bUSAGE\s+(?:IS\s+)?(\w[\w-]*)/i;
const OCCURS_RE = /\bOCCURS\s+(\d+)/i;
const REDEFINES_RE = /\bREDEFINES\s+(\w[\w-]*)/i;
const COMMENT_RE = /^\s{0,5}[*\/]/;
const SEQUENCE_NUM_RE = /^\d{6}/;
const BLANK_RE = /^\s*$/;

const COBOL_EXTENSIONS = new Set(['.cbl', '.cob', '.cobol', '.CBL', '.COB', '.COBOL']);
const COPYBOOK_EXTENSIONS = new Set(['.cpy', '.copy', '.CPY', '.COPY']);
const JCL_EXTENSIONS = new Set(['.jcl', '.JCL', '.proc', '.PROC']);

export function classifyFileType(filename: string): CobolFileType {
  const ext = filename.slice(filename.lastIndexOf('.'));
  if (COBOL_EXTENSIONS.has(ext)) return 'program';
  if (COPYBOOK_EXTENSIONS.has(ext)) return 'copybook';
  if (JCL_EXTENSIONS.has(ext)) return 'jcl';
  return 'unknown';
}

export function detectSequenceNumbers(content: string): boolean {
  const lines = content.split('\n').slice(0, 20);
  const seqCount = lines.filter((line) => SEQUENCE_NUM_RE.test(line)).length;
  return seqCount > lines.length * 0.5;
}

export function stripSequenceNumbers(content: string): string {
  if (!detectSequenceNumbers(content)) return content;
  return content
    .split('\n')
    .map((line) => {
      if (SEQUENCE_NUM_RE.test(line)) {
        return '      ' + line.slice(6);
      }
      return line;
    })
    .join('\n');
}

export function createCobolFile(
  filename: string,
  path: string,
  content: string,
): CobolFile {
  const hasSeqNums = detectSequenceNumbers(content);
  const cleanContent = hasSeqNums ? stripSequenceNumbers(content) : content;

  return {
    filename,
    path,
    type: classifyFileType(filename),
    content: cleanContent,
    lineCount: cleanContent.split('\n').length,
    sizeBytes: new TextEncoder().encode(cleanContent).length,
    encoding: 'ascii',
    hasSequenceNumbers: hasSeqNums,
  };
}

export function parseCobolStructure(file: CobolFile): CobolStructure {
  const lines = file.content.split('\n');

  const divisions = parseDivisions(lines);
  const sections = parseSections(lines, divisions);
  const paragraphs = parseParagraphs(lines, sections);
  const programId = extractProgramId(lines);
  const copyStatements = extractCopyStatements(lines);
  const callStatements = extractCallStatements(lines);
  const fileDescriptors = extractFileDescriptors(lines);
  const dataItems = extractDataItems(lines, divisions);
  const metrics = computeMetrics(lines, paragraphs, copyStatements, callStatements, dataItems);

  return {
    programId,
    file,
    divisions,
    sections,
    paragraphs,
    dataItems,
    fileDescriptors,
    copyStatements,
    callStatements,
    metrics,
  };
}

function extractProgramId(lines: string[]): string {
  for (const line of lines) {
    const match = line.match(PROGRAM_ID_RE);
    if (match) return match[1];
  }
  return 'UNKNOWN';
}

function parseDivisions(lines: string[]): CobolDivision[] {
  const divisions: CobolDivision[] = [];
  const divisionOrder: CobolDivision['name'][] = [
    'IDENTIFICATION',
    'ENVIRONMENT',
    'DATA',
    'PROCEDURE',
  ];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(DIVISION_RE);
    if (match) {
      const rawName = match[1].toUpperCase();
      // Handle ID DIVISION as IDENTIFICATION DIVISION
      const name = rawName === 'ID' ? 'IDENTIFICATION' : rawName;
      if (divisionOrder.includes(name as CobolDivision['name'])) {
        // Close previous division
        if (divisions.length > 0) {
          divisions[divisions.length - 1].endLine = i - 1;
        }
        divisions.push({
          name: name as CobolDivision['name'],
          startLine: i,
          endLine: lines.length - 1,
        });
      }
    }
  }

  // Close last division
  if (divisions.length > 0) {
    divisions[divisions.length - 1].endLine = lines.length - 1;
  }

  return divisions;
}

function parseSections(lines: string[], divisions: CobolDivision[]): CobolSection[] {
  const sections: CobolSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(SECTION_RE);
    if (match) {
      const sectionName = match[1].toUpperCase();
      const division = divisions.find(
        (d) => i >= d.startLine && i <= d.endLine,
      );

      if (sections.length > 0) {
        sections[sections.length - 1].endLine = i - 1;
      }

      sections.push({
        name: sectionName,
        division: division?.name ?? 'UNKNOWN',
        startLine: i,
        endLine: lines.length - 1,
      });
    }
  }

  if (sections.length > 0) {
    sections[sections.length - 1].endLine = lines.length - 1;
  }

  return sections;
}

function parseParagraphs(lines: string[], sections: CobolSection[]): CobolParagraph[] {
  const paragraphs: CobolParagraph[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip comments, blanks, and division/section headers
    if (COMMENT_RE.test(line) || BLANK_RE.test(line)) continue;
    if (DIVISION_RE.test(line) || SECTION_RE.test(line)) continue;

    const match = line.match(PARAGRAPH_RE);
    if (match) {
      const paragraphName = match[1].toUpperCase();
      // Skip known COBOL keywords that look like paragraphs
      const keywords = new Set([
        'FD', 'SD', 'COPY', 'REPLACE', 'WORKING-STORAGE', 'LINKAGE',
        'FILE', 'SCREEN', 'REPORT', 'COMMUNICATION', 'LOCAL-STORAGE',
      ]);
      if (keywords.has(paragraphName)) continue;

      const section = sections.find(
        (s) => i >= s.startLine && i <= s.endLine,
      );

      if (paragraphs.length > 0) {
        paragraphs[paragraphs.length - 1].endLine = i - 1;
      }

      paragraphs.push({
        name: paragraphName,
        section: section?.name ?? null,
        startLine: i,
        endLine: lines.length - 1,
      });
    }
  }

  if (paragraphs.length > 0) {
    paragraphs[paragraphs.length - 1].endLine = lines.length - 1;
  }

  return paragraphs;
}

function extractCopyStatements(lines: string[]): CobolCopyStatement[] {
  const copies: CobolCopyStatement[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (COMMENT_RE.test(lines[i])) continue;
    const match = lines[i].match(COPY_RE);
    if (match) {
      copies.push({
        copybookName: match[1].toUpperCase(),
        replacing: match[2]?.trim() ?? null,
        lineNumber: i,
      });
    }
  }

  return copies;
}

function extractCallStatements(lines: string[]): CobolCallStatement[] {
  const calls: CobolCallStatement[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (COMMENT_RE.test(lines[i])) continue;

    const staticMatch = lines[i].match(CALL_STATIC_RE);
    if (staticMatch) {
      calls.push({
        programName: staticMatch[1].toUpperCase(),
        isDynamic: false,
        lineNumber: i,
      });
      continue;
    }

    const dynamicMatch = lines[i].match(CALL_DYNAMIC_RE);
    if (dynamicMatch && !lines[i].match(/\bCALL\b/i)) continue;
    if (dynamicMatch) {
      const name = dynamicMatch[1].toUpperCase();
      // Filter out COBOL keywords that follow CALL-like patterns
      const notCalls = new Set(['USING', 'ON', 'END-CALL', 'EXCEPTION', 'OVERFLOW']);
      if (!notCalls.has(name)) {
        calls.push({
          programName: name,
          isDynamic: true,
          lineNumber: i,
        });
      }
    }
  }

  return calls;
}

function extractFileDescriptors(lines: string[]): CobolFileDescriptor[] {
  const fds: CobolFileDescriptor[] = [];

  for (let i = 0; i < lines.length; i++) {
    const fdMatch = lines[i].match(FD_RE);
    const sdMatch = lines[i].match(SD_RE);
    const match = fdMatch ?? sdMatch;
    if (match) {
      // Look for the 01 level record name following the FD
      let recordName: string | null = null;
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const levelMatch = lines[j].match(/^\s{0,6}\s+01\s+(\w[\w-]*)/);
        if (levelMatch) {
          recordName = levelMatch[1].toUpperCase();
          break;
        }
      }
      fds.push({
        name: match[1].toUpperCase(),
        recordName,
        lineNumber: i,
      });
    }
  }

  return fds;
}

function extractDataItems(lines: string[], divisions: CobolDivision[]): CobolDataItem[] {
  const items: CobolDataItem[] = [];
  const dataDivision = divisions.find((d) => d.name === 'DATA');
  if (!dataDivision) return items;

  for (let i = dataDivision.startLine; i <= dataDivision.endLine; i++) {
    if (COMMENT_RE.test(lines[i]) || BLANK_RE.test(lines[i])) continue;

    const levelMatch = lines[i].match(LEVEL_RE);
    if (levelMatch) {
      const level = parseInt(levelMatch[1], 10);
      const name = levelMatch[2].toUpperCase();

      // Extract PIC clause (may be on same line or continuation)
      const fullStatement = gatherContinuationLines(lines, i);
      const picMatch = fullStatement.match(PIC_RE);
      const usageMatch = fullStatement.match(USAGE_RE);
      const occursMatch = fullStatement.match(OCCURS_RE);
      const redefinesMatch = fullStatement.match(REDEFINES_RE);

      items.push({
        level,
        name,
        picture: picMatch ? (picMatch[1] ?? picMatch[2])?.trim() ?? null : null,
        usage: usageMatch ? usageMatch[1].toUpperCase() : null,
        occurs: occursMatch ? parseInt(occursMatch[1], 10) : null,
        redefines: redefinesMatch ? redefinesMatch[1].toUpperCase() : null,
        lineNumber: i,
      });
    }
  }

  return items;
}

function gatherContinuationLines(lines: string[], startIdx: number): string {
  let result = lines[startIdx];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    // Continuation line: hyphen in column 7
    if (line.length > 6 && line[6] === '-') {
      result += ' ' + line.slice(7).trim();
    } else if (line.match(/^\s*$/) || line.match(LEVEL_RE) || line.match(DIVISION_RE) || line.match(SECTION_RE)) {
      break;
    } else {
      // Statement might continue without explicit continuation marker
      const trimmed = line.trim();
      if (trimmed.endsWith('.')) {
        result += ' ' + trimmed;
        break;
      }
      result += ' ' + trimmed;
    }
  }
  return result;
}

function computeMetrics(
  lines: string[],
  paragraphs: CobolParagraph[],
  copies: CobolCopyStatement[],
  calls: CobolCallStatement[],
  dataItems: CobolDataItem[],
): CobolMetrics {
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;

  for (const line of lines) {
    if (BLANK_RE.test(line)) {
      blankLines++;
    } else if (COMMENT_RE.test(line)) {
      commentLines++;
    } else {
      codeLines++;
    }
  }

  // Estimate max nesting depth from IF/PERFORM nesting
  let maxDepth = 0;
  let currentDepth = 0;
  for (const line of lines) {
    if (COMMENT_RE.test(line)) continue;
    const upper = line.toUpperCase();
    if (upper.includes('IF ') || upper.includes('PERFORM ') || upper.includes('EVALUATE ')) {
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    if (upper.includes('END-IF') || upper.includes('END-PERFORM') || upper.includes('END-EVALUATE')) {
      currentDepth = Math.max(0, currentDepth - 1);
    }
  }

  return {
    totalLines: lines.length,
    codeLines,
    commentLines,
    blankLines,
    paragraphCount: paragraphs.length,
    copyCount: copies.length,
    callCount: calls.length,
    dataItemCount: dataItems.length,
    maxNestingDepth: maxDepth,
  };
}
