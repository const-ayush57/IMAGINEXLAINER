import { useState } from "react";
import { apiClient } from "../api/client";
import { Check, ChevronRight, Copy, Loader2, Sparkles, Zap } from "lucide-react";

// ─── Step Data ───────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German", "Arabic", "Chinese", "Portuguese"];
const GOALS = [
  { id: "understand", label: "Deepen Understanding", emoji: "🧠" },
  { id: "teach",      label: "Teach Others",          emoji: "🎓" },
  { id: "exam",       label: "Exam Preparation",      emoji: "📝" },
  { id: "content",    label: "Create Content",         emoji: "🎥" },
];
const ROLES = [
  { id: "student",      label: "Student",       emoji: "📚" },
  { id: "teacher",      label: "Teacher",       emoji: "👩‍🏫" },
  { id: "professional", label: "Professional",  emoji: "💼" },
  { id: "creator",      label: "Creator",       emoji: "🎬" },
];
const STYLES = [
  { id: "fun",      label: "Fun & Casual",       desc: "Conversational, engaging, easy to follow", emoji: "🎉" },
  { id: "serious",  label: "Academic & Serious",  desc: "Structured, detailed, scholarly tone",    emoji: "📖" },
];
const SUBJECTS = [
  "Biology", "Mathematics", "Physics", "History", "Chemistry", "Economics",
  "Computer Science", "Psychology", "Literature", "Earth Science", "Philosophy", "Engineering"
];

const TOTAL_STEPS = 7;

