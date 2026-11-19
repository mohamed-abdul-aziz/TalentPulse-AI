import React from 'react';
import {
  MagnifyingGlass,
  Link as LinkIcon,
  FileText,
  ShieldCheck,
  Cpu,
  ChartLineUp,
  Target,
  ArrowRight,
  GlobeHemisphereWest,
  MapPin,
} from '@phosphor-icons/react';
import { SAMPLE_JOBS } from '../mockData.ts';

interface LandingDashboardProps {
  onNavigate: (view: 'search' | 'paste-link' | 'optimizer') => void;
  onSelectSampleJob: (jobId: string) => void;
}

export const LandingDashboard: React.FC<LandingDashboardProps> = ({
  onNavigate,
  onSelectSampleJob,
}) => {
  return (
    <div className="w-full bg-[#F5F5F7] min-h-screen">
      {/* APPLE-INSPIRED MINIMALIST HERO SECTION */}
      <section className="relative pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Generous White Space & Clean Minimalist Hierarchy */}
        <div className="space-y-6 max-w-4xl">
          {/* Main Title with Luxury Editorial / Italic Serif Accent */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] leading-[1.06] sm:leading-[1.04]">
            Intelligent{' '}
            <span className="font-editorial font-normal tracking-normal text-[#1D1D1F]">
              Career Placement
            </span>{' '}
            <span className="font-light text-[#86868B]">&amp;</span>{' '}
            <span className="font-editorial font-normal tracking-normal text-[#1D1D1F]">
              ATS Alignment
            </span>
          </h1>

          {/* Exactly two lines of concise text with Apple-clean line-height & muted slate color */}
          <p className="text-lg sm:text-xl text-[#86868B] max-w-2xl mx-auto font-normal leading-relaxed tracking-tight">
            Harness deterministic vector matching and applicant intelligence to benchmark your CV against market demand. Real-time ATS parsing, precision gap analysis, and executive resume optimization.
          </p>
        </div>

        {/* Sleek Apple-style Pill Action Buttons Strip */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          {/* Button 1: Job Search (Deep graphite/black primary button) */}
          <button
            onClick={() => onNavigate('search')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1D1D1F] hover:bg-black text-white font-medium text-[15px] flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.12)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <MagnifyingGlass size={18} weight="bold" />
            <span>Job Search</span>
          </button>

          {/* Button 2: Paste Job Link (Crisp white secondary pill button with subtle border) */}
          <button
            onClick={() => onNavigate('paste-link')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#1D1D1F] border border-black/[0.08] hover:border-black/20 font-medium text-[15px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <LinkIcon size={18} weight="bold" className="text-[#1D1D1F]" />
            <span>Paste Job Link</span>
          </button>

          {/* Button 3: Resume Optimizer (Crisp white secondary pill button with subtle border) */}
          <button
            onClick={() => onNavigate('optimizer')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-[#1D1D1F] border border-black/[0.08] hover:border-black/20 font-medium text-[15px] flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <FileText size={18} weight="bold" className="text-[#86868B]" />
            <span>Resume Optimizer</span>
          </button>
        </div>
      </section>

      {/* THREE VALUE ARCHITECTURE BENTO CARDS (Apple-style pure white frosted containers with ultra-fine borders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-black/[0.08] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center mb-5">
              <Cpu size={22} weight="regular" />
            </div>
            <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight mb-2">
              Deterministic Vector Matching
            </h3>
            <p className="text-[14px] text-[#86868B] leading-relaxed mb-6 font-normal">
              Mathematical cosine similarity computed across 768-dimensional token spaces. Not subjective LLM scoring: pure geometric vector alignment.
            </p>
            <div className="text-[12px] font-mono text-[#86868B] bg-[#F5F5F7] px-3.5 py-2.5 rounded-xl border border-black/[0.04]">
              <span className="text-[#1D1D1F] font-medium">sim(u, v) = (u·v) / (||u|| ||v||)</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-black/[0.08] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center mb-5">
              <ChartLineUp size={22} weight="regular" />
            </div>
            <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight mb-2">
              Applicant Volume Multiplier
            </h3>
            <p className="text-[14px] text-[#86868B] leading-relaxed mb-6 font-normal">
              Real-world hiring probability calibrated against live applicant pools: from early submissions (&lt;25 applicants) to ultra-competitive pools (300+).
            </p>
            <div className="text-[12px] font-mono text-[#86868B] bg-[#F5F5F7] px-3.5 py-2.5 rounded-xl border border-black/[0.04]">
              <span className="text-[#1D1D1F] font-medium">Decay: 1.0x → 0.85x → 0.70x → 0.55x</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-black/[0.08] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center mb-5">
              <Target size={22} weight="regular" />
            </div>
            <h3 className="text-lg font-semibold text-[#1D1D1F] tracking-tight mb-2">
              Google &quot;XYZ&quot; Resume Rewriter
            </h3>
            <p className="text-[14px] text-[#86868B] leading-relaxed mb-6 font-normal">
              Re-engineers ambiguous bullet points into executive standard formulas: &quot;Accomplished [X] as measured by [Y], by doing [Z]&quot;.
            </p>
            <div className="text-[12px] font-mono text-[#86868B] bg-[#F5F5F7] px-3.5 py-2.5 rounded-xl border border-black/[0.04]">
              <span className="text-[#1D1D1F] font-medium">Precision ATS Keyword Insertion</span>
            </div>
          </div>
        </div>

        {/* GLOBAL TECH HUBS BENCHMARK SHOWCASE */}
        <div className="mt-12 bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GlobeHemisphereWest size={16} className="text-[#86868B]" weight="bold" />
                <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
                  Global Opportunity Matrix
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Benchmark Across World Tech Hubs
              </h2>
            </div>
            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1D1D1F] hover:text-black transition-colors cursor-pointer self-start sm:self-auto"
            >
              <span>Explore global index</span>
              <ArrowRight size={15} weight="bold" />
            </button>
          </div>

          {/* Cards for Global Hubs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Hub 1: London */}
            <div
              onClick={() => onSelectSampleJob('monzo-lead-systems')}
              className="p-6 rounded-2xl border border-black/[0.06] hover:border-black/20 hover:bg-[#FAFAFC] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[12px] mb-2.5">
                <span className="font-semibold text-[#1D1D1F]">Monzo Bank</span>
                <span className="font-mono bg-black/[0.04] text-[#86868B] px-2 py-0.5 rounded-full text-[11px]">
                  London, UK
                </span>
              </div>
              <h4 className="font-semibold text-[#1D1D1F] text-[16px] mb-1.5 tracking-tight group-hover:text-black transition">
                Staff Distributed Systems Engineer
              </h4>
              <p className="text-[13px] text-[#86868B] mb-4">64 applicants &bull; £125k - £165k</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Go</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Kubernetes</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Cassandra</span>
              </div>
            </div>

            {/* Hub 2: Bengaluru */}
            <div
              onClick={() => onSelectSampleJob('swiggy-principal-ai')}
              className="p-6 rounded-2xl border border-black/[0.06] hover:border-black/20 hover:bg-[#FAFAFC] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[12px] mb-2.5">
                <span className="font-semibold text-[#1D1D1F]">Swiggy</span>
                <span className="font-mono bg-black/[0.04] text-[#86868B] px-2 py-0.5 rounded-full text-[11px]">
                  Bengaluru, India
                </span>
              </div>
              <h4 className="font-semibold text-[#1D1D1F] text-[16px] mb-1.5 tracking-tight group-hover:text-black transition">
                Principal Machine Learning Engineer
              </h4>
              <p className="text-[13px] text-[#86868B] mb-4">195 applicants &bull; ₹55L - ₹75L</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">PyTorch</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">RL</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Graph NNs</span>
              </div>
            </div>

            {/* Hub 3: Berlin */}
            <div
              onClick={() => onSelectSampleJob('zalando-sr-frontend')}
              className="p-6 rounded-2xl border border-black/[0.06] hover:border-black/20 hover:bg-[#FAFAFC] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[12px] mb-2.5">
                <span className="font-semibold text-[#1D1D1F]">Zalando</span>
                <span className="font-mono bg-black/[0.04] text-[#86868B] px-2 py-0.5 rounded-full text-[11px]">
                  Berlin, Germany
                </span>
              </div>
              <h4 className="font-semibold text-[#1D1D1F] text-[16px] mb-1.5 tracking-tight group-hover:text-black transition">
                Senior Frontend Architect
              </h4>
              <p className="text-[13px] text-[#86868B] mb-4">48 applicants &bull; €95k - €125k</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">TypeScript</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Next.js</span>
                <span className="text-[11px] bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-1 rounded-full font-medium">Web Perf</span>
              </div>
            </div>
          </div>
        </div>

        {/* ATS Verification strip */}
        <div className="mt-14 text-center">
          <span className="text-[12px] uppercase tracking-wider text-[#86868B] block mb-5 font-semibold">
            Calibrated Against Global Enterprise Applicant Tracking Systems
          </span>
          <div className="flex flex-wrap items-center justify-center gap-7 sm:gap-10 text-[13px] font-medium text-[#1D1D1F]">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#86868B]" weight="bold" /> Greenhouse
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#86868B]" weight="bold" /> Lever
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#86868B]" weight="bold" /> Ashby
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#86868B]" weight="bold" /> Workday
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#86868B]" weight="bold" /> Taleo
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
