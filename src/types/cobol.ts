/**
 * COBOL source code type definitions for Assay.
 *
 * These types represent the structural elements extracted from COBOL source
 * files by the regex parser. They are intentionally simplified for V1 —
 * we capture enough structure to group files intelligently and provide
 * context to the LLM, not to build a full compiler.
 */

export type CobolFileType = 'program' | 'copybook' | 'jcl' | 'data' | 'unknown';

export interface CobolFile {
  filename: string;
  path: string;
  type: CobolFileType;
  content: string;
  lineCount: number;
  sizeBytes: number;
  encoding: 'ascii' | 'ebcdic';
  hasSequenceNumbers: boolean;
}

export interface CobolDivision {
  name: 'IDENTIFICATION' | 'ENVIRONMENT' | 'DATA' | 'PROCEDURE';
  startLine: number;
  endLine: number;
}

export interface CobolSection {
  name: string;
  division: string;
  startLine: number;
  endLine: number;
}

export interface CobolParagraph {
  name: string;
  section: string | null;
  startLine: number;
  endLine: number;
}

export interface CobolDataItem {
  level: number;
  name: string;
  picture: string | null;
  usage: string | null;
  occurs: number | null;
  redefines: string | null;
  lineNumber: number;
}

export interface CobolFileDescriptor {
  name: string;
  recordName: string | null;
  lineNumber: number;
}

export interface CobolCopyStatement {
  copybookName: string;
  replacing: string | null;
  lineNumber: number;
}

export interface CobolCallStatement {
  programName: string;
  isDynamic: boolean;
  lineNumber: number;
}

export interface CobolStructure {
  programId: string;
  file: CobolFile;
  divisions: CobolDivision[];
  sections: CobolSection[];
  paragraphs: CobolParagraph[];
  dataItems: CobolDataItem[];
  fileDescriptors: CobolFileDescriptor[];
  copyStatements: CobolCopyStatement[];
  callStatements: CobolCallStatement[];
  metrics: CobolMetrics;
}

export interface CobolMetrics {
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  paragraphCount: number;
  copyCount: number;
  callCount: number;
  dataItemCount: number;
  maxNestingDepth: number;
}

export interface ProcessingGroup {
  primaryProgram: CobolStructure;
  copybooks: CobolFile[];
  calledPrograms: CobolStructure[];
  estimatedTokens: number;
}

export interface CobolProject {
  name: string;
  files: CobolFile[];
  programs: CobolStructure[];
  copybooks: CobolFile[];
  jclFiles: CobolFile[];
  groups: ProcessingGroup[];
  totalLines: number;
  totalPrograms: number;
  totalCopybooks: number;
}
