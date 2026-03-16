/**
 * Types for the generated documentation output.
 */

export interface ProgramDocumentation {
  programId: string;
  filename: string;
  overview: ProgramOverview;
  businessRules: BusinessRule[];
  dependencyMap: string; // Mermaid diagram source
  deadCode: DeadCodeItem[];
  dataFlow: string; // Mermaid diagram source
  generatedAt: string;
}

export interface ProgramOverview {
  summary: string;
  businessPurpose: string;
  inputs: DataEndpoint[];
  outputs: DataEndpoint[];
  processingSteps: ProcessingStep[];
  errorHandling: string;
  dependencies: DependencyRef[];
  modernizationNotes: string;
}

export interface DataEndpoint {
  name: string;
  type: 'file' | 'linkage' | 'database' | 'screen';
  description: string;
}

export interface ProcessingStep {
  stepNumber: number;
  paragraphName: string;
  lineRange: string;
  description: string;
}

export interface BusinessRule {
  ruleId: string;
  location: string;
  lineNumbers: string;
  condition: string;
  action: string;
  businessMeaning: string;
  severity: 'CRITICAL' | 'IMPORTANT' | 'INFORMATIONAL';
  dataFields: string[];
}

export interface DeadCodeItem {
  type: 'PARAGRAPH' | 'SECTION' | 'DATA-ITEM' | 'COPYBOOK-FIELD';
  name: string;
  lineNumbers: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: 'REMOVE' | 'REVIEW' | 'KEEP';
  reason: string;
}

export interface DependencyRef {
  name: string;
  type: 'CALL' | 'COPY';
  description: string;
}

export interface KnowledgeBase {
  projectName: string;
  generatedAt: string;
  programs: ProgramDocumentation[];
  systemDependencyMap: string; // Full system Mermaid diagram
  glossary: GlossaryEntry[];
  statistics: ProjectStatistics;
  index: IndexEntry[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  usedIn: string[];
}

export interface ProjectStatistics {
  totalPrograms: number;
  totalCopybooks: number;
  totalLines: number;
  totalCodeLines: number;
  totalCommentLines: number;
  totalBusinessRules: number;
  totalDeadCodeItems: number;
  estimatedDeadCodePercentage: number;
}

export interface IndexEntry {
  title: string;
  path: string;
  type: 'program' | 'copybook' | 'diagram' | 'overview';
  description: string;
}
