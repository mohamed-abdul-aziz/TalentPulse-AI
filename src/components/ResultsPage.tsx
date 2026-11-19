import React, { useState } from 'react';
import {
  CheckCircle,
  WarningCircle,
  Copy,
  Check,
  Sparkle,
  ArrowLeft,
  FileText,
  RocketLaunch,
  Question,
  Users,
} from '@phosphor-icons/react';
import { EvaluationPayload } from '../types.ts';
import { ScoreGauge } from './ScoreGauge.tsx';

interface ResultsPageProps {
  data: EvaluationPayload;
  onRunNewAnalysis: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ data, onRunNewAnalysis }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [coverLetterCopied, setCoverLetterCopied] = useState(false);
  const [editableCoverLetter, setEditableCoverLetter] = useState(
    data.careerAcceleration.tailoredCoverLetter
  );

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setCoverLetterCopied(true);
      setTimeout(() => setCoverLetterCopied(false), 2000);
    }
  };

  let tierBadgeBg = 'bg-black/[0.04] text-[#1D1D1F] border-black/[0.06]';
  if (data.tier === 'Top 5% Contender') {
    tierBadgeBg = 'bg-[#34C759]/10 text-[#248A3D] border-[#34C759]/20';
  } else if (data.tier === 'Competitive Candidate') {
    tierBadgeBg = 'bg-[#FF9500]/10 text-[#C77700] border-[#FF9500]/20';
  } else if (data.tier === 'Uphill Battle') {
    tierBadgeBg = 'bg-[#FF3B30]/10 text-[#C92A2A] border-[#FF3B30]/20';
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#F5F5F7] min-h-screen space-y-8">
      {/* 1. HEADER: Displays ONLY the Title of the Selected Job in bold, tracking-tight typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
        <div>
          <button
            onClick={onRunNewAnalysis}
            className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center gap-1.5 mb-2.5 cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Benchmark another position</span>
          </button>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]">
            {data.jobTitle} &mdash; {data.companyName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-black/[0.08] text-[#1D1D1F] text-[13px] font-medium rounded-full hover:bg-black/[0.02] transition cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <FileText size={15} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. TOP SCORE METRIC & HIRING PROBABILITY (Side-by-Side Bento Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Circular SVG Progress Ring for Vector Match Score */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-8 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-between text-center relative">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
              Deterministic Vector Similarity
            </span>
            <span className="text-[11px] font-mono bg-[#F5F5F7] text-[#1D1D1F] px-2.5 py-0.5 rounded-full border border-black/[0.04]">
              768-Dim Model
            </span>
          </div>

          <div className="my-auto py-3">
            <ScoreGauge score={data.matchScore} rawSimilarity={data.rawSimilarity} />
          </div>

          <p className="text-[13px] text-[#86868B] max-w-sm mt-4 font-normal">
            Mathematical cosine similarity calibrated directly between candidate CV tokens and JD requisites.
          </p>
        </div>

        {/* Right Card: Hiring Probability with Competition Multiplier Breakdown */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-8 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
              Hiring Probability Benchmark
            </span>
            {data.probabilityAvailable && data.tier && (
              <span className={`text-[12px] px-3 py-0.5 rounded-full font-medium border ${tierBadgeBg}`}>
                {data.tier}
              </span>
            )}
          </div>

          {data.probabilityAvailable && data.hiringProbability !== undefined ? (
            <div className="space-y-5 my-auto">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-bold tracking-tight text-[#1D1D1F]">
                  {data.hiringProbability}%
                </span>
                <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-medium">
                  Calibrated Odds
                </span>
              </div>

              {/* Competition Breakdown */}
              <div className="bg-[#FAFAFC] rounded-2xl p-4 border border-black/[0.04] space-y-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#86868B]">Applicant Pool Volume:</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    {data.applicantCount} candidates
                  </span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#86868B]">Competition Multiplier:</span>
                  <span className="font-semibold text-[#1D1D1F]">
                    {data.competitionMultiplier}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-[12px] pt-1.5 border-t border-black/[0.04]">
                  <span className="text-[#86868B]">Algorithm Computation:</span>
                  <span className="font-mono text-[#86868B]">
                    Math.round({data.matchScore}% × {data.competitionMultiplier}x)
                  </span>
                </div>
              </div>

              {data.tierDescription && (
                <p className="text-[13px] text-[#86868B] leading-relaxed font-normal">
                  {data.tierDescription}
                </p>
              )}
            </div>
          ) : (
            /* Explicit fallback if applicant count is unknown / null */
            <div className="space-y-4 my-auto py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-[12px] font-medium">
                <WarningCircle size={15} weight="bold" />
                <span>Notice: Volume Not Disclosed by Employer</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                Probability not available
              </h3>
              <p className="text-[13px] text-[#86868B] leading-relaxed max-w-md">
                This employer did not publish live applicant headcount figures. While mathematical vector similarity is fully computed, market competition probability requires a verified applicant pool size.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-black/[0.05] flex items-center gap-2 text-[12px] text-[#86868B]">
            <Users size={14} />
            <span>Competition decay: &lt;25 (1.0x), 25-100 (0.85x), 101-300 (0.70x), 300+ (0.55x)</span>
          </div>
        </div>
      </div>

      {/* 3. AI OVERVIEW: Dedicated clean card with 2-to-3 sentence executive recruiter summary */}
      <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkle size={17} weight="fill" className="text-[#1D1D1F]" />
          <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
            Executive Recruiter Intelligence Overview
          </span>
        </div>
        <p className="text-[15px] sm:text-[16px] text-[#1D1D1F] leading-relaxed font-normal">
          {data.aiOverview}
        </p>
      </div>

      {/* 4. TWO PRIMARY ANALYSIS BOXES (Full Width) */}
      <div className="space-y-6">
        {/* Box A: "What's Good About the Match" (Strengths Box) */}
        <div className="bg-white rounded-3xl border border-black/[0.08] border-l-4 border-l-[#34C759] p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#34C759]/10 text-[#248A3D] flex items-center justify-center">
                <CheckCircle size={18} weight="fill" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                What&apos;s Good About the Match
              </h3>
            </div>
            <span className="text-[12px] font-medium text-[#248A3D] bg-[#34C759]/10 px-3 py-1 rounded-full border border-[#34C759]/20">
              Verified Alignments
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {data.strengths.highlights.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] mt-2 shrink-0" />
                <p className="text-[14px] text-[#1D1D1F] leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          {/* Grouped Matched Technical Tags */}
          <div className="pt-4 border-t border-black/[0.05]">
            <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold block mb-2.5">
              Matched Technical Competencies
            </span>
            <div className="flex flex-wrap gap-2">
              {data.strengths.technicalTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#34C759]/10 text-[#248A3D] border border-[#34C759]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Box B: "What to Improve" (Gaps Box) */}
        <div className="bg-white rounded-3xl border border-black/[0.08] border-l-4 border-l-[#FF3B30] p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30]/10 text-[#C92A2A] flex items-center justify-center">
                <WarningCircle size={18} weight="fill" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                What to Improve
              </h3>
            </div>
            <span className="text-[12px] font-medium text-[#C92A2A] bg-[#FF3B30]/10 px-3 py-1 rounded-full border border-[#FF3B30]/20">
              Skill &amp; Keyword Deficits
            </span>
          </div>

          <div className="space-y-3 mb-6">
            {data.gaps.missingSkills.map((gap, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] mt-2 shrink-0" />
                <p className="text-[14px] text-[#1D1D1F] leading-relaxed">{gap}</p>
              </div>
            ))}
          </div>

          {/* Flagged Missing Non-Negotiables & ATS Keywords */}
          <div className="pt-4 border-t border-black/[0.05]">
            <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold block mb-2.5">
              Missing High-Weight ATS Keywords
            </span>
            <div className="flex flex-wrap gap-2">
              {data.gaps.atsKeywordsMissing.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#FF3B30]/10 text-[#C92A2A] border border-[#FF3B30]/20"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. EXTENDED INTELLIGENCE MODULES */}
      <div className="space-y-8 pt-4">
        {/* Module A: Google "XYZ" Bullet Point Optimizer */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <span className="text-[12px] uppercase tracking-wider text-[#86868B] font-semibold">
                Executive CV Optimization
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-[#1D1D1F] mt-0.5">
                Google &quot;XYZ&quot; Bullet Optimizer
              </h3>
            </div>
            <span className="text-[12px] font-medium bg-[#F5F5F7] text-[#1D1D1F] px-3.5 py-1 rounded-full border border-black/[0.06] self-start sm:self-auto">
              Accomplished [X] as measured by [Y], by doing [Z]
            </span>
          </div>

          <div className="space-y-4">
            {data.xyzBulletOptimizations.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFC] rounded-2xl p-5 sm:p-6 border border-black/[0.04] space-y-3"
              >
                {/* Original Weak Bullet */}
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#C92A2A] font-semibold block mb-1">
                    Original Resume Bullet (Passive)
                  </span>
                  <p className="text-[13px] text-[#86868B] italic bg-white p-3.5 rounded-xl border border-black/[0.04]">
                    &quot;{item.originalBullet}&quot;
                  </p>
                </div>

                {/* Rewritten XYZ Bullet with Copy Button */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-[#248A3D] font-semibold flex items-center gap-1">
                      <Sparkle size={13} weight="fill" />
                      Optimized Google XYZ Formula
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.rewrittenXYZ, idx)}
                      className="text-[12px] font-medium text-[#1D1D1F] hover:bg-black/[0.06] flex items-center gap-1 cursor-pointer bg-white px-3 py-1 rounded-full border border-black/[0.08] shadow-xs transition"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={14} className="text-[#34C759]" />
                          <span className="text-[#248A3D] font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Bullet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[14px] font-medium text-[#1D1D1F] bg-white p-4 rounded-xl border border-[#34C759]/30 text-left leading-relaxed">
                    {item.rewrittenXYZ}
                  </p>
                </div>

                {/* Impact Factor */}
                <div className="flex items-center gap-1.5 text-[12px] text-[#86868B] pt-1">
                  <span className="font-semibold text-[#1D1D1F]">Recruiter Rationale:</span>
                  <span>{item.impactFactor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module B: Reverse Match Roadmap & Interview Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reverse Match Roadmap */}
          <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RocketLaunch size={20} className="text-[#1D1D1F]" weight="regular" />
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                  Reverse Match Roadmap
                </h3>
              </div>
              <p className="text-[13px] text-[#86868B] mb-5">
                Targeted micro-projects engineered to bridge high-priority technical gaps in 3-5 days.
              </p>

              <div className="space-y-4">
                {data.careerAcceleration.reverseMatchRoadmap.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl border border-black/[0.04] bg-[#FAFAFC] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-[14px] font-semibold text-[#1D1D1F]">{proj.title}</h4>
                      <span className="text-[12px] font-medium text-[#1D1D1F] bg-white px-2.5 py-0.5 rounded-full border border-black/[0.06]">
                        {proj.timeline}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.skillsAddressed.map((s, si) => (
                        <span
                          key={si}
                          className="text-[11px] px-2.5 py-0.5 rounded-full bg-white text-[#86868B] border border-black/[0.06]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-[13px] text-[#86868B] leading-relaxed">
                      <strong className="text-[#1D1D1F] font-medium">Deliverable:</strong> {proj.deliverable}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Predicted Interview Questions Targeting Weak Areas */}
          <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Question size={20} className="text-[#1D1D1F]" weight="regular" />
                <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                  Defensive Interview Questions
                </h3>
              </div>
              <p className="text-[13px] text-[#86868B] mb-5">
                Targeted technical probes probing deficit areas with defensive positioning strategies.
              </p>

              <div className="space-y-4">
                {data.careerAcceleration.interviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl border border-black/[0.04] bg-[#FAFAFC] space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-[#C92A2A] font-semibold bg-[#FF3B30]/10 px-2.5 py-0.5 rounded-full border border-[#FF3B30]/20">
                        Deficit: {q.targetedWeakness}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#1D1D1F] leading-snug">
                      &quot;{q.question}&quot;
                    </p>
                    <div className="text-[13px] text-[#86868B] leading-relaxed bg-white p-3 rounded-xl border border-black/[0.04]">
                      <strong className="text-[#1D1D1F] block mb-0.5 text-[11px] uppercase tracking-wider font-semibold">
                        Defense Strategy
                      </strong>
                      {q.defenseStrategy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module C: Tailored 3-Paragraph Executive Cover Letter */}
        <div className="bg-white rounded-3xl border border-black/[0.08] p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F]">
                Tailored Executive Cover Letter
              </h3>
              <p className="text-[13px] text-[#86868B] mt-0.5">
                Precision 3-paragraph executive narrative directly positioned for {data.companyName}&apos;s requisites. Fully editable.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(editableCoverLetter)}
              className="px-5 py-2.5 bg-[#1D1D1F] hover:bg-black text-white text-[13px] font-medium rounded-full transition cursor-pointer shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              {coverLetterCopied ? (
                <>
                  <Check size={16} />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={10}
            value={editableCoverLetter}
            onChange={(e) => setEditableCoverLetter(e.target.value)}
            className="w-full p-4 bg-[#FAFAFC] border border-black/[0.06] rounded-2xl text-[14px] text-[#1D1D1F] leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/10 font-normal"
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/[0.06]">
        <button
          onClick={onRunNewAnalysis}
          className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Select another job or resume</span>
        </button>

        <span className="text-[12px] text-[#86868B]">
          TalentPulse AI &bull; Vector Cosine Match
        </span>
      </div>
    </div>
  );
};
