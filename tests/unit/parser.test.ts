import { describe, it, expect } from 'vitest';
import {
  classifyFileType,
  detectSequenceNumbers,
  stripSequenceNumbers,
  createCobolFile,
  parseCobolStructure,
} from '@/lib/cobol/parser';

describe('COBOL parser', () => {
  describe('classifyFileType', () => {
    it('classifies .cbl as program', () => {
      expect(classifyFileType('PAYROLL.cbl')).toBe('program');
    });

    it('classifies .CBL as program (case-insensitive extension)', () => {
      expect(classifyFileType('PAYROLL.CBL')).toBe('program');
    });

    it('classifies .cob as program', () => {
      expect(classifyFileType('test.cob')).toBe('program');
    });

    it('classifies .cpy as copybook', () => {
      expect(classifyFileType('DATE-UTIL.cpy')).toBe('copybook');
    });

    it('classifies .copy as copybook', () => {
      expect(classifyFileType('COMMON.copy')).toBe('copybook');
    });

    it('classifies .jcl as jcl', () => {
      expect(classifyFileType('RUNPAY.jcl')).toBe('jcl');
    });

    it('classifies .proc as jcl', () => {
      expect(classifyFileType('COMPILE.proc')).toBe('jcl');
    });

    it('returns unknown for unrecognized extensions', () => {
      expect(classifyFileType('readme.txt')).toBe('unknown');
      expect(classifyFileType('data.dat')).toBe('unknown');
    });
  });

  describe('detectSequenceNumbers', () => {
    it('detects sequence numbers when majority of lines have 6-digit prefixes', () => {
      const content = [
        '000100 IDENTIFICATION DIVISION.',
        '000200 PROGRAM-ID. TEST.',
        '000300 DATA DIVISION.',
        '000400 PROCEDURE DIVISION.',
      ].join('\n');
      expect(detectSequenceNumbers(content)).toBe(true);
    });

    it('returns false when lines lack sequence numbers', () => {
      const content = [
        '       IDENTIFICATION DIVISION.',
        '       PROGRAM-ID. TEST.',
        '       DATA DIVISION.',
      ].join('\n');
      expect(detectSequenceNumbers(content)).toBe(false);
    });
  });

  describe('stripSequenceNumbers', () => {
    it('replaces 6-digit prefix with 6 spaces', () => {
      const input = '000100 IDENTIFICATION DIVISION.\n000200 PROGRAM-ID. TEST.';
      const result = stripSequenceNumbers(input);
      expect(result).toContain('       IDENTIFICATION DIVISION.');
      expect(result).toContain('       PROGRAM-ID. TEST.');
    });

    it('returns content unchanged if no sequence numbers detected', () => {
      const input = '       IDENTIFICATION DIVISION.';
      expect(stripSequenceNumbers(input)).toBe(input);
    });
  });

  describe('createCobolFile', () => {
    it('creates a CobolFile with correct metadata', () => {
      const content = '       IDENTIFICATION DIVISION.\n       PROGRAM-ID. FOO.';
      const file = createCobolFile('FOO.cbl', '/src/FOO.cbl', content);

      expect(file.filename).toBe('FOO.cbl');
      expect(file.path).toBe('/src/FOO.cbl');
      expect(file.type).toBe('program');
      expect(file.lineCount).toBe(2);
      expect(file.hasSequenceNumbers).toBe(false);
      expect(file.content).toBe(content);
    });

    it('strips sequence numbers when detected', () => {
      const content = '000100 IDENTIFICATION DIVISION.\n000200 PROGRAM-ID. BAR.';
      const file = createCobolFile('BAR.cbl', '/BAR.cbl', content);

      expect(file.hasSequenceNumbers).toBe(true);
      expect(file.content).not.toContain('000100');
    });
  });

  describe('parseCobolStructure', () => {
    const sampleCobol = [
      '       IDENTIFICATION DIVISION.',
      '       PROGRAM-ID. PAYROLL-CALC.',
      '       DATA DIVISION.',
      '       WORKING-STORAGE SECTION.',
      '       01 WS-TOTAL PIC 9(7)V99.',
      '       PROCEDURE DIVISION.',
      '       0000-MAIN-CONTROL.',
      '           PERFORM 1000-INIT',
      '           STOP RUN.',
      '       1000-INIT.',
      '           MOVE 0 TO WS-TOTAL.',
    ].join('\n');

    it('extracts the program ID', () => {
      const file = createCobolFile('test.cbl', '/test.cbl', sampleCobol);
      const structure = parseCobolStructure(file);
      expect(structure.programId).toBe('PAYROLL-CALC');
    });

    it('finds divisions', () => {
      const file = createCobolFile('test.cbl', '/test.cbl', sampleCobol);
      const structure = parseCobolStructure(file);
      const divNames = structure.divisions.map((d) => d.name);
      expect(divNames).toContain('IDENTIFICATION');
      expect(divNames).toContain('DATA');
      expect(divNames).toContain('PROCEDURE');
    });

    it('finds paragraphs in PROCEDURE DIVISION', () => {
      const file = createCobolFile('test.cbl', '/test.cbl', sampleCobol);
      const structure = parseCobolStructure(file);
      const paraNames = structure.paragraphs.map((p) => p.name);
      expect(paraNames).toContain('0000-MAIN-CONTROL');
      expect(paraNames).toContain('1000-INIT');
    });

    it('computes metrics', () => {
      const file = createCobolFile('test.cbl', '/test.cbl', sampleCobol);
      const structure = parseCobolStructure(file);
      expect(structure.metrics.totalLines).toBe(11);
      expect(structure.metrics.paragraphCount).toBeGreaterThanOrEqual(2);
    });

    it('extracts data items', () => {
      const file = createCobolFile('test.cbl', '/test.cbl', sampleCobol);
      const structure = parseCobolStructure(file);
      const itemNames = structure.dataItems.map((d) => d.name);
      expect(itemNames).toContain('WS-TOTAL');
    });
  });
});
