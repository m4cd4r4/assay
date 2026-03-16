/**
 * Groups COBOL programs with their dependencies for processing.
 *
 * Each group contains a primary program, its referenced copybooks, and
 * optionally its directly-called programs. Groups are sized to fit within
 * the Opus 4.6 context window (~800K tokens safety margin under 1M limit).
 */

import type {
  CobolFile,
  CobolStructure,
  ProcessingGroup,
} from '@/types/cobol';

const TOKENS_PER_LINE = 18; // Conservative: ~15-20 tokens per COBOL line
const MAX_TOKENS_PER_GROUP = 800_000; // Safety margin under 1M limit
const STANDARD_PRICING_THRESHOLD = 200_000;

export function estimateTokens(content: string): number {
  const lines = content.split('\n').length;
  return lines * TOKENS_PER_LINE;
}

export function estimateFileTokens(file: CobolFile): number {
  return estimateTokens(file.content);
}

export function estimateGroupTokens(group: ProcessingGroup): number {
  let total = estimateFileTokens(group.primaryProgram.file);
  for (const copybook of group.copybooks) {
    total += estimateFileTokens(copybook);
  }
  for (const called of group.calledPrograms) {
    total += estimateFileTokens(called.file);
  }
  // Add ~10% for prompt template overhead
  return Math.ceil(total * 1.1);
}

export function isLongContext(tokens: number): boolean {
  return tokens > STANDARD_PRICING_THRESHOLD;
}

export function groupPrograms(
  programs: CobolStructure[],
  copybooks: CobolFile[],
): ProcessingGroup[] {
  const groups: ProcessingGroup[] = [];
  const copybookMap = buildCopybookMap(copybooks);
  const programMap = buildProgramMap(programs);

  for (const program of programs) {
    const resolvedCopybooks = resolveCopybooks(program, copybookMap);
    const resolvedCalls = resolveCalls(program, programMap);

    let group: ProcessingGroup = {
      primaryProgram: program,
      copybooks: resolvedCopybooks,
      calledPrograms: resolvedCalls,
      estimatedTokens: 0,
    };

    group.estimatedTokens = estimateGroupTokens(group);

    // If group exceeds max, drop called programs (process them separately)
    if (group.estimatedTokens > MAX_TOKENS_PER_GROUP) {
      group = {
        primaryProgram: program,
        copybooks: resolvedCopybooks,
        calledPrograms: [],
        estimatedTokens: 0,
      };
      group.estimatedTokens = estimateGroupTokens(group);
    }

    // If still too large (massive program + copybooks), split copybooks
    if (group.estimatedTokens > MAX_TOKENS_PER_GROUP) {
      const splitGroups = splitLargeGroup(program, resolvedCopybooks);
      groups.push(...splitGroups);
    } else {
      groups.push(group);
    }
  }

  return groups;
}

function buildCopybookMap(copybooks: CobolFile[]): Map<string, CobolFile> {
  const map = new Map<string, CobolFile>();
  for (const cb of copybooks) {
    // Index by filename without extension, uppercased
    const baseName = cb.filename
      .replace(/\.(cpy|copy|CPY|COPY)$/, '')
      .toUpperCase();
    map.set(baseName, cb);
  }
  return map;
}

function buildProgramMap(programs: CobolStructure[]): Map<string, CobolStructure> {
  const map = new Map<string, CobolStructure>();
  for (const prog of programs) {
    map.set(prog.programId.toUpperCase(), prog);
  }
  return map;
}

function resolveCopybooks(
  program: CobolStructure,
  copybookMap: Map<string, CobolFile>,
): CobolFile[] {
  const resolved: CobolFile[] = [];
  const seen = new Set<string>();

  for (const copy of program.copyStatements) {
    const name = copy.copybookName.toUpperCase();
    if (seen.has(name)) continue;
    seen.add(name);

    const copybook = copybookMap.get(name);
    if (copybook) {
      resolved.push(copybook);
    }
  }

  return resolved;
}

function resolveCalls(
  program: CobolStructure,
  programMap: Map<string, CobolStructure>,
): CobolStructure[] {
  const resolved: CobolStructure[] = [];
  const seen = new Set<string>();

  for (const call of program.callStatements) {
    const name = call.programName.toUpperCase();
    if (seen.has(name)) continue;
    seen.add(name);

    // Only include static calls — dynamic calls are resolved at runtime
    if (!call.isDynamic) {
      const calledProgram = programMap.get(name);
      if (calledProgram) {
        resolved.push(calledProgram);
      }
    }
  }

  return resolved;
}

function splitLargeGroup(
  program: CobolStructure,
  copybooks: CobolFile[],
): ProcessingGroup[] {
  const groups: ProcessingGroup[] = [];
  let currentCopybooks: CobolFile[] = [];
  let currentTokens = estimateFileTokens(program.file);

  for (const cb of copybooks) {
    const cbTokens = estimateFileTokens(cb);
    if (currentTokens + cbTokens > MAX_TOKENS_PER_GROUP && currentCopybooks.length > 0) {
      groups.push({
        primaryProgram: program,
        copybooks: [...currentCopybooks],
        calledPrograms: [],
        estimatedTokens: currentTokens,
      });
      currentCopybooks = [];
      currentTokens = estimateFileTokens(program.file);
    }
    currentCopybooks.push(cb);
    currentTokens += cbTokens;
  }

  if (currentCopybooks.length > 0 || groups.length === 0) {
    groups.push({
      primaryProgram: program,
      copybooks: currentCopybooks,
      calledPrograms: [],
      estimatedTokens: currentTokens,
    });
  }

  return groups;
}
