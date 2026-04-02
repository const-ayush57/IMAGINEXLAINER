export const Discover = () => {
    return (
      <div className="w-full relative min-h-screen flex flex-col font-body bg-surface text-on-surface">
        
        {/* minimal subtle grid overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[1]">
             <div className="w-full h-full" style={{backgroundImage: 'radial-gradient(#dae2fd 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>

        <div className="relative z-10 w-full px-14 max-w-screen-2xl mx-auto pt-16 pb-20">
          {/* Header Section */}
          <header className="mb-12 text-center md:text-left">
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-[-0.02em] text-on-surface mb-6">Discover Explainers</h1>
            <p className="text-on-surface-variant text-xl max-w-3xl leading-relaxed">Explore our curated library of high-impact visual and audio explainers designed for the modern learner by native AI compute environments.</p>
          </header>
  
          {/* Filtering and Search Row */}
          <section className="flex flex-col md:flex-row gap-6 mb-16 items-center">
            <div className="relative w-full md:flex-1">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline-variant text-[28px]">search</span>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary text-on-surface pl-16 py-4 transition-all shadow-inner text-lg placeholder:text-outline-variant" 
                placeholder="Search global explainers..." 
                type="text"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative min-w-[160px] w-full">
                <select className="w-full appearance-none bg-surface-container-low border border-outline-variant/15 rounded-xl text-on-surface px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer font-semibold shadow-inner text-white *:text-black">
                  <option>All Topics</option>
                  <option>Science</option>
                  <option>Philosophy</option>
                  <option>Technology</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
              <div className="relative min-w-[160px] w-full">
                <select className="w-full appearance-none bg-surface-container-low border border-outline-variant/15 rounded-xl text-on-surface px-6 py-4 focus:ring-2 focus:ring-primary focus:border-primary transition-all cursor-pointer font-semibold shadow-inner text-white *:text-black">
                  <option>Most Views</option>
                  <option>Newest</option>
                  <option>Popular</option>
                  <option>Longest</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
              </div>
            </div>
          </section>
  
          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-surface-container-low border border-outline-variant/10 shadow-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Quantum Physics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlU9ZeMd237OQ4XcDv21fR5a0_xFlH97nbBvm_FNKLtpFxRfOEak0NEImr1Y9v1OP1z-vuHCrfvagDpz1w3QHzVhvwZRksXPgJFq9vhDUL9SWCoXUQyv7ayhSYhQxbR4FeMTjoDLfMrZNEU1LHKAE3_-6KCVlM-gmQ9vO1_rZKVXwm-uRPaiLYVMimWSTYqyz7-LhZWwutL1R4iH6uGFptiRcn7HT3J9F7tkwEgf7tGLfFb5x4NiC-KCxXIFDkJ9fi0lbLPVzvydME"/>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest text-primary uppercase border border-white/10 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">videocam</span> Video
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white border border-white/10 shadow-lg">12:45</div>
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">Quantum Physics: The Fabric of Reality</h3>
              <p className="text-on-surface-variant text-sm mb-2 font-medium">Dr. Aris Thorne</p>
              <p className="text-outline text-xs uppercase tracking-widest font-semibold flex items-center gap-1">10 months ago <span className="opacity-50">•</span> 544 views</p>
            </div>
  
            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-surface-container-low border border-outline-variant/10 shadow-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="CRISPR" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_q4GIC7N-Yu1pU1tXYNYTrBvospTaQC8fy16i8Y721rbOBedjo6MYsZjnp4JQJps3ZE_jDuujRqupMfJag_pxRcanCFExRqviTSd8BcD6Ls9RT5aRBbQajGq_rpR4bKBuiWTZrJ_evRHHkGCZb7ZPqUiEeiOQM60UhI2VYaPzq7VNeRoTT4RCMVU8J75aW3KGem18PzHi-uN0Mfb7Sus8dzv15VivlilhvuDtyE8yClQuwh8PydFCPkeUQ_G-JrJcwuK6qFXlGjvg"/>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest text-tertiary uppercase border border-white/10 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">mic</span> Audio
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white border border-white/10 shadow-lg">08:20</div>
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">The Future of CRISPR Gene Editing</h3>
              <p className="text-on-surface-variant text-sm mb-2 font-medium">BioLab Collective</p>
              <p className="text-outline text-xs uppercase tracking-widest font-semibold flex items-center gap-1">2 weeks ago <span className="opacity-50">•</span> 1.2k views</p>
            </div>
  
            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-surface-container-low border border-outline-variant/10 shadow-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="AI Neural Networks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW_K_zmhCXqDYvxKL8ktXi37rJB9kO6JV18ixDqB7Bkt0x_W2FYJfzrf45bghR91iSYTio_RYKNU07WIHIcd-Z2ZJB_Lq-cEjVdFYUIh45XneWv0lDwZ_ruu76_SyWXmQp9Bxet4rAp7TJJdCXXNgomCOjywodO9avBWAVP2UjgbTVOYmoNhP4vLOL7kg3uZ-2VyWHIM28iZkOQbmaSEjGOdjTup1jO66rILvswtLYZKiMIY9H4OuarXETncuU6KoJ1MANdhkcRDbi"/>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest text-primary uppercase border border-white/10 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">videocam</span> Video
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white border border-white/10 shadow-lg">15:10</div>
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">AI Neural Networks Explained</h3>
              <p className="text-on-surface-variant text-sm mb-2 font-medium">Tech Insight</p>
              <p className="text-outline text-xs uppercase tracking-widest font-semibold flex items-center gap-1">5 days ago <span className="opacity-50">•</span> 3.8k views</p>
            </div>
  
            {/* Card 4 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-surface-container-low border border-outline-variant/10 shadow-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Climate Dynamics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-DNy95-BG_2TuPmlJrYAvtDIyqz6nB2chRvV60A46Tqsh_fy-OEiyBA3MrKWfA_w_WSvoDl3pihnEbV2pxGowoiJlObX-N9GnE2zS-_NpnlaW_2MAMNuKznO_iJs88_neAsXZw_lIwmPsTicmVYxNtY2e-UTLWZYYaeGvLVevgZIdaEyeI3oktwlh2ViPipLZvMqoXv6kkU-_eVR_8do74AX7WBCeH4CDBrVVqY5NZJruHWhIHyylo4qTfHc3wc9lojsTMzoNcBlY"/>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest text-primary uppercase border border-white/10 flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">videocam</span> Video
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-white border border-white/10 shadow-lg">22:30</div>
              </div>
              <h3 className="font-headline text-xl font-extrabold text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">Climate Dynamics &amp; Global Cycles</h3>
              <p className="text-on-surface-variant text-sm mb-2 font-medium">Earth Studio</p>
              <p className="text-outline text-xs uppercase tracking-widest font-semibold flex items-center gap-1">1 month ago <span className="opacity-50">•</span> 920 views</p>
            </div>
  
          </div>
        </div>
      </div>
    );
  };
  
