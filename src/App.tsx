import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingDashboard } from './components/LandingDashboard.tsx';
import { JobSearchPage } from './components/JobSearchPage.tsx';
import { PasteJobLinkPage } from './components/PasteJobLinkPage.tsx';
import { JobDetailsIngestionPage } from './components/JobDetailsIngestionPage.tsx';
import { ResumeOptimizerPage } from './components/ResumeOptimizerPage.tsx';
import { ResultsPage } from './components/ResultsPage.tsx';
import { JobListing, EvaluationPayload } from './types.ts';
import { SAMPLE_JOBS } from './mockData.ts';

type ActiveView = 'landing' | 'search' | 'paste-link' | 'job-details' | 'optimizer' | 'results';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [selectedJob, setSelectedJob] = useState<JobListing>(SAMPLE_JOBS[0]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationPayload | null>(null);

  // Navigation handlers
  const handleGoHome = () => {
    setActiveView('landing');
  };

  const handleSelectJobFromSearch = (job: JobListing) => {
    setSelectedJob(job);
    setActiveView('job-details');
  };

  const handleJobExtractedFromUrl = (job: JobListing) => {
    setSelectedJob(job);
    setActiveView('job-details');
  };

  const handleSelectSampleJob = (jobId: string) => {
    const found = SAMPLE_JOBS.find((j) => j.id === jobId) || SAMPLE_JOBS[0];
    setSelectedJob(found);
    setActiveView('job-details');
  };

  const handleAnalysisComplete = (payload: EvaluationPayload) => {
    setEvaluationResult(payload);
    setActiveView('results');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col font-sans selection:bg-black/10 selection:text-black">
      {/* Minimalist Top Bar as specified */}
      <Navbar onGoHome={handleGoHome} activeView={activeView} />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeView === 'landing' && (
          <LandingDashboard
            onNavigate={(view) => setActiveView(view)}
            onSelectSampleJob={handleSelectSampleJob}
          />
        )}

        {activeView === 'search' && (
          <JobSearchPage
            onSelectJob={handleSelectJobFromSearch}
            onBack={() => setActiveView('landing')}
          />
        )}

        {activeView === 'paste-link' && (
          <PasteJobLinkPage
            onJobExtracted={handleJobExtractedFromUrl}
            onBack={() => setActiveView('landing')}
          />
        )}

        {activeView === 'job-details' && (
          <JobDetailsIngestionPage
            job={selectedJob}
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setActiveView('search')}
          />
        )}

        {activeView === 'optimizer' && (
          <ResumeOptimizerPage
            onAnalysisComplete={handleAnalysisComplete}
            onBack={() => setActiveView('landing')}
          />
        )}

        {activeView === 'results' && evaluationResult && (
          <ResultsPage
            data={evaluationResult}
            onRunNewAnalysis={() => setActiveView('search')}
          />
        )}
      </main>

      {/* Apple Minimalist Footer */}
      <footer className="mt-auto border-t border-black/[0.06] bg-white/70 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#86868B]">
          <div className="flex items-center gap-2">
            <span>TalentPulse AI &bull; Global Vector Career Alignment</span>
          </div>
          <div className="flex items-center gap-4 text-[#86868B]">
            <span>Deterministic Cosine Similarity</span>
            <span>Worldwide Tech Hubs</span>
            <span>Google XYZ Rewriter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
