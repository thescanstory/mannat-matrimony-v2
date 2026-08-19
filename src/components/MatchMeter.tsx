import React from 'react';

interface MatchMeterProps {
  score: number; // e.g. 94
  size?: number; // e.g. 64
}

export const MatchMeter: React.FC<MatchMeterProps> = ({ score, size = 68 }) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center cursor-pointer group">
      <div 
        className="relative flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md p-1 border border-yellow-500/30 shadow-[0_0_15px_rgba(255,215,0,0.25)] group-hover:scale-105 transition-transform duration-300"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Gold Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#goldGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF099" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#B39200" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[13px] font-black tracking-tight text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {score}%
          </span>
          <span className="text-[8px] uppercase tracking-wider font-semibold text-amber-100/70 -mt-1">
            Match
          </span>
        </div>
      </div>
    </div>
  );
};
