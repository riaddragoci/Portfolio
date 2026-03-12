import { useState, useEffect, useRef, useCallback } from 'react';
import LightPillar from './components/LightPillar';
import GlareHover from './components/GlareHover';
import './App.css';

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal(0.1);
  return (
    <div ref={ref} className={`reveal-item ${visible ? 'revealed' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const smoothProgress = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    let targetProgress = 0;
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      targetProgress = total > 0 ? scrolled / total : 0;
      const sections = ['home', 'about', 'projects', 'skills', 'contact'];
      for (const id of [...sections].reverse()) {
        const sectionEl = document.getElementById(id);
        if (sectionEl && sectionEl.getBoundingClientRect().top <= 120) { setActiveSection(id); break; }
      }
    };
    const animate = () => {
      smoothProgress.current += (targetProgress - smoothProgress.current) * 0.1;
      if (Math.abs(targetProgress - smoothProgress.current) < 0.0005) smoothProgress.current = targetProgress;
      setScrollProgress(smoothProgress.current);
      rafId.current = requestAnimationFrame(animate);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    rafId.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId.current); };
  }, []);

  const projects = [
    { title: 'JobFit Multi-Agent', subtitle: 'AI-Powered CV ↔ JD Matcher', tech: ['React', 'TypeScript', 'FastAPI', 'Python', 'Ollama', 'LLaMA 3.1'], description: 'Full-stack web application using a multi-agent AI architecture to analyse CV-to-job-description alignment, powered by local LLMs.', highlights: ['Built 5 specialized AI agents: JD extractor, CV parser, match scorer, advice generator, and CV rewriter', 'Designed a React dashboard with score gauge, skills breakdown, and CV rewrite suggestions', 'Implemented transparent weighted scoring (60% required skills, 15% preferred, 15% keywords, 10% red flags)', 'Anti-hallucination guardrails prevent the system from inventing experience'], link: 'https://github.com/riaddragoci/jobfit-multi-agent' },
    { title: 'Checkout System Simulation', subtitle: 'Event-Driven Architecture', tech: ['Python', 'Scheme'], description: 'Designed and implemented an event-driven checkout simulation modelling customer flow and queue behaviour.', highlights: ['Built object-oriented and functional components for lane state management', 'Applied recursion and data structures to model real-world system behaviour', 'Implemented customer prioritisation and checkout event handling'] },
    { title: 'ML Classification Model', subtitle: 'Breast Cancer Detection', tech: ['Python', 'Logistic Regression', 'Scikit-learn'], description: 'Built a supervised classification model using the Breast Cancer Wisconsin Diagnostic Dataset.', highlights: ['Performed comprehensive data preprocessing and feature scaling', 'Evaluated model performance using accuracy, precision, recall, and F1-score', 'Achieved ~96% classification accuracy on unseen test data'] },
    { title: 'Big Data Processing', subtitle: 'Data Warehousing Pipeline', tech: ['Hadoop', 'Hive', 'MapReduce'], description: 'Designed a Hive-based data warehouse using star schema with partitioned fact tables.', highlights: ['Implemented MapReduce logic for efficient large dataset aggregation', 'Loaded, queried, and validated data stored in HDFS using HiveQL', 'Built scalable architecture for big data analytics'] },
  ];

  const lastProject = { title: 'Network Traffic Analysis', subtitle: 'Protocol Inspection', tech: ['TCP/IP', 'DNS', 'Packet Analysis'], description: 'Analysed network traffic patterns and protocol behaviour using packet inspection tools.', highlights: ['Examined TCP/IP traffic flows and DNS resolution processes', 'Identified protocol behaviour patterns and potential anomalies', 'Applied networking fundamentals to real-world traffic data'] };

  const skillCategories = [
    { title: 'AI & Machine Learning', items: ['Supervised Learning', 'Classification', 'Feature Engineering', 'Model Evaluation'] },
    { title: 'Programming Languages', items: ['Python', 'Java', 'JavaScript', 'C++'] },
    { title: 'Data & Systems', items: ['Hadoop', 'Hive', 'MapReduce', 'HDFS'] },
    { title: 'Web Technologies', items: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'Vite', 'HTML', 'CSS'] },
    { title: 'Core Concepts', items: ['OOP', 'Data Structures', 'Event-Driven Design', 'Networking Fundamentals'] },
  ];

  const scrollToSection = useCallback((section: string) => {
    const element = document.getElementById(section);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-black">
        <LightPillar topColor="#5227FF" bottomColor="#FF9FFC" intensity={1.0} rotationSpeed={0.3} glowAmount={0.005} pillarWidth={3.0} pillarHeight={0.4} noiseIntensity={0.5} quality="high" />
      </div>
      <div className="fixed inset-0 z-[1] bg-black/20 pointer-events-none" />
      <div className="vignette" />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-[3px] pointer-events-none">
        <div className="absolute inset-0 bg-white/[0.03]" />
        <div className="absolute top-0 left-0 right-0 scroll-fill" style={{ height: `${scrollProgress * 100}%` }} />
        <div className="absolute left-1/2 -translate-x-1/2 w-[7px] h-[7px] rounded-full scroll-dot" style={{ top: `calc(${scrollProgress * 100}% - 3.5px)`, opacity: scrollProgress > 0.005 ? 1 : 0 }} />
      </div>

      <div className="relative z-10">
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="glass-nav flex items-center gap-1 px-2 py-2 rounded-full">
            <span className="text-white font-bold text-lg px-4 tracking-tight">RD</span>
            <div className="w-px h-5 bg-white/20 mx-1" />
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((s) => (
              <button key={s} onClick={() => scrollToSection(s.toLowerCase())} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === s.toLowerCase() ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>{s}</button>
            ))}
          </div>
        </nav>

        <section id="home" className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 glass-pill px-5 py-2 rounded-full mb-8 animate-fade-in">
              <span className="text-sm">✦</span>
              <span className="text-sm text-white/80 font-medium">Software Engineering Student</span>
            </div>
            <h1 className="hero-title text-7xl md:text-8xl font-bold mb-6 animate-fade-in">Riad Dragoci</h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed animate-fade-in-delay">Final-year Software Engineering student at the University of Greenwich, passionate about building intelligent systems and scalable solutions.</p>
            <div className="flex gap-4 justify-center animate-fade-in-delay-2">
              <button onClick={() => scrollToSection('contact')} className="glass-btn-primary px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105">Get in Touch</button>
              <button onClick={() => scrollToSection('projects')} className="glass-btn px-8 py-3 rounded-full text-white/80 text-sm font-medium transition-all duration-300 hover:scale-105 hover:text-white">View Projects</button>
            </div>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-4xl w-full">
            <Reveal><h2 className="section-title text-5xl font-bold mb-6 text-center">About Me</h2></Reveal>
            <Reveal delay={100}>
              <p className="text-center text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed">
                I thrive at the intersection of AI, data, and systems design. When I'm not writing code, you'll find me exploring new technologies, contributing to community projects, or perfecting my troubleshooting skills — a habit I picked up during my time at Vodafone.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Reveal delay={200}>
                <div className="glass-card p-6 rounded-2xl h-full">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm">🎓</span>
                    Education
                  </h3>
                  <div className="pl-11">
                    <p className="font-semibold text-white">BSc Software Engineering</p>
                    <p className="text-white/50 text-sm">University of Greenwich, London</p>
                    <p className="text-white/40 text-sm mb-3">Sep 2023 – Present</p>
                    <p className="text-sm text-white/60 leading-relaxed">Coursework includes Data Structures & Algorithms, Machine Learning, Big Data Systems, Computer Networks, Operating Systems, and Software Engineering.</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <div className="glass-card p-6 rounded-2xl h-full">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm">🌍</span>
                    Languages & Interests
                  </h3>
                  <div className="pl-11">
                    <div className="flex gap-6 mb-4">
                      <div><span className="text-white font-medium">Albanian</span> <span className="text-white/40 text-sm">Native</span></div>
                      <div><span className="text-white font-medium">English</span> <span className="text-white/40 text-sm">Fluent (IELTS)</span></div>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed">Interested in systems design, platform engineering, and applying AI to real-world problems. Enjoy building polished, professional-grade software from the ground up.</p>
                  </div>
                </div>
              </Reveal>
            </div>
            <Reveal delay={400}>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm">🏆</span>
                  Achievements & Leadership
                </h3>
                <div className="pl-11 grid md:grid-cols-2 gap-x-8 gap-y-2">
                  <p className="flex items-start text-sm text-white/60"><span className="text-purple-400/60 mr-2">›</span><span>2nd Place – National IT Olympiad</span></p>
                  <p className="flex items-start text-sm text-white/60"><span className="text-purple-400/60 mr-2">›</span><span>International English Language Olympiad – Global Hippo Association</span></p>
                  <p className="flex items-start text-sm text-white/60"><span className="text-purple-400/60 mr-2">›</span><span>Youth4Change Project – Community engagement & civic education</span></p>
                  <p className="flex items-start text-sm text-white/60"><span className="text-purple-400/60 mr-2">›</span><span>Team leader for collaborative group programming projects</span></p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-3xl mx-auto">
            <Reveal><h2 className="section-title text-5xl font-bold mb-6 text-center">Experience</h2></Reveal>
            <Reveal delay={100}><p className="text-center text-white/50 mb-14 max-w-lg mx-auto">Hands-on technical experience in a real-world telecoms environment.</p></Reveal>
            <Reveal delay={200}>
              <div className="glass-card p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">IT Technician Intern</h3>
                  <p className="text-white/50 text-sm mt-1">Vodafone · Shkodra, Albania</p>
                  <p className="text-white/40 text-sm">Jun 2024 – Sep 2024</p>
                </div>
                <p className="text-white/60 text-sm text-center mb-6 max-w-md mx-auto">Front-line technical support in a fast-paced telecommunications environment.</p>
                <ul className="space-y-3 max-w-lg mx-auto">
                  <li className="flex items-start text-sm text-white/60 leading-relaxed"><span className="text-purple-400/60 mr-3 mt-0.5">›</span><span>Diagnosed and resolved hardware, software, and connectivity issues for staff and customers</span></li>
                  <li className="flex items-start text-sm text-white/60 leading-relaxed"><span className="text-purple-400/60 mr-3 mt-0.5">›</span><span>Assisted with network configuration, equipment setup, and system maintenance</span></li>
                  <li className="flex items-start text-sm text-white/60 leading-relaxed"><span className="text-purple-400/60 mr-3 mt-0.5">›</span><span>Collaborated with senior technicians on cabling, device provisioning, and inventory management</span></li>
                  <li className="flex items-start text-sm text-white/60 leading-relaxed"><span className="text-purple-400/60 mr-3 mt-0.5">›</span><span>Developed troubleshooting skills working across diverse infrastructure challenges</span></li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="projects" className="min-h-screen px-6 py-24">
          <div className="max-w-6xl mx-auto">
            <Reveal><h2 className="section-title text-5xl font-bold mb-6 text-center">Featured Projects</h2></Reveal>
            <Reveal delay={100}><p className="text-center text-white/50 mb-14 max-w-lg mx-auto">A selection of projects spanning AI, data engineering, systems design, and networking.</p></Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Reveal key={index} delay={200 + index * 100}>
                  <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div><h3 className="text-xl font-bold text-white">{project.title}</h3><p className="text-white/40 text-sm mt-0.5">{project.subtitle}</p></div>
                      {'link' in project && project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-purple-400 transition-colors text-lg">↗</a>
                      ) : (
                        <span className="text-white/20 text-lg">↗</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (<span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300/80 text-xs rounded-full border border-purple-500/20">{tech}</span>))}
                    </div>
                    <p className="text-white/50 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <ul className="space-y-1.5 flex-1">
                      {project.highlights.map((h, i) => (<li key={i} className="flex items-start text-sm text-white/40"><span className="text-purple-400/50 mr-2">›</span><span>{h}</span></li>))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 max-w-lg mx-auto">
              <Reveal delay={700}>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-start justify-between mb-3">
                    <div><h3 className="text-xl font-bold text-white">{lastProject.title}</h3><p className="text-white/40 text-sm mt-0.5">{lastProject.subtitle}</p></div>
                    <span className="text-white/20 text-lg">↗</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {lastProject.tech.map((tech, i) => (<span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-300/80 text-xs rounded-full border border-purple-500/20">{tech}</span>))}
                  </div>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed">{lastProject.description}</p>
                  <ul className="space-y-1.5">
                    {lastProject.highlights.map((h, i) => (<li key={i} className="flex items-start text-sm text-white/40"><span className="text-purple-400/50 mr-2">›</span><span>{h}</span></li>))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="skills" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-3xl w-full">
            <Reveal><h2 className="section-title text-5xl font-bold mb-6 text-center">Technical Skills</h2></Reveal>
            <Reveal delay={100}><p className="text-center text-white/50 mb-14 max-w-lg mx-auto">Tools and technologies I work with across the stack.</p></Reveal>
            <div className="space-y-5">
              {skillCategories.map((cat, index) => (
                <Reveal key={index} delay={200 + index * 120}>
                  <div className="glass-card p-6 rounded-2xl text-center">
                    <h3 className="text-lg font-bold text-white mb-4">{cat.title}</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {cat.items.map((skill, i) => (<span key={i} className="skill-chip px-4 py-2 text-sm rounded-lg">{skill}</span>))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24">
          <div className="max-w-4xl w-full">
            <Reveal><h2 className="section-title text-5xl font-bold mb-4 text-center">Get In Touch</h2></Reveal>
            <Reveal delay={100}><p className="text-center text-white/40 mb-14 max-w-lg mx-auto">I'm actively looking for early-career roles in software engineering, systems design, and data platforms. Feel free to reach out — I'd love to chat.</p></Reveal>
            <div className="grid md:grid-cols-3 gap-5 mb-12">
              <Reveal delay={200}>
                <a href="mailto:riaddragoci29@gmail.com" className="glass-card p-6 rounded-2xl text-center block">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">Email</h3>
                  <p className="text-white/40 text-xs">riaddragoci29@gmail.com</p>
                </a>
              </Reveal>
              <Reveal delay={300}>
                <a href="tel:+447958159817" className="glass-card p-6 rounded-2xl text-center block">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">Phone</h3>
                  <p className="text-white/40 text-xs">+44 7958 159817</p>
                </a>
              </Reveal>
              <Reveal delay={400}>
                <div className="glass-card p-6 rounded-2xl text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">Location</h3>
                  <p className="text-white/40 text-xs">Sutton, UK</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={500}>
              <div className="flex justify-center">
                <GlareHover width="auto" height="auto" background="rgba(82,39,255,0.15)" borderRadius="999px" borderColor="rgba(82,39,255,0.3)" glareColor="#7c5cff" glareOpacity={0.3} className="px-10 py-4">
                  <a href="mailto:riaddragoci29@gmail.com" className="text-white font-semibold text-base flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    Send Me a Message
                  </a>
                </GlareHover>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="py-8 px-6 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto text-center text-white/30 text-sm">
            <p>&copy; 2026 Riad Dragoci</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;