// ─── Component ────────────────────────────────────────────────────────────────

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<"basic" | "pro" | null>(null);

  // Form state
  const [language,  setLanguage]  = useState("");
  const [goal,      setGoal]      = useState("");
  const [role,      setRole]      = useState("");
  const [style,     setStyle]     = useState("");
  const [subjects,  setSubjects]  = useState<string[]>([]);

  const referralLink = `${window.location.origin}/register?ref=imaginexplainer`;

  const toggleSubject = (s: string) => {
    if (subjects.includes(s)) {
      setSubjects(subjects.filter(x => x !== s));
    } else if (subjects.length < 3) {
      setSubjects([...subjects, s]);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!language;
    if (step === 2) return !!goal;
    if (step === 3) return !!role;
    if (step === 4) return !!style;
    if (step === 5) return subjects.length === 3;
    return true;
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = async (planId: "basic" | "pro") => {
    try {
      setCheckoutLoading(planId);
      const res = await apiClient<{ checkoutUrl: string }>("/checkout/session", {
        data: { planId }
      });
      window.location.href = res.checkoutUrl;
    } catch {
      alert("Failed to start checkout. Please try again.");
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 font-body">
      
      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i < step ? "bg-[#4d8eff]" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <p className="text-white/30 text-xs mt-2 text-right font-semibold tracking-wide">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-6 duration-400">

        {/* ── Step 1: Language ── */}
        {step === 1 && (
          <StepWrapper title="Choose your language" subtitle="We'll tailor the content to your preference.">
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(l => (
                <OptionCard key={l} label={l} selected={language === l} onClick={() => setLanguage(l)} />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 2: Goal ── */}
        {step === 2 && (
          <StepWrapper title="What's your primary goal?" subtitle="Help us recommend the best content style for you.">
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map(g => (
                <OptionCard key={g.id} label={g.label} emoji={g.emoji} selected={goal === g.id} onClick={() => setGoal(g.id)} />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 3: Role ── */}
        {step === 3 && (
          <StepWrapper title="What best describes you?" subtitle="We'll personalize your experience accordingly.">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(r => (
                <OptionCard key={r.id} label={r.label} emoji={r.emoji} selected={role === r.id} onClick={() => setRole(r.id)} />
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 4: Style ── */}
        {step === 4 && (
          <StepWrapper title="Pick your content style" subtitle="How do you prefer to learn or teach?">
            <div className="flex flex-col gap-3">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    style === s.id
                      ? "border-[#4d8eff] bg-[#4d8eff]/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <p className="text-white font-bold mt-2">{s.label}</p>
                  <p className="text-white/50 text-xs mt-1">{s.desc}</p>
                </button>
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 5: Subjects ── */}
        {step === 5 && (
          <StepWrapper title="Select 3 subjects" subtitle={`${subjects.length}/3 selected`}>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSubject(s)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    subjects.includes(s)
                      ? "border-[#4d8eff] bg-[#4d8eff]/15 text-white"
                      : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                  } ${!subjects.includes(s) && subjects.length >= 3 ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  {subjects.includes(s) && <Check className="w-3 h-3 inline mr-1" />}
                  {s}
                </button>
              ))}
            </div>
          </StepWrapper>
        )}

        {/* ── Step 6: Referral ── */}
        {step === 6 && (
          <StepWrapper title="Share & earn" subtitle="Invite others and earn bonus credits when they subscribe.">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <p className="text-white/50 text-sm">Your personal referral link:</p>
              <div className="flex items-center gap-3 bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3">
                <span className="text-[#4d8eff] text-sm font-mono flex-1 truncate">{referralLink}</span>
                <button onClick={handleCopy} className="text-white/50 hover:text-white transition-colors shrink-0">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white/30 text-xs">You can always share this later from your dashboard.</p>
            </div>
          </StepWrapper>
        )}

        {/* ── Step 7: Paywall ── */}
        {step === 7 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-[#4d8eff]/10 border border-[#4d8eff]/20 text-[#4d8eff] text-xs font-bold px-4 py-2 rounded-full mb-4 tracking-wider">
                <Sparkles className="w-3 h-3" /> LAST STEP
              </div>
              <h2 className="text-3xl font-extrabold text-white font-headline tracking-tight">Choose your plan</h2>
              <p className="text-white/50 text-sm mt-2">Start creating AI-powered explainer videos today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic */}
              <div className="bg-[#161616] border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <p className="text-white/50 text-xs font-bold tracking-widest uppercase">Basic</p>
                  <p className="text-4xl font-extrabold text-white mt-1">$5 <span className="text-lg text-white/40 font-medium">/mo</span></p>
                  <p className="text-white/40 text-xs mt-1">10 video credits</p>
                </div>
                <ul className="space-y-2 text-sm text-white/60 flex-1">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> 10 explainer videos/month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> Video & Podcast modes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> Standard quality</li>
                </ul>
                <button
                  onClick={() => handleCheckout("basic")}
                  disabled={!!checkoutLoading}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {checkoutLoading === "basic" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Basic"}
                </button>
              </div>

              {/* Pro */}
              <div className="bg-[#4d8eff]/10 border border-[#4d8eff]/40 rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-[#4d8eff] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">POPULAR</div>
                <div>
                  <p className="text-[#4d8eff] text-xs font-bold tracking-widest uppercase">Pro</p>
                  <p className="text-4xl font-extrabold text-white mt-1">$10 <span className="text-lg text-white/40 font-medium">/mo</span></p>
                  <p className="text-white/40 text-xs mt-1">30 video credits</p>
                </div>
                <ul className="space-y-2 text-sm text-white/60 flex-1">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> 30 explainer videos/month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> Video & Podcast modes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> Priority AI processing</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#4d8eff]" /> Real-time web search</li>
                </ul>
                <button
                  onClick={() => handleCheckout("pro")}
                  disabled={!!checkoutLoading}
                  className="w-full py-3 bg-[#4d8eff] hover:bg-[#3b78eb] text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(77,142,255,0.3)] disabled:opacity-50"
                >
                  {checkoutLoading === "pro" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Get Pro</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button (steps 1-6) */}
        {step < 7 && (
          <button
            onClick={next}
            disabled={!canProceed()}
            className="mt-6 w-full bg-[#4d8eff] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3b78eb] text-white font-bold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(77,142,255,0.2)]"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        )}

      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StepWrapper = ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-extrabold text-white font-headline tracking-tight">{title}</h2>
      <p className="text-white/40 text-sm mt-1">{subtitle}</p>
    </div>
    {children}
  </div>
);

const OptionCard = ({ label, emoji, selected, onClick }: { label: string; emoji?: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3.5 rounded-2xl border font-semibold text-sm transition-all flex items-center gap-3 ${
      selected
        ? "border-[#4d8eff] bg-[#4d8eff]/10 text-white"
        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
    }`}
  >
    {emoji && <span className="text-xl">{emoji}</span>}
    {selected && <Check className="w-3.5 h-3.5 text-[#4d8eff] ml-auto shrink-0" />}
    {label}
  </button>
);
