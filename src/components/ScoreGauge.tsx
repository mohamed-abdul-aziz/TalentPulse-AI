import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  rawSimilarity?: number;
  size?: number;
  strokeWidth?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  rawSimilarity,
  size = 190,
  strokeWidth = 14,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.round(score / 35));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  let strokeColor = '#34C759'; // Apple green >= 80
  let textColor = 'text-[#34C759]';
  let badgeText = 'High Alignment';
  let badgeBg = 'bg-[#34C759]/10 text-[#248A3D] border-[#34C759]/20';

  if (score < 60) {
    strokeColor = '#FF3B30'; // Apple red < 60
    textColor = 'text-[#FF3B30]';
    badgeText = 'Low Alignment';
    badgeBg = 'bg-[#FF3B30]/10 text-[#C92A2A] border-[#FF3B30]/20';
  } else if (score < 80) {
    strokeColor = '#FF9500'; // Apple amber 60-79
    textColor = 'text-[#FF9500]';
    badgeText = 'Moderate Fit';
    badgeBg = 'bg-[#FF9500]/10 text-[#C77700] border-[#FF9500]/20';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EFEFF4"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className={`text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F]`}>
              {animatedScore}
            </span>
            <span className="text-xl font-semibold text-[#86868B] ml-0.5">%</span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-medium mt-0.5">
            Vector Match
          </span>
        </div>
      </div>

      <div className="mt-3.5 flex flex-col items-center gap-1.5">
        <span className={`text-[12px] px-3 py-0.5 rounded-full font-medium border ${badgeBg}`}>
          {badgeText}
        </span>
        {rawSimilarity !== undefined && (
          <span className="text-[12px] text-[#86868B]">
            Cosine Similarity: <strong className="text-[#1D1D1F] font-semibold">{rawSimilarity.toFixed(3)}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
