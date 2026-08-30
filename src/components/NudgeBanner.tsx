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
      className={`flex flex-col md:flex-row items-center justify-between gap-4 max-w-full break-words p-4 bg-[#F4EFE6] border border-[#E8E1D5] rounded-xl ${className}`}
    >
      <div className="text-center md:text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#B89552] bg-[#F4EFE6] px-3.5 py-1 rounded-full border border-[#E8E1D5] inline-block">
          {title}
        </span>
        {subtitle && (
          <h2 className="text-xl sm:text-2xl font-serif-editorial font-bold text-inherit leading-tight mt-1">
            {subtitle}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
};
