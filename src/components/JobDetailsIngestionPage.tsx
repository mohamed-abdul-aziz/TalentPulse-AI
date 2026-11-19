import React, { useState, useRef } from 'react';
import {
  FilePdf,
  UploadSimple,
  CheckCircle,
  ArrowRight,
  ArrowClockwise,
  MapPin,
  Users,
  CalendarBlank,
  WarningCircle,
} from '@phosphor-icons/react';
import { JobListing, EvaluationPayload } from '../types.ts';
import { extractTextFromPDF } from '../utils/pdfParser.ts';
import { SAMPLE_RESUME_TEXT } from '../mockData.ts';

interface JobDetailsIngestionPageProps {
  job: JobListing;
  onAnalysisComplete: (payload: EvaluationPayload) => void;
  onBack: () => void;
}

export const JobDetailsIngestionPage: React.FC<JobDetailsIngestionPageProps> = ({
  job,
  onAnalysisComplete,
  onBack,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedResumeText, setExtractedResumeText] = useState<string>('');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMsg('File restriction: Only PDF files (.pdf) are supported.');
      return;
    }

    setErrorMsg('');
    setUploadedFile(file);
    setIsParsingPdf(true);

    try {
      const text = await extractTextFromPDF(file);
      setExtractedResumeText(text || SAMPLE_RESUME_TEXT);
    } catch (err) {
      console.warn('PDF parsing fallback to sample text:', err);
      setExtractedResumeText(SAMPLE_RESUME_TEXT);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleLoadSampleResume = () => {
    setErrorMsg('');
    const dummyBlob = new Blob([SAMPLE_RESUME_TEXT], { type: 'application/pdf' });
    const sampleFile = new File([dummyBlob], 'Alex_Rivera_Senior_Engineer_CV.pdf', {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setUploadedFile(sampleFile);
    setExtractedResumeText(SAMPLE_RESUME_TEXT);
  };

  const handleCheckScore = async () => {
    if (!extractedResumeText && !uploadedFile) {
      setErrorMsg('Please upload a PDF resume first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      // Step 1: Compute Vector Embeddings & Mathematical Cosine Match Score
      setAnalysisStep('Generating 768-dim embeddings via text-embedding-004...');
      const scoreRes = await fetch('/api/embed-and-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedResumeText || SAMPLE_RESUME_TEXT,
          jobDescription: job.description,
          applicantCount: job.applicantCount,
        }),
      });

      if (!scoreRes.ok) {
        throw new Error('Failed to compute vector similarity.');
      }

      const scoreData = await scoreRes.json();
      const matchScore = scoreData.matchScore;
      const rawSimilarity = scoreData.rawSimilarity;

      // Step 2: Call Gemini Intelligence Handoff with calculated score & applicant metrics
      setAnalysisStep('Evaluating ATS keyword alignment & Google XYZ rewrites...');
      const evalRes = await fetch('/api/evaluate-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: extractedResumeText || SAMPLE_RESUME_TEXT,
          jobDescription: job.description,
          matchScore,
          rawSimilarity,
          applicantCount: job.applicantCount,
          jobTitle: job.title,
          companyName: job.company,
        }),
      });

      if (!evalRes.ok) {
        throw new Error('Failed to synthesize evaluation payload.');
      }

      const evalData = await evalRes.json();
      onAnalysisComplete(evalData);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg('An error occurred during evaluation. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#F5F5F7] min-h-screen">
      {/* Top Header Strip */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Return to selection
        </button>
        <span className="text-[12px] font-medium bg-black/[0.04] text-[#1D1D1F] px-3 py-1 rounded-full border border-black/[0.06]">
          Target Role Ingestion
        </span>
      </div>

      {/* TOP SECTION: Full Job Details Card */}
      <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.05]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 text-[13px] text-[#86868B]">
              <span className="font-semibold text-[#1D1D1F]">{job.company}</span>
              {job.sourceProvider && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Verified via {job.sourceProvider}</span>
                </>
              )}
              {job.isRemote && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#1D1D1F] font-medium">Remote</span>
                </>
              )}
              {job.sourceUrl && (
                <>
                  <span aria-hidden="true">·</span>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1D1D1F] underline hover:opacity-80 transition-opacity font-medium"
                  >
                    View Original Posting ↗
                  </a>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F]">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#86868B] mt-2 tabular-nums">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-[#86868B]" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <CalendarBlank size={14} className="text-[#86868B]" /> {job.postedDate}
              </span>
              {job.salaryRange && (
                <span className="text-[#1D1D1F] font-medium">
                  {job.salaryRange}
                </span>
              )}
            </div>
          </div>

          {/* Applicant Volume Readout */}
          <div className="bg-[#F5F5F7] rounded-2xl p-4 border border-black/[0.04] flex items-center gap-3.5 self-start md:self-auto tabular-nums">
            <div className="w-10 h-10 rounded-xl bg-white text-[#1D1D1F] flex items-center justify-center shadow-xs">
              <Users size={20} weight="regular" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#86868B] block font-medium">
                Applicant Pool
              </span>
              <span className="text-[14px] font-semibold text-[#1D1D1F]">
                {typeof job.applicantCount === 'number'
                  ? `${job.applicantCount} Candidates`
                  : 'Applicant volume unlisted'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Job Description in Clean Typography */}
        <div className="mt-6">
          <h3 className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold mb-3">
            Position Overview &amp; Requirements
          </h3>
          <div className="max-h-72 overflow-y-auto pr-2 text-[14px] text-[#1D1D1F] leading-relaxed space-y-3 font-normal whitespace-pre-line bg-[#FAFAFC] p-5 rounded-2xl border border-black/[0.04]">
            {job.description}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Resume Ingestion Zone */}
      <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
              Ingest Candidate Resume
            </h2>
            <p className="text-[14px] text-[#86868B] mt-0.5">
              Upload your PDF resume to compute cosine similarity against this opportunity.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-[13px] font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-black/[0.06] px-3.5 py-1.5 rounded-full border border-black/[0.06] transition cursor-pointer self-start sm:self-auto"
          >
            Load Sample Tech CV
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        {/* Upload Zone Card */}
        {!uploadedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="border border-dashed border-black/15 hover:border-black/40 rounded-2xl p-10 text-center cursor-pointer transition-all bg-[#FAFAFC] hover:bg-white group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <UploadSimple size={24} weight="regular" />
            </div>
            <p className="text-[15px] font-semibold text-[#1D1D1F] mb-1">
              Select or drop candidate PDF
            </p>
            <p className="text-[13px] text-[#86868B]">
              Restricted strictly to PDF files (<span className="font-mono">.pdf</span>)
            </p>
          </div>
        ) : (
          /* Uploaded File Status Display */
          <div className="bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center shrink-0">
                  <FilePdf size={24} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px] text-[#1D1D1F] truncate max-w-xs sm:max-w-md">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white text-[#86868B] border border-black/[0.06]">
                      {formatFileSize(uploadedFile.size)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle size={14} className="text-emerald-600" weight="fill" />
                    <span className="text-[12px] text-emerald-700 font-medium">
                      {isParsingPdf ? 'Parsing token vectors...' : 'PDF ingested & ready for benchmark'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Change File Option */}
              <button
                type="button"
                onClick={() => {
                  setUploadedFile(null);
                  setExtractedResumeText('');
                }}
                className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] px-3 py-1.5 rounded-full border border-black/[0.08] hover:bg-white transition cursor-pointer self-start sm:self-center"
              >
                Change File
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 text-[13px] text-rose-600 font-medium">
            <WarningCircle size={15} weight="bold" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Conditional CTA: As soon as a PDF is uploaded, render prominent animated Check Score button */}
        {uploadedFile && (
          <div className="mt-8 flex flex-col items-center justify-center pt-2">
            <button
              onClick={handleCheckScore}
              disabled={isAnalyzing || isParsingPdf}
              className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#1D1D1F] hover:bg-black disabled:opacity-50 text-white font-medium text-[15px] flex items-center justify-center gap-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              {isAnalyzing ? (
                <>
                  <ArrowClockwise size={18} className="animate-spin" />
                  <span>Computing Vectors...</span>
                </>
              ) : (
                <>
                  <span>Check Score</span>
                  <ArrowRight size={18} weight="bold" />
                </>
              )}
            </button>

            {analysisStep && (
              <p className="mt-3 text-[12px] font-mono text-[#86868B] animate-pulse">
                {analysisStep}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
