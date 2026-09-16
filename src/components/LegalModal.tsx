import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Trash2, Headphones } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'eula' | 'guidelines' | 'deletion' | 'support';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'privacy'
}) => {
  const [activeDoc, setActiveDoc] = React.useState<LegalDocType>(initialDoc);

  React.useEffect(() => {
    setActiveDoc(initialDoc);
  }, [initialDoc, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 text-left">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border-2 border-[#560406]/30 rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DDD0] bg-[#FAF7F2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#560406] text-[#A17B5E] flex items-center justify-center font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#161412] leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  House of Mannat · Legal &amp; Policies
                </h3>
                <p className="text-[10px] text-[#A17B5E] uppercase tracking-wider font-bold">
                  Last Updated: September 2026 · App Store Guideline Compliant
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 text-[#560406] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#E8DDD0] bg-[#F8F4EF] p-1.5 gap-1 overflow-x-auto shrink-0 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveDoc('privacy')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#161412]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveDoc('terms')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDoc === 'terms' || activeDoc === 'eula'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#161412]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Service &amp; EULA</span>
            </button>

            <button
              onClick={() => setActiveDoc('guidelines')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDoc === 'guidelines'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#161412]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Community Guidelines &amp; UGC</span>
            </button>

            <button
              onClick={() => setActiveDoc('deletion')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDoc === 'deletion'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#161412]'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Account Deletion</span>
            </button>

            <button
              onClick={() => setActiveDoc('support')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDoc === 'support'
                  ? 'bg-[#560406] text-[#F5E6D3] shadow-xs'
                  : 'text-[#6E6259] hover:text-[#161412]'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Customer Support</span>
            </button>
          </div>

          {/* Document Content Scroll Area */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#4A423B] leading-relaxed select-text">
            {activeDoc === 'privacy' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#560406]/5 border border-[#560406]/20 rounded-2xl">
                  <h4 className="font-bold text-sm text-[#560406]">Privacy Commitment &amp; Policy Summary</h4>
                  <p className="text-[11px] text-[#6E6259] pt-1">
                    Mannat Matrimony (&ldquo;Mannat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates a discreet matrimonial ecosystem for elite lineages. We enforce strict BlurShield™ privacy locks and zero public profile indexing. We never sell, rent, or monetize your personal bio-data to third-party ad brokers.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">1. Information We Collect</h5>
                  <p>
                    <strong>A. Account Credentials:</strong> Name, verified email address, mobile number, Sign in with Apple identifier, and Google OAuth credentials.
                  </p>
                  <p>
                    <strong>B. Matrimonial Bio-Data:</strong> Gender, date of birth, height, community, caste/gotra, highest education, profession, income bracket, city of residence, family background, and lifestyle preferences.
                  </p>
                  <p>
                    <strong>C. Verification Data:</strong> Government ID credentials, LinkedIn profiles, and verified matchmaker consultation notes submitted during the optional verification process.
                  </p>
                  <p>
                    <strong>D. Communications:</strong> 1-on-1 private concierge messages, connection requests, wave history, and alliance notes.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">2. How We Use Your Data</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Facilitating mutual, highly-compatible matrimonial introductions.</li>
                    <li>Powering our BlurShield™ photo masking and selective unlock permissions.</li>
                    <li>Conducting background credential and pedigree checks to maintain a 100% verified network.</li>
                    <li>Sending critical account notifications, alliance updates, and concierge briefing alerts.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">3. BlurShield™ &amp; Selective Disclosure</h5>
                  <p>
                    By default, your photographs and detailed family dossiers can be blurred using BlurShield™. Other members can only view your unblurred media if you explicitly approve their connection request or 1-on-1 photo access request.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">4. Data Security &amp; Compliance</h5>
                  <p>
                    All communications and database records are encrypted in transit (TLS 1.3) and at rest (AES-256) hosted on SOC-2 and ISO-27001 compliant cloud infrastructure. We comply with India&apos;s Digital Personal Data Protection (DPDP) Act 2023, EU General Data Protection Regulation (GDPR), and Apple App Store Review Guidelines.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">5. Contact Our Data Protection Officer</h5>
                  <p>
                    For privacy inquiries or data rights requests, contact our grievance team at:
                    <br />
                    📧 <strong>privacy@mannatmatrimony.com</strong> | 📞 <strong>+91 97383 97933</strong>
                  </p>
                </div>
              </div>
            )}

            {(activeDoc === 'terms' || activeDoc === 'eula') && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                  <h4 className="font-bold text-sm text-amber-900">End User License Agreement (EULA) &amp; Terms</h4>
                  <p className="text-[11px] text-amber-800 pt-1">
                    By downloading, installing, or accessing Mannat Matrimony, you enter into a binding legal agreement with Mannat Matrimony. If you do not agree to these terms, do not access or use the service.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">1. Eligibility Criteria</h5>
                  <p>
                    Mannat Matrimony is strictly intended for individuals legally permitted to marry under applicable law (minimum age 21 for males, 18 for females, or the applicable legal age of majority in your jurisdiction). Users must be single, legally divorced, or widowed seeking genuine matrimonial alliances.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">2. Zero Tolerance Policy for Objectionable Content (Apple Guideline 1.2)</h5>
                  <p className="font-semibold text-rose-900 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    ⚠️ Mannat Matrimony enforces a STRICT ZERO-TOLERANCE POLICY against abusive users and objectionable content. There is no tolerance for harassment, hate speech, explicit or sexual content, scams, fraudulent claims, or impersonation. Any user found violating these terms will be immediately and permanently banned, and their content purged within 24 hours.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">3. User Code of Conduct &amp; Verification Accuracy</h5>
                  <p>
                    You agree that all information, credentials, and photographs provided in your bio-data are authentic, current, and accurate. Submitting forged certificates, fake income data, or unauthorized third-party photographs constitutes a material breach resulting in immediate termination.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">4. In-App Subscriptions &amp; Purchases (Apple StoreKit)</h5>
                  <p>
                    Optional VIP memberships purchased via Apple In-App Purchase or Google Play In-App Billing are subject to the terms of the respective app stores. Subscriptions automatically renew unless cancelled at least 24 hours prior to the end of the current billing period.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">5. Limitation of Liability</h5>
                  <p>
                    Mannat Matrimony provides curated match recommendations and verification tools. While we conduct rigorous checks, families and individuals are encouraged to exercise customary due diligence before formalizing matrimonial commitments.
                  </p>
                </div>
              </div>
            )}

            {activeDoc === 'guidelines' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#560406]/5 border border-[#560406]/20 rounded-2xl">
                  <h4 className="font-bold text-sm text-[#560406]">Community Safety &amp; Content Moderation Standards</h4>
                  <p className="text-[11px] text-[#6E6259] pt-1">
                    Our platform is curated for dignified family matrimonial alliances. We maintain round-the-clock moderation tools to safeguard every member.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">1. Instant User Blocking &amp; Reporting Mechanisms</h5>
                  <p>
                    Every member bio-data card and 1-on-1 chat screen is equipped with an easily accessible <strong>Report &amp; Block</strong> button:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>1-Tap Instant Block:</strong> Immediately prevents the blocked user from contacting you, viewing your profile, or appearing in your discovery feed.</li>
                    <li><strong>Structured Reporting:</strong> Allows categorizing reports (Inappropriate Photos, Harassment, Fake Profile, Commercial Solicitation) for human moderator review.</li>
                    <li><strong>24-Hour Review SLA:</strong> Our safety team acts on reported content within 24 hours, removing infringing material and suspending offending accounts.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">2. Photo Standards</h5>
                  <p>
                    All uploaded profile pictures must be clear, authentic photographs of the candidate. Group photos without the candidate, celebrity photos, watermarked commercial images, and explicit or suggestive imagery are strictly prohibited.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">3. Non-Disclosure &amp; Family Discretion</h5>
                  <p>
                    Profiles shared via private briefing links or within the app must not be screenshot, redistributed, or shared on public social media platforms. Violations of family privacy are prosecuted under applicable privacy laws.
                  </p>
                </div>
              </div>
            )}

            {activeDoc === 'deletion' && (
              <div className="space-y-4">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
                  <h4 className="font-bold text-sm text-rose-900">In-App Account Deletion &amp; Data Purge (Apple Guideline 5.1.1)</h4>
                  <p className="text-[11px] text-rose-800 pt-1">
                    You have complete autonomy over your digital presence. You can permanently delete your account and all associated matrimonial records directly within the app at any time.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">How to Delete Your Account Instantly:</h5>
                  <ol className="list-decimal pl-5 space-y-1 font-semibold text-[#161412]">
                    <li>Open the Mannat Member App.</li>
                    <li>Navigate to the <strong>Profile</strong> tab (bottom-right).</li>
                    <li>Tap the <strong>Settings / Privacy Lock</strong> icon.</li>
                    <li>Scroll to the bottom and tap <strong>&ldquo;Delete Account &amp; Wipe Data&rdquo;</strong>.</li>
                    <li>Confirm deletion.</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h5 className="font-bold text-[#161412] text-xs uppercase tracking-wider">What Gets Permanently Deleted:</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your matrimonial bio-data, pedigree notes, and family background records.</li>
                    <li>All uploaded portraits, albums, and BlurShield™ media assets.</li>
                    <li>All 1-on-1 chat histories, wave requests, and alliance introductions.</li>
                    <li>Your authentication record, email credentials, and oauth session tokens.</li>
                  </ul>
                  <p className="text-[11px] text-[#6E6259] pt-1">
                    Once initiated, data deletion is irreversible and completed across all live databases and cache servers immediately.
                  </p>
                </div>
              </div>
            )}

            {activeDoc === 'support' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#560406]/5 border border-[#560406]/20 rounded-2xl">
                  <h4 className="font-bold text-sm text-[#560406]">Dedicated Member Support &amp; Concierge Assistance</h4>
                  <p className="text-[11px] text-[#6E6259] pt-1">
                    The House of Mannat provides 24/7 dedicated assistance to our members, prospective candidates, and reviewing family elders.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white border border-[#E8DDD0] rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A17B5E]">Email Support (Guaranteed &lt; 24h Response)</span>
                    <p className="font-bold text-[#560406] text-sm">
                      <a href="mailto:support@mannatmatrimony.com" className="hover:underline">support@mannatmatrimony.com</a>
                    </p>
                    <p className="text-[11px] text-[#6E6259]">For technical queries, bio-data updates, or verification audits.</p>
                  </div>

                  <div className="p-3 bg-white border border-[#E8DDD0] rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A17B5E]">Priority Concierge Escalation Line</span>
                    <p className="font-bold text-[#161412] text-sm">
                      <a href="tel:+919738397933" className="hover:underline">+91 97383 97933</a>
                    </p>
                    <p className="text-[11px] text-[#6E6259]">Direct senior matchmaker escalation for active mutual introductions.</p>
                  </div>

                  <div className="p-3 bg-white border border-[#E8DDD0] rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A17B5E]">Privacy &amp; Data Protection Officer</span>
                    <p className="font-bold text-[#560406] text-sm">
                      <a href="mailto:privacy@mannatmatrimony.com" className="hover:underline">privacy@mannatmatrimony.com</a>
                    </p>
                    <p className="text-[11px] text-[#6E6259]">For GDPR, DPDP Act 2023, or cryptographic audit inquiries.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Close Action */}
          <div className="p-3 sm:p-4 border-t border-[#E8DDD0] bg-[#FAF7F2] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-[#6E6259]">
              Questions? <a href="mailto:privacy@mannatmatrimony.com" className="text-[#560406] font-bold underline">privacy@mannatmatrimony.com</a>
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#560406] text-[#F5E6D3] text-xs font-bold hover:bg-[#730C0F] transition cursor-pointer"
            >
              Close Document
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
