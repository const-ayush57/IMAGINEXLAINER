import { Link, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="font-body selection:bg-primary/30 min-h-screen bg-[#121212] text-white flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-[#121212]/80 backdrop-blur-xl flex justify-between items-center px-10 h-16 shadow-lg shadow-black/20 border-b border-white/5">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white font-headline flex items-center gap-2 hover:opacity-80 transition-opacity">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
           Imagine Explainers
        </Link>
        
        <div className="hidden md:flex gap-8 items-center absolute left-[200px]">
            <Link to="/discover" className="text-white/60 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors duration-300">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Discover
            </Link>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 mr-2 border-r border-white/10 pr-4">
               <span className="text-[11px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase">US EN</span>
               <button className="text-white/60 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
               </button>
               <div className="w-8 h-4 bg-[#3a44eb] rounded-full relative cursor-pointer border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(77,142,255,0.3)]">
                  <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-[1px] right-[1px] shadow"></div>
               </div>
            </div>
            
            <button className="flex items-center justify-center gap-1.5 bg-[#4d8eff] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md shadow-[#4d8eff]/30 hover:bg-[#3b78eb] transition-all duration-300 tracking-wide">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                Create
            </button>
            <Link to="/login" className="text-white/70 hover:text-white text-sm font-semibold transition-all duration-300 border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/5 shadow-inner">Log In</Link>
            <Link to="/register" className="px-4 py-1.5 border border-white/10 rounded-full text-white text-sm font-semibold hover:bg-white/5 transition-all duration-300 shadow-inner">Sign Up</Link>
        </div>
      </nav>

      <main className="flex-1 w-full pt-16 flex flex-col relative overflow-x-hidden">
          <Outlet />
      </main>

      <footer className="w-full py-8 border-t border-white/5 bg-[#121212] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-10 max-w-7xl mx-auto font-body text-xs leading-relaxed">
          <div className="text-white/30 mb-4 md:mb-0">
                  © 2026 Imagine Explainers.
          </div>
        </div>
      </footer>
    </div>
  );
};
