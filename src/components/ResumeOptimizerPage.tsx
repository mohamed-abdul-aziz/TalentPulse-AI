import React, { useState } from 'react';
import {
  UploadSimple,
  ArrowRight,
  ArrowClockwise,
  WarningCircle,
  FilePdf,
} from '@phosphor-icons/react';
import { EvaluationPayload } from '../types.ts';
import { SAMPLE_JOBS, SAMPLE_RESUME_TEXT } from '../mockData.ts';
import { extractTextFromPDF } from '../utils/pdfParser.ts';

interface ResumeOptimizerPageProps {
  onAnalysisComplete: (payload: EvaluationPayload) => void;
  onBack: () => void;
}

export const ResumeOptimizerPage: React.FC<ResumeOptimizerPageProps> = ({
  onAnalysisComplete,
  onBack,
}) => {
  const [selectedPresetJobId, setSelectedPresetJobId] = useState<string>(SAMPLE_JOBS[0].id);
  const [customJobTitle, setCustomJobTitle] = useState(SAMPLE_JOBS[0].title);
  const [customCompany, setCustomCompany] = useState(SAMPLE_JOBS[0].company);
  const [customApplicantCount, setCustomApplicantCount] = useState<number | ''>(
    SAMPLE_JOBS[0].applicantCount ?? 75
  );
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOBS[0].description);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePresetChange = (jobId: string) => {
    setSelectedPresetJobId(jobId);
    const found = SAMPLE_JOBS.find((j) => j.id === jobId);
    if (found) {
      setCustomJobTitle(found.title);
      setCustomCompany(found.company);
      setCustomApplicantCount(found.applicantCount ?? '');
      setJobDescription(found.description);
    }
  };

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
      setResumeText(text || SAMPLE_RESUME_TEXT);
    } catch (err) {
      setResumeText(SAMPLE_RESUME_TEXT);
    } finally {
      setIsParsingPdf(false);
    }
  };

  const handleLoadSample = () => {
    setErrorMsg('');
    const dummyBlob = new Blob([SAMPLE_RESUME_TEXT], { type: 'application/pdf' });
    const sampleFile = new File([dummyBlob], 'Alex_Rivera_Senior_FullStack_CV.pdf', {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setUploadedFile(sampleFile);
    setResumeText(SAMPLE_RESUME_TEXT);
  };

  const handleRunOptimization = async () => {
    if (!resumeText && !uploadedFile) {
      setErrorMsg('Please upload a PDF resume or click Sample CV.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMsg('Please provide a target job description.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      setAnalysisStep('Computing 768-dimensional token vectors...');
      const scoreRes = await fetch('/api/embed-and-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText || SAMPLE_RESUME_TEXT,
          jobDescription,
          applicantCount: customApplicantCount === '' ? null : Number(customApplicantCount),
        }),
      });

      if (!scoreRes.ok) {
        throw new Error('Vector computation failed.');
      }

      const scoreData = await scoreRes.json();
      const matchScore = scoreData.matchScore;
      const rawSimilarity = scoreData.rawSimilarity;

      setAnalysisStep('Synthesizing Google XYZ formula optimizations & gap roadmap...');
      const evalRes = await fetch('/api/evaluate-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText || SAMPLE_RESUME_TEXT,
          jobDescription,
          matchScore,
          rawSimilarity,
          applicantCount: customApplicantCount === '' ? null : Number(customApplicantCount),
          jobTitle: customJobTitle,
          companyName: customCompany,
        }),
      });

      if (!evalRes.ok) {
        throw new Error('Evaluation synthesis failed.');
      }

      const evalData = await evalRes.json();
      onAnalysisComplete(evalData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error generating vector analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#F5F5F7] min-h-screen space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors mb-3 flex items-center gap-1 cursor-pointer"
        >
          ← Return to overview
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
          Direct Resume Optimizer
        </h1>
        <p className="text-[15px] text-[#86868B] mt-1 font-normal tracking-tight">
          Benchmark your PDF resume against any custom job description or global position.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Role Specs */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-black/[0.08] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.05]">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
              1. Target Role &amp; Global Hub
            </h2>
            <div className="flex items-center gap-1.5 text-[12px] text-[#86868B]">
              <span>Preset:</span>
              <select
                value={selectedPresetJobId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="bg-[#F5F5F7] border border-black/[0.06] rounded-lg px-2.5 py-1 text-[12px] font-medium text-[#1D1D1F]"
              >
                {SAMPLE_JOBS.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.company} ({j.hub || j.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#1D1D1F] mb-1">
                Target Job Title
              </label>
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-[13px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#1D1D1F] mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-[13px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-semibold text-[#1D1D1F]">
                Applicant Pool Volume
              </label>
              <span className="text-[11px] text-[#86868B]">
                Leave empty for &quot;Probability not available&quot;
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={customApplicantCount}
              onChange={(e) =>
                setCustomApplicantCount(e.target.value === '' ? '' : parseInt(e.target.value, 10))
              }
              placeholder="e.g. 142 applicants"
              className="w-full px-3.5 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-[13px] text-[#1D1D1F] font-mono focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#1D1D1F] mb-1">
              Target Job Description &amp; Technical Keywords
            </label>
            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full px-4 py-3 bg-[#F5F5F7] border border-black/[0.06] rounded-xl text-[13px] font-mono text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/10 leading-relaxed"
            />
          </div>
        </div>

        {/* Right Column: PDF Resume Ingestion */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-black/[0.08] p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] mb-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#1D1D1F]">
                2. Ingest Resume
              </h2>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[12px] font-medium text-[#1D1D1F] bg-[#F5F5F7] px-3 py-1 rounded-full border border-black/[0.06] hover:bg-black/[0.06] transition cursor-pointer"
              >
                Sample CV
              </button>
            </div>

            {!uploadedFile ? (
              <label className="border border-dashed border-black/15 hover:border-black/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#FAFAFC] hover:bg-white group">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <UploadSimple size={28} className="text-[#1D1D1F] mb-2 group-hover:scale-105 transition-transform" />
                <span className="text-[14px] font-semibold text-[#1D1D1F] block">
                  Select candidate PDF (.pdf)
                </span>
                <span className="text-[12px] text-[#86868B] mt-1">
                  Or click Sample CV above
                </span>
              </label>
            ) : (
              <div className="bg-[#FAFAFC] border border-black/[0.06] rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <FilePdf size={26} className="text-[#1D1D1F] shrink-0" weight="fill" />
                  <div className="truncate flex-1">
                    <span className="text-[13px] font-semibold text-[#1D1D1F] truncate block">
                      {uploadedFile.name}
                    </span>
                    <span className="text-[11px] font-mono text-[#86868B]">
                      {isParsingPdf ? 'Parsing token vectors...' : 'Ready for scoring'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setResumeText('');
                    }}
                    className="text-[12px] text-[#86868B] hover:text-[#1D1D1F] underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            {resumeText && (
              <div className="mt-4">
                <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold block mb-1">
                  Parsed Content Preview
                </span>
                <div className="h-40 overflow-y-auto p-3 bg-[#FAFAFC] border border-black/[0.04] rounded-xl text-[11px] font-mono text-[#1D1D1F] leading-relaxed whitespace-pre-line">
                  {resumeText}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 flex items-center gap-2 text-[13px] text-rose-600">
                <WarningCircle size={15} weight="bold" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleRunOptimization}
              disabled={isAnalyzing || isParsingPdf}
              className="w-full py-3.5 bg-[#1D1D1F] hover:bg-black disabled:opacity-50 text-white font-medium text-[14px] rounded-full flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <ArrowClockwise size={18} className="animate-spin" />
                  <span>Computing Vectors...</span>
                </>
              ) : (
                <>
                  <span>Run Vector Benchmark</span>
                  <ArrowRight size={17} weight="bold" />
                </>
              )}
            </button>
            {analysisStep && (
              <p className="mt-2 text-center text-[12px] font-mono text-[#86868B] animate-pulse">
                {analysisStep}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
