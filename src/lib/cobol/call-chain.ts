/**
 * Builds the full CALL/COPY dependency graph for a COBOL project.
 * Used for generating system-level Mermaid diagrams.
 */

import type { CobolStructure, CobolFile } from '@/types/cobol';

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'CALL' | 'COPY';
  isDynamic: boolean;
  lineNumber: number;
}

export interface DependencyGraph {
  nodes: Set<string>;
  edges: DependencyEdge[];
  programNodes: Set<string>;
  copybookNodes: Set<string>;
  orphanCopybooks: string[];
  orphanPrograms: string[];
  unresolvedCalls: string[];
  unresolvedCopies: string[];
}

export function buildDependencyGraph(
  programs: CobolStructure[],
  copybooks: CobolFile[],
): DependencyGraph {
  const nodes = new Set<string>();
  const edges: DependencyEdge[] = [];
  const programNodes = new Set<string>();
  const copybookNodes = new Set<string>();
  const referencedCopybooks = new Set<string>();
  const referencedPrograms = new Set<string>();
  const availablePrograms = new Set<string>();
  const availableCopybooks = new Set<string>();

  // Register all available programs
  for (const prog of programs) {
    const id = prog.programId.toUpperCase();
    nodes.add(id);
    programNodes.add(id);
    availablePrograms.add(id);
  }

  // Register all available copybooks
  for (const cb of copybooks) {
    const name = cb.filename.replace(/\.(cpy|copy|CPY|COPY)$/, '').toUpperCase();
    nodes.add(name);
    copybookNodes.add(name);
    availableCopybooks.add(name);
  }

  // Build edges from each program's CALL and COPY statements
  for (const prog of programs) {
    const fromId = prog.programId.toUpperCase();

    for (const call of prog.callStatements) {
      const toId = call.programName.toUpperCase();
      nodes.add(toId);
      referencedPrograms.add(toId);
      edges.push({
        from: fromId,
        to: toId,
        type: 'CALL',
        isDynamic: call.isDynamic,
        lineNumber: call.lineNumber,
      });
    }

    for (const copy of prog.copyStatements) {
      const toId = copy.copybookName.toUpperCase();
      nodes.add(toId);
      referencedCopybooks.add(toId);
      edges.push({
        from: fromId,
        to: toId,
        type: 'COPY',
        isDynamic: false,
        lineNumber: copy.lineNumber,
      });
    }
  }

  // Identify orphans (defined but never referenced)
  const orphanCopybooks = [...availableCopybooks].filter(
    (name) => !referencedCopybooks.has(name),
  );
  const orphanPrograms = [...availablePrograms].filter(
    (name) => !referencedPrograms.has(name) && programs.length > 1,
  );

  // Identify unresolved references
  const unresolvedCalls = [...referencedPrograms].filter(
    (name) => !availablePrograms.has(name),
  );
  const unresolvedCopies = [...referencedCopybooks].filter(
    (name) => !availableCopybooks.has(name),
  );

  return {
    nodes,
    edges,
    programNodes,
    copybookNodes,
    orphanCopybooks,
    orphanPrograms,
    unresolvedCalls,
    unresolvedCopies,
  };
}

export function getCallersOf(programId: string, graph: DependencyGraph): string[] {
  return graph.edges
    .filter((e) => e.to === programId.toUpperCase() && e.type === 'CALL')
    .map((e) => e.from);
}

export function getCalleesOf(programId: string, graph: DependencyGraph): string[] {
  return graph.edges
    .filter((e) => e.from === programId.toUpperCase() && e.type === 'CALL')
    .map((e) => e.to);
}

export function getCopybooksOf(programId: string, graph: DependencyGraph): string[] {
  return graph.edges
    .filter((e) => e.from === programId.toUpperCase() && e.type === 'COPY')
    .map((e) => e.to);
}
