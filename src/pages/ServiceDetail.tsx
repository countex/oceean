import { motion } from 'motion/react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Globe, Compass, Box, ShieldAlert, Zap, Truck, ArrowLeft, CheckCircle2, ShieldCheck, Activity, Target } from 'lucide-react';
import { useEffect } from 'react';
import Lenis from 'lenis';

const servicesData: any = {
  'freight-logistics': {
    title: 'Freight Logistics',
    icon: Globe,
    headline: 'Global Multi-Modal Transit Mastery',
    sub: 'Optimized air, sea, and land networks connecting Ghana to the World.',
    description: 'We orchestrate complex global supply chains with surgical precision. Our freight architecture is designed to reduce friction and maximize transit speed through strategic carrier partnerships and proprietary routing data.',
    capabilities: [
      'LCL & FCL Ocean Consolidation',
      'Priority Air Freight via KIA Hub',
      'Cross-Border Land Transport',
      'Intermodal Logistics Planning'
    ],
    metrics: [
      { label: 'Avg. UK Transit', value: '16 Days' },
      { label: 'Time Reduction', value: '22%' },
      { label: 'Nodes Served', value: '150+' }
    ],
    process: [
      'Route Optimization Audit',
      'Carrier Procurement',
      'Real-time GPS Integration',
      'Final Mile Execution'
    ]
  },
  'harbour-clearing': {
    title: 'Harbour Clearing',
    icon: Compass,
    headline: 'Tema & KIA Port Authority Clearing',
    sub: 'Professional customs brokerage and rapid released protocols.',
    description: 'Demurrage and storage fees are the enemies of profit. Our dedicated clearing team operates within the Tema Port and KIA Airport villages to ensure your entries are filed and releasing before the clock starts.',
    capabilities: [
      'Pre-Arrival Entry Filing',
      'Duty Calculation & Optimization',
      'Quarantine & Inspection Liaison',
      'Bonded Warehouse Release'
    ],
    metrics: [
      { label: 'Avg. Release', value: '24-48hrs' },
      { label: 'Compliance Rate', value: '100%' },
      { label: 'Fees Saved', value: 'GH₵ 15k+' }
    ],
    process: [
      'Document Pre-Check',
      'Tax Compliance Audit',
      'Physical Inspection Support',
      'Post-Clearance Audit'
    ]
  },
  'warehousing': {
    title: 'Warehousing',
    icon: Box,
    headline: 'KIA Cargo Village Infrastructure',
    sub: 'Secure, bonded, and inventory-managed storage solutions.',
    description: 'Strategic storage in proximity to major transit hubs. Our facilities at KIA Cargo Village provide the flexibility SMEs need for seasonal stock and bonded duty deferment.',
    capabilities: [
      'Bonded Duty Deferment',
      'WMS Inventory Tracking',
      'Pick, Pack & Dispatch Services',
      'Climate-Controlled Zones'
    ],
    metrics: [
      { label: 'Accuracy Rate', value: '99.8%' },
      { label: 'Ops Availability', value: '24/7' },
      { label: 'Hub Proximity', value: '200m' }
    ],
    process: [
      'Intake & Inspection',
      'RFID Tagging',
      'Strategic Slotting',
      'Automated Dispatch'
    ]
  },
  'dangerous-goods': {
    title: 'Dangerous Goods',
    icon: ShieldAlert,
    headline: 'Certified Hazardous Material Protocol',
    sub: 'IMO & IATA regulated transport for perilous cargo.',
    description: 'Dangerous goods demand absolute authority. We are certified to handle IMO Class 1-9 materials, ensuring that lithium batteries, chemicals, and industrial compounds move safely across borders.',
    capabilities: [
      'DG Classification & Labeling',
      'MSDS Documentation Prep',
      'IATA Category Handling',
      'Emergency Response Ready'
    ],
    metrics: [
      { label: 'Clearance Rate', value: '100%' },
      { label: 'Safety Incidents', value: 'Zero' },
      { label: 'Certification', value: 'Full IMO' }
    ],
    process: [
      'Risk Classification',
      'Specialized Packaging',
      'Permit Granting',
      'Escorted Transport'
    ]
  },
  'specialized-cargo': {
    title: 'Specialized Cargo',
    icon: Zap,
    headline: 'Diplomatic & Aviation Priority Ops',
    sub: 'Sensitive handling for embassies and Aircraft on Ground (AOG) support.',
    description: 'When failure is not an option. We provide discreet handling for diplomatic materials and rapid response for aviation engine parts (AOG), maintaining strict chain-of-custody protocols.',
    capabilities: [
      'Diplomatic Note Handling',
      'AOG 12hr Rapid Response',
      'Embassy Logistics Protocol',
      'Secure Chain-of-Custody'
    ],
    metrics: [
      { label: 'AOG Response', value: '12hrs' },
      { label: 'Security Level', value: 'Verified' },
      { label: 'Customs Delay', value: 'Zero' }
    ],
    process: [
      'Priority Verification',
      'Secure Line-of-Sight',
      'Exemption Processing',
      'Hand-Off Validation'
    ]
  },
  'haulage': {
    title: 'Haulage',
    icon: Truck,
    headline: 'Reliable West African Road Network',
    sub: 'Container and bulk trucking with real-time GPS tracking.',
    description: 'The final link in the supply chain. Our vetted fleet and trained drivers ensure that your cargo moves from Tema Harbor to its final destination with predictable timing and safety.',
    capabilities: [
      'FCL / LCL Road Haulage',
      'Heavy-Lift Industrial Transport',
      'GPS Fleet Tracking',
      'Accra-Kumasi Priority Hubs'
    ],
    metrics: [
      { label: 'On-Time Rate', value: '97%' },
      { label: 'Fleet Age', value: '< 5yrs' },
      { label: 'Region Coverage', value: 'All GH' }
    ],
    process: [
      'Route Analysis',
      'Unit Matching',
      'Sealing & Security',
      'Digital POD Receipt'
    ]
  }
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = servicesData[slug || ''];

  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [slug]);

  if (!service) return <Navigate to="/" />;

  const Icon = service.icon;

  return (
    <div className="bg-ocean-950 min-h-screen relative pt-32 pb-40 px-6 selection:bg-white selection:text-black">
      <div className="grain" />
      
      <div className="max-w-7xl mx-auto">
        <Link to="/#services" className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-accent group mb-20">
          <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
          / Return to Fleet Ops
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.5em] text-accent">
                <Icon size={16} />
                Protocol_{service.title.toUpperCase().replace(' ', '_')}
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black uppercase tracking-[-0.05em] leading-[0.8] text-glow-red">
                {service.title.split(' ')[0]}<br />
                <span className="opacity-10 italic">{service.title.split(' ')[1] || 'Clearing'}</span>
              </h1>
              <p className="text-xl md:text-2xl font-display font-light uppercase tracking-tight text-white leading-tight">
                {service.headline}
              </p>
              <p className="font-mono text-xs md:text-sm uppercase tracking-widest leading-loose opacity-60 max-w-xl">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 py-10 border-y border-white/5 bg-white/[0.02] p-8">
              {service.metrics.map((m: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="text-2xl font-display font-bold text-white">{m.value}</div>
                  <div className="font-mono text-[8px] uppercase tracking-widest opacity-40">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
               <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent font-bold">Operational Capabilities //</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.capabilities.map((cap: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 border border-white/5 bg-ocean-900 group hover:border-accent/40 transition-colors">
                      <ShieldCheck size={14} className="text-accent opacity-40 group-hover:opacity-100" />
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100">{cap}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="space-y-20 lg:sticky lg:top-32">
            <div className="bg-ocean-900 border border-white/10 p-10 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl" />
               <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white">Execution Protocol //</h3>
               <div className="space-y-6">
                  {service.process.map((step: string, i: number) => (
                    <div key={i} className="flex gap-6 items-start relative">
                       <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border border-accent/40 flex items-center justify-center font-mono text-[10px] text-accent font-bold">
                             {i + 1}
                          </div>
                          {i < service.process.length - 1 && <div className="w-[1px] h-12 bg-white/10" />}
                       </div>
                       <div className="pt-1">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-white mb-1">{step}</div>
                          <div className="font-mono text-[8px] uppercase tracking-widest opacity-40">System_Check_Verified</div>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="pt-10">
                  <a href="/#contact" className="w-full flex items-center justify-center py-6 bg-accent text-white font-mono font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-accent/20 hover:bg-white hover:text-black transition-all">
                    Initiate Case Quote
                  </a>
               </div>
            </div>

            <div className="flex items-center gap-6 p-8 border border-white/5 font-mono">
               <Activity className="text-accent animate-pulse" size={24} />
               <div>
                  <div className="text-[10px] uppercase tracking-widest text-white">Security Integrity: High</div>
                  <div className="text-[8px] uppercase tracking-[0.3em] opacity-40 italic">256-bit protocol encryption active</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
