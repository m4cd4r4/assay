/**
 * Generates Mermaid diagrams from the dependency graph.
 * Used as a fallback when the LLM-generated diagram is unavailable,
 * and for quick structural overviews.
 */

import type { DependencyGraph } from '@/lib/cobol/call-chain';

export function generateSystemDependencyDiagram(graph: DependencyGraph): string {
  const lines: string[] = ['graph TD'];

  // Define program nodes (rectangles)
  for (const node of graph.programNodes) {
    lines.push(`    ${sanitizeId(node)}["${node}"]`);
  }

  // Define copybook nodes (rounded)
  for (const node of graph.copybookNodes) {
    lines.push(`    ${sanitizeId(node)}(("${node}"))`);
  }

  // Define unresolved nodes (dashed)
  for (const name of graph.unresolvedCalls) {
    if (!graph.programNodes.has(name)) {
      lines.push(`    ${sanitizeId(name)}["${name} ❓"]:::unresolved`);
    }
  }
  for (const name of graph.unresolvedCopies) {
    if (!graph.copybookNodes.has(name)) {
      lines.push(`    ${sanitizeId(name)}(("${name} ❓")):::unresolved`);
    }
  }

  // Add edges
  for (const edge of graph.edges) {
    const fromId = sanitizeId(edge.from);
    const toId = sanitizeId(edge.to);
    if (edge.type === 'CALL') {
      const style = edge.isDynamic ? '-.->' : '-->';
      lines.push(`    ${fromId} ${style} ${toId}`);
    } else {
      lines.push(`    ${fromId} -.-> ${toId}`);
    }
  }

  // Style definitions
  lines.push('');
  lines.push('    classDef unresolved stroke-dasharray: 5 5,fill:#fff3cd');

  return lines.join('\n');
}

export function generateProgramCallDiagram(
  programId: string,
  graph: DependencyGraph,
): string {
  const id = programId.toUpperCase();
  const lines: string[] = ['graph LR'];

  // Center node
  lines.push(`    ${sanitizeId(id)}["${id}"]:::primary`);

  // Callers
  const callers = graph.edges
    .filter((e) => e.to === id && e.type === 'CALL')
    .map((e) => e.from);

  for (const caller of callers) {
    lines.push(`    ${sanitizeId(caller)}["${caller}"] --> ${sanitizeId(id)}`);
  }

  // Callees
  const callees = graph.edges
    .filter((e) => e.from === id && e.type === 'CALL')
    .map((e) => e.to);

  for (const callee of callees) {
    lines.push(`    ${sanitizeId(id)} --> ${sanitizeId(callee)}["${callee}"]`);
  }

  // Copybooks
  const copybooks = graph.edges
    .filter((e) => e.from === id && e.type === 'COPY')
    .map((e) => e.to);

  for (const cb of copybooks) {
    lines.push(`    ${sanitizeId(id)} -.-> ${sanitizeId(cb)}(("${cb}"))`);
  }

  lines.push('');
  lines.push('    classDef primary fill:#4f46e5,color:#fff');

  return lines.join('\n');
}

function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}
