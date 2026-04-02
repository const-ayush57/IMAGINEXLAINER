import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Video, Mic, Clock, ChevronDown, Globe, Image as ImageIcon, AlertCircle, X, Zap, Check } from "lucide-react";
import { apiClient } from "../api/client";
import { useJobTracker } from "../hooks/useJobTracker";

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(500),
  theme: z.enum(["Light Corporate", "Dark Mode Matrix", "Playful Colorful", "Minimalist"]),
  length: z.enum(["Short (5 Slides)", "Medium (10 Slides)", "Detailed (15 Slides)"]),
  voice: z.string().min(1),
  type: z.enum(["video", "podcast"]),
  useImages: z.boolean(),
  webSearch: z.boolean(),
  speakers: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export const Home = () => {
  const navigate = useNavigate();
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeToast, setUpgradeToast] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<"basic" | "pro" | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  
  const tracker = useJobTracker(activeJobId);

  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      theme: "Dark Mode Matrix",
      length: "Short (5 Slides)",
      voice: "en-US-AriaNeural",
      type: "video",
      useImages: true,
      webSearch: false,
      speakers: 1
    }
  });

  const watchLength = watch("length");
  const watchType = watch("type");
  const watchWebSearch = watch("webSearch");
  const watchUseImages = watch("useImages");
  const watchSpeakers = watch("speakers");

  const onSubmit = async (data: FormData) => {
    try {
      try {
         await apiClient<{ user: any }>("/auth/me");
      } catch {
         navigate('/login');
         return;
      }

      const response = await apiClient<{ jobId: number }>("/generate", { data });
      setActiveJobId(String(response.jobId));
    } catch (err: any) {
      if (err.status === 402 || err.status === 403) {
        // Stop spinner immediately and show upgrade modal
        setShowUpgradeModal(true);
        setUpgradeToast(true);
        setTimeout(() => setUpgradeToast(false), 4000);
      } else if (err.status === 401 || err.message?.includes('401')) {
        navigate('/login');
      } else {
        alert(`Generation failed: ${err.message}`);
      }
    }
  };

  const handleStripeCheckout = async (planId: "basic" | "pro") => {
    try {
      setCheckoutLoading(planId);
      const res = await apiClient<{ checkoutUrl: string }>("/checkout/session", { data: { planId } });
      window.location.href = res.checkoutUrl;
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="relative w-full flex-grow flex flex-col items-center pt-24 pb-12 font-body text-white">
      
      {/* Absolute Background Floats */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block overflow-hidden max-w-[1400px] mx-auto">
        <div className="absolute top-[35%] left-[8%] p-3.5 rounded-2xl rotate-[-8deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(77,142,255,0.1)]">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4d8eff" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <div className="absolute top-[28%] right-[10%] p-3.5 rounded-2xl rotate-[12deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(255,77,142,0.1)]">
           <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4d8e" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div className="absolute bottom-[35%] left-[12%] p-3 rounded-2xl rotate-[18deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(77,255,142,0.1)]">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4dff8e" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
        </div>
        <div className="absolute bottom-[25%] right-[15%] p-4 rounded-2xl rotate-[-15deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(255,200,77,0.1)]">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffc84d" strokeWidth="1.5"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </div>
        <div className="absolute top-[50%] left-[2%] p-3 rounded-2xl rotate-[10deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(255,142,77,0.1)]">
           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ff8e4d" strokeWidth="1.5"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div className="absolute bottom-[10%] right-[5%] p-3.5 rounded-2xl rotate-[-5deg] bg-surface-variant/10 border border-white/5 shadow-[0_0_20px_rgba(142,77,255,0.1)]">
           <Mic className="w-7 h-7 text-[#8e4dff]" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-20 text-center px-6 w-full max-w-[900px] mx-auto flex flex-col items-center">
        {!activeJobId && (
            <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-white mb-10 tracking-tight leading-tight">
              Imagine an <span className="relative inline-block px-2">
                 <span className="relative z-10 text-white">Explainer</span>
                 <span className="absolute inset-0 bg-[#2b3544] -skew-y-1 z-0 rounded"></span>
              </span>
            </h1>
        )}

        {!activeJobId && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full relative group">
            <div className="relative flex flex-col bg-[#161616] rounded-3xl border border-white/10 transition-all text-left shadow-2xl">
              
              <div className="w-full px-6 py-5 border-b border-white/5 bg-[#1a1a1a] rounded-t-3xl">
                  <input 
                    {...register("topic")}
                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-white/30 font-body text-xl font-medium tracking-wide" 
                    placeholder="What you want to learn about" 
                    type="text"
                  />
              </div>

              <div className="p-6 md:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                      <div className="w-full">
                          <label className="text-xs font-semibold text-white/50 mb-3 block">Explainer Type</label>
                          <div className="flex bg-[#0f0f0f] border border-white/5 p-1 rounded-xl">
                              <button type="button" onClick={() => setValue('type', 'video')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${watchType === 'video' ? 'bg-[#2b3544] text-white shadow-inner border border-white/10' : 'text-white/40 hover:text-white/80'}`}>
                                 <Video className="w-4 h-4" /> Video
                              </button>
                              <button type="button" onClick={() => setValue('type', 'podcast')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${watchType === 'podcast' ? 'bg-[#2b3544] text-white shadow-inner border border-white/10' : 'text-white/40 hover:text-white/80'}`}>
                                 <Mic className="w-4 h-4" /> Podcast
                              </button>
                          </div>
                      </div>

                      <div className="w-full">
                          <label className="text-xs font-semibold text-white/50 mb-3 block tracking-wide">Explainer Length</label>
                          <div className="flex bg-[#0f0f0f] border border-white/5 p-1 rounded-xl">
                              <button type="button" onClick={() => setValue('length', 'Short (5 Slides)')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${watchLength === 'Short (5 Slides)' ? 'bg-[#2b3544] border border-white/10 shadow-inner' : 'hover:bg-white/5'}`}>
                                 <span className={`text-sm font-semibold flex items-center gap-1.5 ${watchLength === 'Short (5 Slides)' ? 'text-white' : 'text-white/60'}`}><Clock className="w-3.5 h-3.5" /> Short</span>
                                 <span className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">&lt; 2 mins</span>
                              </button>
                              <button type="button" onClick={() => setValue('length', 'Medium (10 Slides)')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${watchLength === 'Medium (10 Slides)' ? 'bg-[#2b3544] border border-white/10 shadow-inner' : 'hover:bg-white/5'}`}>
                                 <span className={`text-sm font-semibold flex items-center gap-1.5 ${watchLength === 'Medium (10 Slides)' ? 'text-white' : 'text-white/60'}`}><Clock className="w-3.5 h-3.5" /> Medium</span>
                                 <span className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">2-10 mins</span>
                              </button>
                              <button type="button" onClick={() => setValue('length', 'Detailed (15 Slides)')} className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${watchLength === 'Detailed (15 Slides)' ? 'bg-[#2b3544] border border-white/10 shadow-inner' : 'hover:bg-white/5'}`}>
                                 <span className={`text-sm font-semibold flex items-center gap-1.5 ${watchLength === 'Detailed (15 Slides)' ? 'text-white' : 'text-white/60'}`}><Clock className="w-3.5 h-3.5" /> Long</span>
                                 <span className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">10-30 mins</span>
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Advanced Settings Accordion */}
                  <div className="w-full">
                      <button type="button" onClick={() => setAdvancedOpen(!advancedOpen)} className="flex items-center justify-between w-full text-xs font-semibold text-white/50 hover:text-white transition-colors tracking-wide mb-2">
                         Advanced Settings (Theme, Colors & Aspect Ratio)
                         <ChevronDown className={`w-4 h-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {advancedOpen && (
                        <div className="pt-4 space-y-6 border-t border-white/5 mt-4 pb-2 animate-in slide-in-from-top-4 duration-300">
                             <div className="w-full">
                                <label className="text-xs font-semibold text-white/50 mb-2 block tracking-wide">Video Style/Theme</label>
                                <select {...register("theme")} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4d8eff] appearance-none font-medium text-white *:text-black">
                                  <option>Dark Mode Matrix</option>
                                  <option>Light Corporate</option>
                                  <option>Playful Colorful</option>
                                  <option>Minimalist</option>
                                </select>
                             </div>
                             
                             <div className="w-full">
                                <label className="text-xs font-semibold text-white/50 mb-2 block tracking-wide mt-2">Podcast Layout</label>
                                <div className="flex bg-[#0f0f0f] border border-white/5 p-1 rounded-xl mb-4">
                                    <button type="button" onClick={() => setValue('speakers', 1)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${watchSpeakers === 1 ? 'bg-[#2b3544] text-white shadow-inner border border-white/10' : 'text-white/40 hover:text-white/80'}`}>1 Speaker</button>
                                    <button type="button" onClick={() => setValue('speakers', 2)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${watchSpeakers === 2 ? 'bg-[#2b3544] text-white shadow-inner border border-white/10' : 'text-white/40 hover:text-white/80'}`}>2 Speakers</button>
                                </div>
                                <label className="text-xs font-semibold text-white/50 mb-2 block tracking-wide">Primary Voice</label>
                                <select {...register("voice")} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#4d8eff] appearance-none font-medium text-white *:text-black">
                                  <option value="en-US-AriaNeural">Aria (female)</option>
                                  <option value="en-US-GuyNeural">Guy (male)</option>
                                  <option value="en-GB-SoniaNeural">Sonia (UK)</option>
                                </select>
                             </div>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center justify-between pt-4 w-full">
                      <div className="flex gap-6">
                           <button type="button" onClick={() => setValue('webSearch', !watchWebSearch)} className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                               <Globe className="w-4 h-4 text-white/60" />
                               <span className="text-xs font-semibold">Real Time Web Search</span>
                               <div className={`w-9 h-5 rounded-full relative transition-colors ${watchWebSearch ? 'bg-[#4d8eff]' : 'bg-[#2b3544]'}`}>
                                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${watchWebSearch ? 'right-1' : 'left-1'}`}></div>
                               </div>
                           </button>
                           {watchType === 'video' && (
                             <button type="button" onClick={() => setValue('useImages', !watchUseImages)} className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                                 <ImageIcon className="w-4 h-4 text-white/60" />
                                 <span className="text-xs font-semibold">Use Images</span>
                                 <div className={`w-9 h-5 rounded-full relative transition-colors ${watchUseImages ? 'bg-[#4d8eff]' : 'bg-[#2b3544]'}`}>
                                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${watchUseImages ? 'right-1' : 'left-1'}`}></div>
                                 </div>
                             </button>
                           )}
                      </div>

                      <button 
                          disabled={isSubmitting}
                          type="submit" 
                          className="bg-[#4d8eff] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3b78eb] transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(77,142,255,0.2)] disabled:opacity-50 tracking-wide"
                      >
                          {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                          {isSubmitting ? "Firing Pipelines" : "Create"}
                      </button>
                  </div>
              </div>
            </div>

            <div className="mt-8 text-center space-y-4">
                <p className="text-xs text-white/40 font-semibold tracking-wide">Choose a Topic to Get Started</p>
                <div className="flex flex-wrap justify-center gap-3">
                   {['Biology', 'Mathematics', 'Physics', 'Earth Science'].map(topic => (
                       <button key={topic} type="button" onClick={() => setValue('topic', topic)} className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-transparent hover:bg-white/5 transition-colors text-sm font-medium text-white/80 tracking-wide">
                          <Globe className="w-3.5 h-3.5 text-white/50" /> {topic}
                       </button>
                   ))}
                </div>
                <p className="text-[#4d8eff] text-xs font-semibold tracking-wide mt-4 cursor-pointer hover:underline flex items-center justify-center gap-1">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                   Create from document
                </p>
            </div>

          </form>
        )}

        {/* Replaced: old length-based paywall removed — backend 402 gate handles this now */}

        {/* SSE TRACKING RENDER */}
        {activeJobId && (
          <div className="w-full max-w-2xl bg-[#161616] border border-white/10 rounded-[24px] p-12 backdrop-blur-md shadow-2xl text-center space-y-8 min-h-[350px] flex flex-col justify-center items-center mt-4">
              
              {(tracker.status === "pending" || tracker.status === "processing") && (
                <>
                   <div className="relative mt-4">
                      <div className="absolute inset-0 bg-[#4d8eff] blur-[30px] opacity-20 rounded-full"></div>
                      <Loader2 className="w-16 h-16 animate-spin text-[#4d8eff] relative z-10" />
                   </div>
                   <h3 className="text-2xl font-extrabold tracking-tight mt-6 font-headline text-white">
                      {tracker.status === "pending" ? "Queued for Cloud Render..." : "AI Engine Encoding Explainer..."}
                   </h3>
                   <p className="text-white/50 text-sm max-w-md mx-auto">Please securely keep this portal open resolving natively.</p>
                </>
              )}

              {tracker.status === "completed" && (
                  <div className="space-y-6 animate-in zoom-in duration-500 w-full">
                      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                          <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <div>
                          <h3 className="text-3xl font-extrabold text-white mb-2 font-headline">Explainer Complete!</h3>
                          <p className="text-white/60 text-sm">Your visual sequence successfully synthesized encoding fully.</p>
                      </div>
                      <a href={`http://localhost:3000${tracker.fileUrl}`} target="_blank" rel="noreferrer" className="inline-block w-full bg-[#4d8eff] text-white font-headline font-bold text-base py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(77,142,255,0.2)] hover:bg-[#3b78eb] mt-4">
                          Download Output
                      </a>
                      <button onClick={() => setActiveJobId(null)} className="text-[11px] font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest mt-6 block w-full text-center">Construct Another Session</button>
                  </div>
              )}

              {tracker.status === "failed" && (
                  <div className="space-y-6 w-full">
                      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-left">
                           <p className="font-bold flex items-center gap-2 text-lg font-headline"><AlertCircle className="w-5 h-5"/> Encode Execution Fatal Block</p>
                           <p className="text-sm mt-2 text-red-400">{tracker.errorMessage}</p>
                      </div>
                      <button onClick={() => setActiveJobId(null)} className="font-semibold bg-white/5 hover:bg-white/10 py-3.5 px-6 w-full rounded-xl text-white transition-colors text-sm">Return Native Routing</button>
                  </div>
              )}
          </div>
        )}

      </div>

      {/* ── Upgrade Modal Overlay ── */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpgradeModal(false); }}
        >
          <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-white font-headline">Upgrade Plan</h2>
              <p className="text-white/50 text-sm mt-1">You've run out of credits. Pick a plan to keep creating.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Basic */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4">
                <div>
                  <p className="text-white/50 text-xs font-bold tracking-widest uppercase">Basic</p>
                  <p className="text-3xl font-extrabold text-white mt-1">$5<span className="text-sm text-white/40 font-medium">/mo</span></p>
                  <p className="text-white/40 text-xs mt-0.5">10 credits</p>
                </div>
                <ul className="space-y-1.5 text-xs text-white/50 flex-1">
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#4d8eff]" /> 10 explainer videos</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#4d8eff]" /> Video & Podcast</li>
                </ul>
                <button
                  onClick={() => handleStripeCheckout("basic")}
                  disabled={!!checkoutLoading}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading === "basic" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade"}
                </button>
              </div>

              {/* Pro */}
              <div className="bg-[#4d8eff]/10 border border-[#4d8eff]/40 rounded-2xl p-5 flex flex-col gap-4 relative">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4d8eff] text-white text-[9px] font-bold px-3 py-0.5 rounded-full tracking-wider">POPULAR</div>
                <div>
                  <p className="text-[#4d8eff] text-xs font-bold tracking-widest uppercase">Pro</p>
                  <p className="text-3xl font-extrabold text-white mt-1">$10<span className="text-sm text-white/40 font-medium">/mo</span></p>
                  <p className="text-white/40 text-xs mt-0.5">30 credits</p>
                </div>
                <ul className="space-y-1.5 text-xs text-white/50 flex-1">
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#4d8eff]" /> 30 explainer videos</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#4d8eff]" /> Priority processing</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-[#4d8eff]" /> Real-time web search</li>
                </ul>
                <button
                  onClick={() => handleStripeCheckout("pro")}
                  disabled={!!checkoutLoading}
                  className="w-full py-2.5 bg-[#4d8eff] hover:bg-[#3b78eb] text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(77,142,255,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checkoutLoading === "pro" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-3.5 h-3.5" /> Upgrade</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom-right Toast ── */}
      {upgradeToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1a1a1a] border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
          <p className="text-sm text-white font-medium">You need to upgrade to a paid plan to create videos.</p>
        </div>
      )}

    </div>
  );
};
