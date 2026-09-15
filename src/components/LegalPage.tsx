import React from 'react';
import { LegalModal, type LegalDocType } from './LegalModal';

interface LegalPageProps {
  initialDoc?: LegalDocType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialDoc = 'privacy' }) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
      <LegalModal
        isOpen={true}
        onClose={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }}
        initialDoc={initialDoc}
      />
    </div>
  );
};
