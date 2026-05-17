import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Globe, ShieldAlert, Zap, Truck, Ship, Box, Compass, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      quote: "We were quoted 21 days for 300kg of kente to Heathrow. Ocean Masters consolidated with another shipper, handled the EUR.1 cert, and delivered in 16 days. Saved us £420 in air freight. They sent photos at every stage.",
      author: "Ama K.",
      role: "Export Manager",
      company: "Accra Textiles Ltd",
      detail: "Shipment: Accra → London, March 2026. Verified client since 2024."
    },
    {
      quote: "Our lab chemicals were stuck for 2 weeks with another agent. Ocean Masters cleared them in 2 days. They actually know the DG codes and IATA protocols inside out.",
      author: "Dr. Kofi M.",
      role: "Procurement Lead",
      company: "PharmaWest Ghana",
      detail: "Shipment: Chemicals Hub → Accra, Feb 2026."
    },
    {
      quote: "We saved over GH₵ 15,000 in port fees because they cleared our machinery before demurrage kicked in. Very proactive team that understands the Tema harbor landscape.",
      author: "Samuel O.",
      role: "Operations Director",
      company: "Accra Engineering",
      detail: "Shipment: heavy Machinery Import, Jan 2026."
    },
    {
      quote: "For sensitive diplomatic shipments, discretion and speed matter. Ocean Masters delivered both. Their chain-of-custody protocols are military grade.",
      author: "Anonymous",
      role: "Logistics Officer",
      company: "Diplomatic Mission",
      detail: "Secure Registry Deployment, 2025."
    }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-40 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20">
          <div className="space-y-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent flex items-center gap-4">
              <Quote size={12} />
              Validated Operations
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight">
              Protocol<br /><span className="opacity-20 italic">Feedback</span>
            </h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group"
            >
              <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={next}
              className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group"
            >
              <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20"
            >
              <div className="lg:col-span-8 space-y-10">
                <div className="text-2xl md:text-4xl lg:text-5xl font-display font-medium leading-tight opacity-90 italic">
                  "{testimonials[currentIndex].quote}"
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-[1px] bg-accent" />
                    <div className="font-mono">
                      <div className="text-sm uppercase tracking-widest text-white">{testimonials[currentIndex].author}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-40">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</div>
                    </div>
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-20 ml-14">
                    [ {testimonials[currentIndex].detail} ]
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 hidden lg:block">
                <div className="w-full aspect-square bg-white/[0.02] border border-white/5 flex items-center justify-center relative group">
                  <div className="absolute inset-2 border border-white/5" />
                  <Quote size={80} className="opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
                  <div className="absolute bottom-6 left-6 font-mono text-[8px] uppercase tracking-widest opacity-20">
                    AUTH_SIG // {testimonials[currentIndex].author.toUpperCase()}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-20 flex gap-2">
          {testimonials.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-12 bg-accent' : 'w-4 bg-white/10'}`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const CaseStudyCard = ({ title, sector, description, image, outcome, tags }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 py-20 border-b border-white/5 last:border-0">
    <div className="space-y-8">
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
        <span className="px-2 py-1 border border-accent/30 bg-accent/10">{sector}</span>
        <div className="w-12 h-[1px] bg-accent/40" />
        01 // CASE_FILE
      </div>
      <h2 className="text-4xl lg:text-7xl font-display font-bold uppercase tracking-tight leading-[0.9]">
        {title}
      </h2>
      <p className="font-mono text-sm uppercase tracking-widest leading-loose opacity-60 max-w-xl">
        {description}
      </p>
      
      <div className="space-y-6">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold">Protocol Outcomes:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {outcome.map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="w-1.5 h-1.5 bg-accent/60 rounded-full mt-1 group-hover:bg-accent transition-colors" />
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-10">
        {tags.map((tag: string) => (
          <span key={tag} className="px-5 py-2 border border-white/10 font-mono text-[8px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:border-accent/40 transition-all cursor-default">
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className="relative group overflow-hidden bg-ocean-900 border border-white/10 p-1">
       <img src={image} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 group-hover:scale-105 transition-all duration-1000" alt={title} />
       <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
       
       <div className="absolute top-8 right-8 p-4 bg-black/80 backdrop-blur-md border border-white/10 font-mono text-[8px] uppercase tracking-[0.3em] opacity-40">
          [ DEPLOYMENT_ACTIVE ]
       </div>
    </div>
  </div>
);

export default function CaseStudies() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const cases = [
    {
      title: "The SME Global Export Pivot",
      sector: "Freight Logistics",
      description: "Ghanaian exporters often struggle with fragmented quotes and port delays. We implemented a unified door-to-port consolidation workflow for textiles shipping to London.",
      image: "/src/assets/images/cargo_ship_hero_1778982638392.png",
      outcome: [
        "18-22% reduction in shipping time",
        "Single point of contact established",
        "EUR.1 certification handled",
        "Saved £420 per 300kg shipment"
      ],
      tags: ["Accra Textiles Ltd", "Consolidation", "UK Route Optimization"]
    },
    {
      title: "Dangerous Goods Compliance",
      sector: "Hazardous Materials",
      description: "Managing the global supply chain for Lithium-ion components and industrial chemicals. Adhering to strict IATA & IMO protocols correctly the first time.",
      image: "/src/assets/images/shipping_yard_bg_1778982623151.png",
      outcome: [
        "100% customs clearance rate in 2025",
        "48hr turnaround on chemical imports",
        "Certified MSDS preparation",
        "IMO Class 1-9 specialty handling"
      ],
      tags: ["PharmaWest Ghana", "DG Specialists", "Risk Management"]
    },
    {
      title: "Port Demurrage Mitigation",
      sector: "Clearing & Forwarding",
      description: "Stalled customs release at KIA or Tema results in massive fees. Our team files entries same-day to ensure released goods before demurrage kicks in.",
      image: "/src/assets/images/port_harbour_cranes_1778988430081.png",
      outcome: [
        "Average clearance: 24-48hrs",
        "Saved GH₵ 15,000+ in one quarter",
        "Proactive inspection coordination",
        "Duty payment optimization"
      ],
      tags: ["Accra Engineering", "Tema Port", "KIA Airport"]
    },
    {
      title: "Diplomatic & AOG Priority",
      sector: "Aviation & Embassies",
      description: "Discreet freight for embassies and time-critical AOG (Aircraft on Ground) parts needing 24/7 response and specialized exemptions.",
      image: "/src/assets/images/warehouse_interior_1778988395381.png",
      outcome: [
        "Zero customs delays on diplomatic cargo",
        "12hr AOG delivery achieved",
        "Diplomatic note verification",
        "Secure chain-of-custody"
      ],
      tags: ["AOG Support", "Embassy Logistics", "Priority Handling"]
    },
    {
      title: "Bonded Warehousing Efficiency",
      sector: "Storage Solutions",
      description: "Flexible pay-as-you-use warehousing at KIA Cargo Village. Private and bonded options to defer duties and optimize seasonal stock cash flow.",
      image: "/src/assets/images/warehouse_interior_1778988395381.png",
      outcome: [
        "30% cost savings for seasonal stock",
        "99.8% inventory accuracy",
        "Clean, secure facility at KIA",
        "Duty deferment enabled"
      ],
      tags: ["KIA Cargo Village", "Bonded Storage", "Pick/Pack Ops"]
    },
    {
      title: "Last-Mile Distribution Fleet",
      sector: "Haulage",
      description: "Container and bulk haulage across Ghana and West Africa with real-time GPS tracking and vetted driver protocols for port-to-door reliability.",
      image: "/src/assets/images/heavy_haulage_truck_1778988412569.png",
      outcome: [
        "97% on-time delivery rate",
        "Real-time GPS tracking for all assets",
        "Accra-Kumasi route optimization",
        "Pre-delivery driver call protocol"
      ],
      tags: ["FMCG Distribution", "GPS Tracking", "Port-to-Door"]
    }
  ];

  return (
    <div className="bg-ocean-950 min-h-screen relative selection:bg-white selection:text-black pt-32 px-6">
      <div className="grain" />
      
      {/* Dynamic Header */}
      <div className="max-w-7xl mx-auto mb-32 space-y-12">
        <Link to="/" className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-accent group">
          <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
          / Exit to HQ
        </Link>
        
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black uppercase tracking-[-0.05em] leading-none text-glow-red">
            Case<br /><span className="opacity-10 italic">Operations</span>
          </h1>
          <p className="font-mono text-xs lg:text-sm uppercase tracking-widest leading-loose opacity-40 max-w-2xl">
            A technical breakdown of our most complex global logistics deployments. We translate logistical friction into operational victory through meticulous protocol execution.
          </p>
        </div>
      </div>

      {/* Case Studies List */}
      <section className="max-w-7xl mx-auto pb-40">
        {cases.map((cs, i) => (
          <CaseStudyCard key={i} {...cs} />
        ))}
      </section>

      {/* Testimonials Carousel */}
      <TestimonialCarousel />

      {/* Footer Minimal */}
      <footer className="py-20 border-t border-white/5 opacity-30 text-center font-mono text-[8px] uppercase tracking-widest">
         [ DATA_END // OCEAN_MASTERS_INT ]
      </footer>
    </div>
  );
}
