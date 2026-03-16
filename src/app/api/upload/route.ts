/**
 * POST /api/upload
 *
 * Accepts COBOL source files, parses them structurally,
 * and returns a cost estimate + job ID for processing.
 *
 * Request: multipart/form-data with files[] field
 * Response: { jobId, costEstimate, files[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createCobolFile, parseCobolStructure, classifyFileType } from '@/lib/cobol/parser';
import { groupPrograms } from '@/lib/cobol/grouper';
import { estimateProjectCost } from '@/lib/ai/token-counter';
import { createJob, setJobProject } from '@/lib/jobs/store';
import type { CobolFile, CobolStructure, CobolProject } from '@/types/cobol';
import type { UploadedFile } from '@/types/job';

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_EXTENSIONS = new Set([
  '.cbl', '.cob', '.cobol', '.cpy', '.copy', '.jcl', '.proc',
  '.CBL', '.COB', '.COBOL', '.CPY', '.COPY', '.JCL', '.PROC',
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided. Upload .cbl and .cpy files.' },
        { status: 400 },
      );
    }

    // Validate files
    let totalSize = 0;
    const validFiles: { file: File; ext: string }[] = [];

    for (const file of files) {
      const ext = file.name.slice(file.name.lastIndexOf('.'));
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.name}. Allowed: .cbl, .cob, .cpy, .copy, .jcl` },
          { status: 400 },
        );
      }

      totalSize += file.size;
      if (totalSize > MAX_UPLOAD_SIZE) {
        return NextResponse.json(
          { error: 'Total upload size exceeds 100MB limit.' },
          { status: 400 },
        );
      }

      validFiles.push({ file, ext });
    }

    // Parse all files
    const cobolFiles: CobolFile[] = [];
    const programs: CobolStructure[] = [];
    const copybooks: CobolFile[] = [];
    const uploadedFiles: UploadedFile[] = [];

    for (const { file } of validFiles) {
      const content = await file.text();
      const cobolFile = createCobolFile(file.name, file.name, content);
      cobolFiles.push(cobolFile);

      uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: cobolFile.type,
        lineCount: cobolFile.lineCount,
      });

      if (cobolFile.type === 'program') {
        const structure = parseCobolStructure(cobolFile);
        programs.push(structure);
      } else if (cobolFile.type === 'copybook') {
        copybooks.push(cobolFile);
      }
    }

    if (programs.length === 0) {
      return NextResponse.json(
        { error: 'No COBOL programs (.cbl) found in upload. At least one program is required.' },
        { status: 400 },
      );
    }

    // Group programs for processing
    const groups = groupPrograms(programs, copybooks);

    // Build project
    const projectName = formData.get('projectName') as string || 'Untitled Project';
    const project: CobolProject = {
      name: projectName,
      files: cobolFiles,
      programs,
      copybooks,
      jclFiles: cobolFiles.filter((f) => f.type === 'jcl'),
      groups,
      totalLines: cobolFiles.reduce((sum, f) => sum + f.lineCount, 0),
      totalPrograms: programs.length,
      totalCopybooks: copybooks.length,
    };

    // Estimate cost
    const costEstimate = estimateProjectCost(project);

    // Create job
    const job = createJob(projectName, costEstimate);
    setJobProject(job.id, project);

    return NextResponse.json({
      jobId: job.id,
      costEstimate,
      files: uploadedFiles,
      groups: groups.length,
      summary: {
        totalPrograms: programs.length,
        totalCopybooks: copybooks.length,
        totalLines: project.totalLines,
        totalGroups: groups.length,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process uploaded files.' },
      { status: 500 },
    );
  }
}
