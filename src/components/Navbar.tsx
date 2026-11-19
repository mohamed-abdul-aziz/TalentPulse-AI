import React from 'react';
import { Pulse } from '@phosphor-icons/react';

interface NavbarProps {
  onGoHome: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onGoHome, activeView }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/80 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand logo & name only - clicking it returns to landing */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/10 rounded-full px-2 py-1 transition-all"
          aria-label="TalentPulse AI Home"
        >
          <div className="w-7 h-7 rounded-lg bg-[#1D1D1F] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <Pulse size={17} weight="bold" />
          </div>
          <div className="flex items-center gap-1.5 text-left">
            <span className="font-semibold text-[15px] tracking-tight text-[#1D1D1F]">
              TalentPulse
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-black/[0.04] text-[#86868B] border border-black/[0.06] tracking-wide">
              AI
            </span>
          </div>
        </button>

        {/* Minimalist context indicator without blinking green dot */}
        {activeView !== 'landing' ? (
          <button
            onClick={onGoHome}
            className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Overview</span>
            <span className="text-black/30">/</span>
            <span className="text-[#1D1D1F] capitalize font-medium">
              {activeView === 'job-details'
                ? 'Target Role'
                : activeView === 'paste-link'
                ? 'Job Ingestion'
                : activeView === 'optimizer'
                ? 'Optimizer'
                : activeView}
            </span>
          </button>
        ) : (
          <div className="text-[12px] text-[#86868B] tracking-tight hidden sm:block font-normal">
            Deterministic Career Alignment
          </div>
        )}
      </div>
    </header>
  );
};
