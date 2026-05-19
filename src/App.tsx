import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Ship, Plane, Truck, Globe, MousePointerClick, Menu, X, ArrowRight, CornerDownRight, ShieldAlert, Zap, Box, Compass, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Blob } from './components/Blob';
import ShipmentTracker from './components/ShipmentTracker';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CaseStudies from './pages/CaseStudies';
import ServiceDetail from './pages/ServiceDetail';
import Lenis from 'lenis';

// Image Imports
import heroShip from './assets/images/cargo_ship_hero_1778982638392.png';
import shippingYard from './assets/images/shipping_yard_bg_1778982623151.png';
import warehouseImg from './assets/images/warehouse_interior_1778988395381.png';
import truckImg from './assets/images/heavy_haulage_truck_1778988412569.png';
import cranesImg from './assets/images/port_harbour_cranes_1778988430081.png';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme
    const savedTheme = localStorage.getItem('om-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('om-theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const percent = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
      
      setScrollPercent(percent);
      setIsScrolled(currentScroll > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Tracking', href: '/#tracking' },
    { name: 'Mission', href: '/#mission' },
    { name: 'Network', href: '/#network' },
    { name: 'Connect', href: '/#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 
        ${isScrolled ? 'nav-blur py-3 border-b border-white/5' : 'bg-transparent py-6'}
        ${scrollPercent > 20 && !isMenuOpen ? 'opacity-20 hover:opacity-100' : 'opacity-100'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center font-mono tracking-[0.3em] text-[10px]">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-8 h-8 border border-white/20 flex items-center justify-center font-bold text-xs bg-black uppercase">OM</div>
          <div className="flex flex-col gap-0 leading-none">
            <span className="font-bold text-white tracking-widest">Ocean Masters</span>
            <span className="text-[7px] text-accent font-bold tracking-[0.4em] mt-1 italic">Limited</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 opacity-60">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-accent hover:opacity-100 transition-all">{link.name}</a>
          ))}
          <Link to="/case-studies" className={`${location.pathname === '/case-studies' ? 'text-accent' : ''} hover:text-accent hover:opacity-100 transition-all`}>Cases</Link>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 border border-white/5 hover:border-accent/40 transition-all duration-300 rounded-full hover:bg-white/5 text-[var(--text-primary)] relative group"
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 0.8 }}
              className="relative z-10"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </motion.div>
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 rounded-full transition-colors" />
          </button>
          <a href="#contact" className="hidden sm:block px-5 py-2 border border-accent/40 text-accent font-bold hover:bg-accent hover:text-white transition-all text-[9px] rounded-full">
            [ Get Quote ]
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black border-b border-white/5 p-8 flex flex-col gap-6 md:hidden font-mono tracking-[0.2em] text-xs shadow-2xl"
        >
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)}>{link.name}</a>
          ))}
          <Link to="/case-studies" onClick={() => setIsMenuOpen(false)}>Case Studies</Link>
          <button className="w-full py-4 border border-accent/20 text-accent rounded-full">
            [ Portal Login ]
          </button>
          <button 
            onClick={() => {
              toggleTheme();
              setIsMenuOpen(false);
            }}
            className="w-full py-4 border border-white/10 flex items-center justify-center gap-3 text-xs rounded-full"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yardY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0]);

  const colorIndexRef = useRef(0);

  const strikeLightning = (e: React.MouseEvent) => {
    if (!container.current) return;
    
    const rect = container.current.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    // Trigger 4 strikes in a rapid sequence
    for (let s = 0; s < 4; s++) {
      setTimeout(() => {
        if (!container.current) return;

        // Lightning colors: Red, Blue, White, Grey
        const colors = ['#e11d48', '#3b82f6', '#ffffff', '#94a3b8'];
        const color = colors[colorIndexRef.current];
        colorIndexRef.current = (colorIndexRef.current + 1) % colors.length;
        
        // Randomize the branch position slightly for each strike
        const offsetX = (Math.random() - 0.5) * 100;

        // Create lightning SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 1000");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = `${targetX + offsetX - 50}px`;
        svg.style.width = "100px";
        svg.style.height = `${targetY}px`;
        svg.style.pointerEvents = "none";
        svg.style.zIndex = "5";
        svg.style.filter = `drop-shadow(0 0 15px ${color})`;
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        let d = "M 50 0";
        let curX = 50;
        const segments = 12;
        for (let i = 1; i <= segments; i++) {
            curX += (Math.random() - 0.5) * 60;
            d += ` L ${curX} ${(i / segments) * 1000}`;
        }
        
        path.setAttribute("d", d);
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", "3");
        path.setAttribute("fill", "none");
        path.style.opacity = "0";
        
        svg.appendChild(path);
        container.current.appendChild(svg);

        // Global background flash
        gsap.to(container.current, {
          backgroundColor: `${color}22`,
          duration: 0.05,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            if (container.current) gsap.to(container.current, { backgroundColor: 'transparent', duration: 0.5 });
          }
        });

        // Bolt flash animation with afterglow
        const tl = gsap.timeline({
          onComplete: () => {
            svg.remove();
          }
        });

        // Phase 1: High-intensity strike
        tl.to(path, {
          opacity: 1,
          duration: 0.04,
          repeat: 7,
          yoyo: true,
          ease: "power2.inOut"
        });

        // Phase 2: Gradual fading afterglow with shimmering
        tl.to(path, {
          opacity: 0.4,
          duration: 0.2,
          ease: "power4.out"
        });

        tl.to(path, {
          opacity: 0,
          x: () => (Math.random() - 0.5) * 5, // Subtle jitter
          duration: 1.5,
          ease: "rough({ template: power1.out, strength: 2, points: 20, taper: 'out', randomize: true })"
        });

        tl.to(svg, {
          scaleX: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out"
        }, "-=1.5");
      }, s * 80); // Stagger each of the 4 strikes
    }
  };

  return (
    <section 
      ref={container} 
      onMouseDown={strikeLightning}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden cursor-crosshair select-none"
    >
      {/* Background Layers */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="absolute inset-0 z-0 bg-ocean-950 hero-bg-ship-container"
      >
        <img 
          src={heroShip} 
          alt="Cargo ship at night" 
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay dark:mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/20 via-transparent to-ocean-950 opacity-100 dark:opacity-100 transition-opacity" />
      </motion.div>

      {/* Shipment Yard Reveal on Scroll */}
      <motion.div 
        style={{ y: yardY, opacity: useTransform(scrollYProgress, [0, 0.3], [0, 0.2]), scale: useTransform(scrollYProgress, [0, 1], [1.1, 1]) }}
        className="absolute inset-0 z-0 pointer-events-none hero-bg-yard-container"
      >
        <img 
          src={shippingYard} 
          alt="Shipping Yard" 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale opacity-50"
        />
      </motion.div>

      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "5%"]) }}
        className="absolute inset-0 z-10 pointer-events-none opacity-30"
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <Blob />
        </Canvas>
      </motion.div>

      <motion.div 
        style={{ y: contentY }}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center space-y-8 pt-40"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-mono text-[10px] uppercase tracking-[0.6em] flex items-center justify-center gap-6 text-accent"
          >
            <div className="w-12 h-[1px] bg-accent/40" />
            Global Logistics Mastery
            <div className="w-12 h-[1px] bg-accent/40" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[10rem] font-display font-black uppercase tracking-[-0.05em] leading-[0.8] text-glow-red"
          >
            Freight<br />
            <span className="opacity-10 translate-x-8 inline-block italic">Solutions</span>
          </motion.h1>

          <div className="max-w-3xl mx-auto py-8 bg-black/40 backdrop-blur-xl border border-white/10 p-10 grid grid-cols-1 md:grid-cols-3 gap-10 font-mono">
            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tighter">150+</div>
              <div className="text-[8px] opacity-40 uppercase tracking-widest">Ports Served</div>
            </div>
            <div className="space-y-1 border-x border-white/10 px-4">
              <div className="text-3xl font-bold tracking-tighter">Accra</div>
              <div className="text-[8px] opacity-40 uppercase tracking-widest">Strategic Hub</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold tracking-tighter">2.4k</div>
              <div className="text-[8px] opacity-40 uppercase tracking-widest">Global Partners</div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a href="#contact" className="group relative px-14 py-6 bg-accent text-white font-mono font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-accent/20 overflow-hidden rounded-full">
            <span className="relative z-10">Get a Quote</span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity z-20 font-bold">Get a Quote</span>
          </a>
          
          <a href="#services" className="px-14 py-6 border border-white/20 hover:border-accent hover:text-accent font-mono uppercase tracking-widest text-[10px] transition-all rounded-full">
            Our Services
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative Brackets */}
      <div className="absolute top-40 left-10 w-8 h-8 border-t border-l border-white/10" />
      <div className="absolute top-40 right-10 w-8 h-8 border-t border-r border-white/10" />
      <div className="absolute bottom-40 left-10 w-8 h-8 border-b border-l border-white/10" />
      <div className="absolute bottom-40 right-10 w-8 h-8 border-b border-r border-white/10" />
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest opacity-40">
        <MousePointerClick size={12} className="animate-bounce" />
        Scroll to transmit
      </div>
    </section>
  );
};

