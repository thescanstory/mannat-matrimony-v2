import React from 'react';
import type { ReactNode } from 'react';

interface NudgeBannerProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const NudgeBanner: React.FC<NudgeBannerProps> = ({
  title,
  subtitle,
  children,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col md:flex-row items-center justify-between gap-4 max-w-full break-words p-4 bg-[#F8F6F2] border border-[#E8DDD0] rounded-2xl ${className}`}
    >
      <div className="text-center md:text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#560406] bg-white px-3.5 py-1 rounded-full border border-[#E8DDD0] inline-block">
          {title}
        </span>
        {subtitle && (
          <h2 className="text-xl sm:text-2xl font-bold text-inherit leading-tight mt-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {subtitle}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};