const ServicesGrid = () => {
  const services = [
    { id: '01', slug: 'freight-logistics', title: 'Freight Logistics', desc: 'Secure air, land, and sea transport via optimized trade routes.', icon: Globe },
    { id: '02', slug: 'harbour-clearing', title: 'Harbour Clearing', desc: 'Professional customs and airport clearance protocols.', icon: Compass },
    { id: '03', slug: 'warehousing', title: 'Warehousing', desc: 'Bonded and non-bonded secure storage infrastructure.', icon: Box },
    { id: '04', slug: 'dangerous-goods', title: 'Dangerous Goods', desc: 'IMO certified handling and hazardous materials transport.', icon: ShieldAlert },
    { id: '05', slug: 'specialized-cargo', title: 'Specialized Cargo', desc: 'Diplomatic freight and tactical aviation support.', icon: Zap },
    { id: '06', slug: 'haulage', title: 'Haulage', desc: 'Heavy-duty transport and nationwide distribution fleets.', icon: Truck },
  ];

  return (
    <section id="services" className="py-40 bg-ocean-950 px-6 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
        <div className="w-full lg:w-1/3 space-y-10 lg:sticky lg:top-32 h-fit">
          <div className="inline-block py-1 pr-6 border-r border-white/10 font-mono text-[10px] tracking-[0.5em] uppercase opacity-40">
            Core Competencies
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight leading-[0.9]">
            Precision<br />At Every<br /><span className="text-accent underline decoration-white/10 underline-offset-8">Coordinate</span>
          </h2>
          <p className="font-mono text-xs tracking-widest leading-relaxed opacity-40">
            Our infrastructure is built for reliability. From factory industrial haulage to sensitive diplomatic freight, we maintain absolute authority across global territories.
          </p>
          <div className="pt-6">
            <a href="#contact" className="px-8 py-4 bg-white text-black dark:bg-white dark:text-black font-mono text-[9px] font-bold tracking-[0.2em] hover:bg-accent hover:text-white transition-all rounded-full border border-white/10">
              Initiate transmission
            </a>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-white/5 border border-white/5">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-0 hover:z-10 bg-ocean-950 h-full"
            >
              <Link 
                to={`/services/${service.slug}`}
                className="p-10 lg:p-14 h-full bg-ocean-950 space-y-8 group cursor-pointer transition-colors relative overflow-hidden block"
              >
                <div className="flex justify-between items-start relative z-10">
                  <span className="font-mono text-[10px] opacity-10 group-hover:opacity-100 group-hover:text-accent transition-all">[{service.id}]</span>
                  <service.icon size={24} className="opacity-10 group-hover:opacity-100 group-hover:text-white transition-all" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl lg:text-3xl font-display font-bold uppercase tracking-tight group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="font-mono text-[10px] tracking-widest leading-loose opacity-40 group-hover:opacity-100 transition-opacity">
                    {service.desc}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 relative z-10">
                  <CornerDownRight size={14} className="text-accent" />
                  <span className="font-mono text-[9px] tracking-widest text-white underline underline-offset-4 decoration-accent">Details protocol</span>
                </div>
                {/* Subtle accent hover indicator */}
                <div className="absolute top-0 left-0 w-[2px] h-0 bg-accent group-hover:h-full transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SpecializedServices = () => {
  return (
    <section id="solutions" className="py-40 bg-ocean-950 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img src={shippingYard} alt="Overlay" loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
        <div className="flex-1 space-y-12">
          <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-none text-accent italic">
            Precision in<br />Perilous Cargo
          </h2>
          <p className="font-mono text-sm tracking-[0.1em] leading-loose opacity-60">
            Handling dangerous goods demands absolute authority. Our certified experts navigate the complex regulations of hazardous materials transport with military-grade precision and safety protocols.
          </p>
          
          <ul className="space-y-6 font-mono text-[10px] tracking-widest">
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#e11d48]" />
              Imo class 1 9 handling
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#e11d48]" />
              Chemical logistics
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#e11d48]" />
              Lithium battery transport
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#e11d48]" />
              Emergency response units
            </li>
          </ul>

          <div className="pt-8">
            <Link to="/case-studies" className="font-mono text-[9px] tracking-widest text-accent border-b border-accent pb-2 hover:opacity-70 transition-opacity">
              Read full case study →
            </Link>
          </div>
        </div>

        <div className="flex-1 relative group">
          <div className="aspect-[4/5] bg-ocean-900 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-[0.3em] z-10 text-white">Dangerous goods</div>
            <div className="w-full h-full border border-white/5 bg-ocean-950/40 relative">
               <img src={shippingYard} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="absolute bottom-6 left-6 p-2 bg-black border border-white/20 font-mono text-[8px] tracking-widest text-accent font-bold">Capability</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExperienceShowcase = () => {
  const experiences = [
    {
      title: "Freight Logistics Mastery",
      context: "SME Export",
      description: "Ship faster from Ghana to global markets. Ocean Masters handles door to port consolidation and export docs in one workflow, reducing shipping time by up to 18 22% on UK routes.",
      tags: ["Accra Textiles Ltd", "18 22% Faster", "Consolidation"],
      image: heroShip
    },
    {
      title: "Dangerous Goods Protocol",
      context: "Chemicals",
      description: "IATA & IMO certified handling for hazardous cargo. Our specialists prepare MSDS and packaging correctly the first time, maintaining a 100% clearance rate in 2025.",
      tags: ["PharmaWest Ghana", "100% Compliance", "IMO Certified"],
      image: shippingYard
    },
    {
      title: "Port Speed Strategy",
      context: "Clearing & Forwarding",
      description: "Clear your cargo at KIA & Tema Port fast. We save clients thousands in demurrage by filing entries same day and coordinating inspections proactively.",
      tags: ["Accra Engineering", "24 48hr Release", "Harbour Logistics"],
      image: cranesImg
    },
    {
      title: "Diplomatic Chain of Custody",
      context: "Priority Ops",
      description: "Specialized handling for embassies and AOG parts. Discreet, compliant freight with special exemptions and 12 hour response for aviation operations.",
      tags: ["Embassy Support", "AOG Response", "Secure Registry"],
      image: warehouseImg
    }
  ];

  return (
    <section id="mission" className="py-40 bg-ocean-950 px-6 relative">
       <div className="max-w-7xl mx-auto space-y-40">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="space-y-6 max-w-2xl">
              <div className="font-mono text-[10px] tracking-[0.5em] opacity-40">Operational excellence</div>
              <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tight leading-none text-glow-red">
                Strategic<br />Impact
              </h2>
            </div>
            <p className="font-mono text-[10px] tracking-widest leading-loose opacity-40 max-w-sm">
              We translate logistical friction into operational victory using verified protocols and real-time execution.
            </p>
          </div>

          <div className="relative">
            {experiences.map((exp, idx) => (
              <div key={idx} className="card-overlap mb-20 lg:mb-40">
                <div className="bg-ocean-900 border border-white/5 p-8 md:p-20 flex flex-col md:flex-row gap-12 lg:gap-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
                  <div className="flex-1 space-y-8 lg:space-y-10">
                    <div className="flex justify-between items-center font-mono opacity-40 text-[8px] lg:text-[9px] tracking-widest">
                       <span>{exp.context}</span>
                       <span>0{idx+1} / 0{experiences.length}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium uppercase tracking-tight text-white italic underline decoration-accent/20 underline-offset-8">{exp.title}</h3>
                    <p className="font-mono text-xs lg:text-sm tracking-widest leading-loose opacity-60">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2 lg:gap-4 pt-4 lg:pt-6">
                      {exp.tags.map(tag => (
                         <span key={tag} className="px-3 lg:px-4 py-1.5 lg:py-2 border border-white/10 font-mono text-[7px] lg:text-[8px] tracking-widest opacity-40">{tag}</span>
                      ))}
                    </div>
                    <div className="pt-6">
                       <Link to="/case-studies" className="inline-flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-accent hover:gap-5 transition-all">
                          Read case protocol <ArrowRight size={14} />
                       </Link>
                    </div>
                  </div>
                  <div className="w-full md:w-2/5 aspect-video md:aspect-[4/5] bg-ocean-950 relative overflow-hidden group border border-white/5">
                     <img 
                      src={exp.image} 
                      loading="lazy"
                      decoding="async"
                      className="operations-img w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                      alt="Operations visual"
                     />
                     <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute bottom-6 right-6 lg:bottom-10 lg:left-10 font-mono text-[8px] lg:text-[10px] tracking-widest border border-white/20 p-3 lg:p-4 bg-black/80 backdrop-blur-md">Om protocol 0{idx+1}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
       </div>
    </section>
  );
};

const AIIntelligence = () => {
  return (
    <section className="py-40 bg-black px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,45,85,0.1),_transparent_70%)] animate-pulse" />
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center relative z-10">
        <div className="flex-1 space-y-10">
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.5em] text-accent">
            <Zap size={14} />
            Ai enabled operations
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tighter leading-none text-white">
            Logistics<br /><span className="text-accent underline decoration-white/20">Intelligence</span>
          </h2>
          <p className="font-mono text-sm tracking-widest leading-loose opacity-60">
            Our AI-powered customer support core breaks language barriers and optimizes routing data in real-time. Experience a significant boost in response precision and multi-lingual clearing assistance.
          </p>
          <div className="flex gap-10 font-mono text-[10px] tracking-widest">
            <div className="space-y-2">
              <div className="text-white font-bold uppercase">99.9%</div>
              <div className="opacity-40">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-bold uppercase">24/7</div>
              <div className="opacity-40">Ai support</div>
            </div>
            <div className="space-y-2">
              <div className="text-white font-bold uppercase">Any</div>
              <div className="opacity-40">Language</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className="aspect-square bg-ocean-950 border border-white/10 flex items-center justify-center p-20">
             <div className="w-full h-full border border-accent/20 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-3/4 h-3/4 border border-white/10 rounded-full flex items-center justify-center">
                   <div className="w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl" />
                </div>
             </div>
             <div className="absolute inset-0 flex items-center justify-center font-mono text-[8px] tracking-[0.4em] opacity-40">
                Data stream active
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LiveOperationsMonitor = () => {
  return (
    <section id="tracking" className="py-40 bg-ocean-950 px-6 relative overflow-hidden flex flex-col items-center">
       {/* Background accent */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
       
       <div className="max-w-7xl w-full space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
             <div className="space-y-6 max-w-2xl">
                <div className="font-mono text-[10px] tracking-[0.5em] text-accent">Active stream // live</div>
                <h2 className="text-5xl md:text-8xl font-display font-bold uppercase tracking-tight leading-none">
                  Operations<br />Monitor
                </h2>
             </div>
             <p className="font-mono text-[10px] tracking-widest leading-loose opacity-40 max-w-sm">
                Global asset visibility for our partners. Track multiple haulage and freight units across the West African corridor and beyond.
             </p>
          </div>

          <div className="relative">
             <div className="absolute -inset-1 bg-accent/10 blur-3xl pointer-events-none" />
             <div className="relative z-10 bg-ocean-950/80 border border-white/5 p-4 md:p-10 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]">
                <ShipmentTracker />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-white/5 font-mono">
             <div className="space-y-2">
                <div className="text-[8px] opacity-40 tracking-widest uppercase">Encryption Status</div>
                <div className="text-xs text-accent font-bold tracking-widest uppercase">E2EE Protocol Active</div>
             </div>
             <div className="space-y-2">
                <div className="text-[8px] opacity-40 tracking-widest uppercase">System Latency</div>
                <div className="text-xs text-white tracking-widest uppercase">24ms Peak Response</div>
             </div>
             <div className="space-y-2">
                <div className="text-[8px] opacity-40 tracking-widest uppercase">Global Nodes</div>
                <div className="text-xs text-white tracking-widest uppercase">152 Coordinates Monitored</div>
             </div>
          </div>
       </div>
    </section>
  );
};
const ConnectSection = () => {
  const [activeTab, setActiveTab] = useState<'contact' | 'quote' | 'enquiry' | 'complaint'>('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    origin: '',
    destination: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: activeTab }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          origin: '',
          destination: '',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-40 bg-ocean-950 px-6 border-t border-white/5 relative">
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="font-mono text-[10px] tracking-[0.5em] opacity-40">System access</div>
              <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tight leading-none">
                Initiate<br />Contact
              </h2>
            </div>
            
            <p className="font-mono text-sm tracking-widest leading-loose opacity-40 max-w-sm">
              Our global operations center is active 24/7. Select your request type to begin the transmission.
            </p>

            <div className="space-y-10 pt-10 border-t border-white/5">
              <div className="space-y-2">
                <div className="font-mono text-[8px] tracking-widest opacity-40">Accra hq</div>
                <div className="font-mono text-xs tracking-widest uppercase">+233 (0) 302947037</div>
              </div>
              <div className="space-y-2">
                <div className="font-mono text-[8px] tracking-widest opacity-40">Global support</div>
                <div className="font-mono text-xs tracking-widest">info@oceanmasters.com.gh</div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-ocean-900 border border-accent/20 p-8 md:p-12 shadow-2xl relative">
            <div className="absolute -top-4 -right-4 p-4 bg-accent font-mono text-[10px] font-bold text-white shadow-xl">Secure Trans</div>
            
            <div className="flex gap-6 mb-12 border-b border-white/10 overflow-x-auto pb-4 font-mono text-[9px] tracking-widest">
              <button 
                onClick={() => { setActiveTab('contact'); setStatus('idle'); }} 
                className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeTab === 'contact' ? 'border-accent text-accent' : 'border-transparent opacity-40'}`}
              >
                [ Contact Us ]
              </button>
              <button 
                onClick={() => { setActiveTab('quote'); setStatus('idle'); }} 
                className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeTab === 'quote' ? 'border-accent text-accent' : 'border-transparent opacity-40'}`}
              >
                [ Request Quote ]
              </button>
              <button 
                onClick={() => { setActiveTab('enquiry'); setStatus('idle'); }} 
                className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeTab === 'enquiry' ? 'border-accent text-accent' : 'border-transparent opacity-40'}`}
              >
                [ General Enquiry ]
              </button>
              <button 
                onClick={() => { setActiveTab('complaint'); setStatus('idle'); }} 
                className={`whitespace-nowrap pb-2 border-b-2 transition-all ${activeTab === 'complaint' ? 'border-accent text-accent' : 'border-transparent opacity-40'}`}
              >
                [ File Report ]
              </button>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
              >
                <div className="w-16 h-16 border border-accent rounded-full flex items-center justify-center">
                  <ArrowRight className="text-accent -rotate-45" size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold uppercase">Transmission Successful</h3>
                  <p className="font-mono text-[10px] tracking-widest opacity-40">Your data has been securely forwarded to HQ.</p>
                </div>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 border border-white/10 font-mono text-[8px] uppercase tracking-widest hover:bg-white/5 transition-colors rounded-full"
                >
                  Send another transmission
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[8px] tracking-widest opacity-40">Full Identification</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none" 
                      placeholder="Name Co" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] tracking-widest opacity-40">Communication Channel</label>
                    <input 
                      required
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none" 
                      placeholder="Email Sys Om" 
                    />
                  </div>
                </div>

                {activeTab === 'contact' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 motion-safe:animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      <label className="text-[8px] lowercase tracking-widest opacity-40">direct phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none lowercase" 
                        placeholder="+233 ... / +1 ..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] lowercase tracking-widest opacity-40">subject topic</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none" 
                        placeholder="re service query" 
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'quote' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 motion-safe:animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                      <label className="text-[8px] lowercase tracking-widest opacity-40">origin hub</label>
                      <input 
                        type="text" 
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none" 
                        placeholder="city, country" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] lowercase tracking-widest opacity-40">destination hub</label>
                      <input 
                        type="text" 
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none" 
                        placeholder="city, country" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[8px] lowercase tracking-widest opacity-40">message transmission</label>
                  <textarea 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    className="w-full bg-black border border-white/10 p-4 text-xs focus:border-accent transition-colors outline-none resize-none" 
                    placeholder="specify details" 
                  />
                </div>

                <div className="space-y-4">
                  {status === 'error' && (
                    <p className="font-mono text-[8px] text-accent tracking-widest animate-pulse">
                      [ System error: Transmission failed. Frequency interference detected. ]
                    </p>
                  )}
                  <button 
                    disabled={status === 'submitting'}
                    type="submit" 
                    className="w-full py-6 bg-accent/10 border border-accent/40 text-accent font-bold lowercase tracking-[0.3em] text-[10px] hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait rounded-full shadow-lg shadow-accent/5 focus:ring-2 focus:ring-accent/20 outline-none"
                  >
                    {status === 'submitting' ? 'Transmitting...' : 'submit protocol'}
                  </button>
                </div>
              </form>
            )}
          </div>
       </div>
    </section>
  );
};

const GlobalNetwork = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <section ref={containerRef} id="network" className="py-40 bg-ocean-950 px-6 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="flex-1 space-y-12">
            <div className="space-y-4">
              <div className="font-mono text-[10px] tracking-[0.5em] opacity-40">Operational reach</div>
              <h2 className="text-4xl md:text-7xl font-display font-bold uppercase tracking-tight leading-none text-glow-red">
                Connecting<br />Continents
              </h2>
            </div>
            
            <p className="font-mono text-sm tracking-widest leading-loose opacity-40 max-w-lg">
              Strategic hubs in Accra, USA, UK, and UAE enable specialized cargo handling across 9 global regions. Our route network is optimized for time, compliance, and security.
            </p>

            <div className="grid grid-cols-2 gap-10 border-t border-white/10 pt-10 font-mono">
              <div className="space-y-2">
                <div className="text-[10px] opacity-40 tracking-widest">Americas</div>
                <div className="text-sm font-bold uppercase">Usa / North Atlantic</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] opacity-40 tracking-widest">Europe</div>
                <div className="text-sm font-bold uppercase">Uk / Continental Eu</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] opacity-40 tracking-widest">Asia & Me</div>
                <div className="text-sm font-bold uppercase">China / Uae / Asia</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] opacity-40 tracking-widest">Africa</div>
                <div className="text-sm font-bold uppercase">West coast / Rsa</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full aspect-square relative">
            <div className="absolute inset-0 border border-white/5 bg-white/[0.01] flex items-center justify-center">
              <motion.div 
                style={{ rotate: 15 }}
                animate={{ rotate: [15, 25, 15] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-3/4 h-3/4 border border-white/10 rounded-full flex items-center justify-center"
              >
                <div className="w-1/2 h-1/2 border border-white/20 rounded-full flex items-center justify-center opacity-50">
                  <div className="w-1/4 h-1/4 bg-white/40 rounded-full blur-xl" />
                </div>
              </motion.div>
              
              {[
                { top: '20%', left: '30%', label: 'LHR' },
                { top: '40%', left: '70%', label: 'DXB' },
                { top: '70%', left: '45%', label: 'ACC' },
                { top: '35%', left: '15%', label: 'JFK' },
              ].map((marker, idx) => (
                <motion.div 
                  key={idx}
                  style={{ top: marker.top, left: marker.left }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="absolute flex flex-col items-center"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full mb-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  <span className="font-mono text-[8px] tracking-tighter opacity-40">{marker.label}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute -bottom-6 -right-6 p-6 bg-ocean-900 border border-white/10 font-mono text-[8px] tracking-widest space-y-2 shadow-2xl">
              <div>Vector index: 401a</div>
              <div>Optimization: Active</div>
              <div>Transit time: Calculating...</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: "Ama K.", role: "Export manager, Accra Textiles Ltd", text: "We were quoted 21 days for 300kg of kente to Heathrow. Ocean masters consolidated, handled the EUR.1 cert, and delivered in 16 days. Saved us £420." },
    { name: "Samuel O.", role: "Ops director, Accra Engineering", text: "We saved GH₵ 8,000 in port fees because they cleared our machinery before demurrage kicked in at Tema. Very proactive team." },
    { name: "Dr. Kofi M.", role: "Procurement lead, Pharmawest Ghana", text: "Our lab chemicals were stuck for 2 weeks with another agent. Ocean masters cleared them in 2 days. They actually know the dg codes." },
    { name: "Kwame D.", role: "Supply chain manager, FMCG Dist.", text: "Their trucks show up on time and the driver calls before delivery. We track every container from Tema to our warehouse in real-time." },
  ];

  return (
    <section className="py-20 bg-ocean-900 border-y border-white/5 overflow-hidden font-mono">
      <div className="flex animate-marquee gap-20 whitespace-nowrap px-10">
        {[...reviews, ...reviews].map((review, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="text-[10px] text-accent font-bold tracking-widest">/ {review.name}</div>
            <div className="text-[8px] opacity-40 tracking-widest">{review.role}</div>
            <div className="text-xs italic opacity-80 tracking-tight max-w-sm overflow-hidden text-ellipsis whitespace-normal">"{review.text}"</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const LandingPage = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Card overlapping effect logic
    gsap.utils.toArray<HTMLElement>('.card-overlap').forEach((card, i) => {
      const inner = card.querySelector('.bg-ocean-900');
      const img = card.querySelector('.operations-img');
      
      // Reveal image on enter
      gsap.fromTo(img, 
        { clipPath: 'inset(100% 0 0 0)', scale: 1.2 },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Pinning and overlap
      ScrollTrigger.create({
        trigger: card,
        start: 'top 10%',
        pin: true,
        pinSpacing: false,
        endTrigger: '#network',
        end: 'top top',
        onEnter: () => gsap.to(inner, { boxShadow: '0 50px 100px -20px rgba(225,29,72,0.15)', duration: 0.5 }),
        onLeaveBack: () => gsap.to(inner, { boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)', duration: 0.5 }),
      });

      // Simple parallax/scale effect for covered cards
      gsap.to(inner, {
        scale: 0.95,
        y: -20,
        scrollTrigger: {
          trigger: card,
          start: `top 10%`,
          end: 'bottom top',
          scrub: true,
          // Only start scaling once it reaches the top
          onEnter: () => {},
        }
      });
    });

    // Handle hash scrolling
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Hero />
      <Testimonials />
      <ServicesGrid />
      <AIIntelligence />
      <LiveOperationsMonitor />
      <SpecializedServices />
      <ExperienceShowcase />
      <GlobalNetwork />
      <ConnectSection />
    </>
  );
};

export default function App() {
  return (
    <div className="bg-ocean-950 min-h-screen relative selection:bg-white selection:text-black">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
      </Routes>
      
      {/* Footer / Contact Preview */}
      <footer className="py-20 border-t border-white/5 px-6 font-mono text-[10px] tracking-[0.3em] opacity-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-white/40 flex items-center justify-center font-bold uppercase">OM</div>
            <span>Ocean Masters International Ltd.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link to="/#services" className="hover:text-accent transition-colors">Services</Link>
            <Link to="/#mission" className="hover:text-accent transition-colors">Mission</Link>
            <Link to="/#network" className="hover:text-accent transition-colors">Network</Link>
            <a href="#contact" className="hover:text-accent transition-colors">Connect</a>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div>© 2024 Om sys logistics</div>
            <div className="text-[7px] tracking-widest text-accent italic">Precision guaranteed</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

