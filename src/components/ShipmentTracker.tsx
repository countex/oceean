import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Ship, Truck, Globe, Navigation, Activity, Search, Satellite, Boxes, Clock, ExternalLink, Plus, Minus } from 'lucide-react';

interface Shipment {
  id: string;
  type: 'freight' | 'haulage';
  origin: string;
  destination: string;
  status: string;
  progress: number;
  lat: number;
  lon: number;
  lastUpdated: string;
  eta: string;
}

const mockShipments: Shipment[] = [
  {
    id: 'OM-FR-9921',
    type: 'freight',
    origin: 'London Gateway',
    destination: 'Tema Harbor, Ghana',
    status: 'In Transit: North Atlantic Corridor',
    progress: 42,
    lat: 15.2341,
    lon: -30.1232,
    lastUpdated: '2 mins ago',
    eta: 'Oct 24, 14:00'
  },
  {
    id: 'OM-HL-4412',
    type: 'haulage',
    origin: 'Tema Harbor',
    destination: 'Kumasi Terminal',
    status: 'In Transit: Coastal Highway',
    progress: 68,
    lat: 5.6037,
    lon: -0.1870,
    lastUpdated: 'Just now',
    eta: 'Oct 18, 09:30'
  },
  {
    id: 'OM-FR-7710',
    type: 'freight',
    origin: 'Dubai Jebel Ali',
    destination: 'Tema Harbor, Ghana',
    status: 'Preparing Departure',
    progress: 8,
    lat: 25.0657,
    lon: 55.0393,
    lastUpdated: '15 mins ago',
    eta: 'Oct 30, 06:15'
  },
  {
    id: 'OM-HL-2105',
    type: 'haulage',
    origin: 'Accra Hub',
    destination: 'Tamale Distribution Centre',
    status: 'Cross-Regional Transit',
    progress: 35,
    lat: 7.1234,
    lon: -0.5678,
    lastUpdated: '5 mins ago',
    eta: 'Oct 19, 16:45'
  }
];

interface ShipmentTrackerProps {
  type?: 'freight' | 'haulage';
  initialId?: string;
}

const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ type, initialId }) => {
  const [searchId, setSearchId] = useState('');
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<'map' | 'details'>('map');
  const [showPopup, setShowPopup] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with the first one that matches type or initialId
  useEffect(() => {
    if (initialId) {
      const found = mockShipments.find(s => s.id === initialId);
      if (found) setActiveShipment(found);
    } else if (type) {
      const found = mockShipments.find(s => s.type === type);
      if (found) setActiveShipment(found);
    } else {
      setActiveShipment(mockShipments[0]);
    }
  }, [type, initialId]);

  const handleAssetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mapContainerRef.current) return;
    
    // Toggle popup
    setShowPopup(!showPopup);
    
    // Calculate pixel position for the popup
    const rect = mapContainerRef.current.getBoundingClientRect();
    const progress = activeShipment?.progress || 0;
    const isFreight = activeShipment?.type === 'freight';
    
    // Position logic for SVG content
    const vX = isFreight ? 20 + (progress * 0.6) : 80 - (progress * 0.6);
    const vY = isFreight ? 20 + (progress * 0.6) : 80 - (progress * 0.6);
    
    // Convert viewbox (100x100) to pixel percentage
    setPopupPos({
      x: (vX / 100) * rect.width,
      y: (vY / 100) * rect.height
    });
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setIsSearching(true);
    setShowPopup(false);
    // Simulate API delay
    setTimeout(() => {
      const found = mockShipments.find(s => s.id.toUpperCase().includes(searchId.toUpperCase()));
      if (found) {
        setActiveShipment(found);
      } else {
        // Just show a fallback or the first one if not found for demo purposes
        setActiveShipment(mockShipments[0]);
      }
      setIsSearching(false);
    }, 800);
  };

  // Simulate movement for the active shipment
  useEffect(() => {
    if (!activeShipment) return;

    timerRef.current = setInterval(() => {
      setActiveShipment(prev => {
        if (!prev) return null;
        const nextProgress = prev.progress >= 100 ? 0 : prev.progress + 0.05;
        return {
          ...prev,
          progress: nextProgress,
          lastUpdated: 'Just now'
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeShipment?.id]);

  if (!activeShipment) return null;

  return (
    <div className="w-full space-y-8">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <h4 className="font-mono text-[10px] tracking-[0.5em] text-accent font-bold uppercase">
              Omni-Track Interface // v4.1
            </h4>
          </div>
          <p className="font-mono text-[9px] tracking-widest opacity-40 uppercase">Real-time asset synchronization active</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ENTER ASSET ID (e.g. OM-FR-9921)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-4 pl-12 pr-24 font-mono text-[10px] tracking-widest text-white outline-none focus:border-accent transition-colors rounded-full"
          />
          <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40" />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent/20 border border-accent/40 px-4 py-2 rounded-full text-[8px] font-bold text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10">
            Transmit
          </button>
        </form>
      </div>

      {/* Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 grid-bg">
        {/* Sidebar Status */}
        <div className="lg:col-span-1 bg-ocean-900/40 p-8 border border-white/5 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <Satellite size={12} className="text-white/10 animate-pulse" />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="font-mono text-[8px] tracking-[0.4em] opacity-40 uppercase">Shipment ID</div>
              <div className="flex items-center gap-3">
                <div className="text-xl font-display font-black text-white tracking-widest">{activeShipment.id}</div>
                <div className="px-2 py-0.5 bg-accent/20 border border-accent/40 text-[7px] font-mono text-accent uppercase font-bold tracking-widest">
                  {activeShipment.type}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="font-mono text-[8px] tracking-widest opacity-40 uppercase">Origin</div>
                <div className="font-mono text-[10px] text-white tracking-widest">{activeShipment.origin}</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-[8px] tracking-widest opacity-40 uppercase">Destination</div>
                <div className="font-mono text-[10px] text-white tracking-widest">{activeShipment.destination}</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-[8px] tracking-widest opacity-40 uppercase">Current Status</div>
              <div className="flex items-center gap-2">
                <Activity size={10} className="text-accent" />
                <div className="font-mono text-[10px] text-accent tracking-widest uppercase animate-pulse">{activeShipment.status}</div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-end">
                  <div className="font-mono text-[8px] tracking-widest opacity-40 uppercase">Sync Progress</div>
                  <div className="font-mono text-xl font-bold text-white tracking-tighter">{Math.floor(activeShipment.progress)}%</div>
               </div>
               <div className="h-1 bg-white/5 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeShipment.progress}%` }}
                    className="absolute h-full bg-accent shadow-[0_0_10px_#e11d48]"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <div className="p-4 bg-black/40 border border-white/5 space-y-1">
                  <div className="font-mono text-[7px] tracking-widest opacity-40 uppercase">Est. Arrival</div>
                  <div className="font-mono text-[9px] text-white tracking-widest flex items-center gap-2">
                    <Clock size={10} className="opacity-40" />
                    {activeShipment.eta}
                  </div>
               </div>
               <div className="p-4 bg-black/40 border border-white/5 space-y-1">
                  <div className="font-mono text-[7px] tracking-widest opacity-40 uppercase">Last Signal</div>
                  <div className="font-mono text-[9px] text-white tracking-widest">{activeShipment.lastUpdated}</div>
               </div>
            </div>
          </div>

          <div className="pt-10 flex gap-4">
             <button 
               onClick={() => setView('map')}
               className={`flex-1 py-4 border font-mono text-[8px] uppercase tracking-widest transition-all rounded-full ${view === 'map' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'border-white/10 text-white/40 hover:border-white/20'}`}
             >
               Map View
             </button>
             <button 
               onClick={() => setView('details')}
               className={`flex-1 py-4 border font-mono text-[8px] uppercase tracking-widest transition-all rounded-full ${view === 'details' ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' : 'border-white/10 text-white/40 hover:border-white/20'}`}
             >
               Telemetry
             </button>
          </div>
        </div>

        {/* Visual Map/Telemetry Area */}
        <div ref={mapContainerRef} className="lg:col-span-2 bg-black relative overflow-hidden group min-h-[400px]">
          <AnimatePresence mode="wait">
            {view === 'map' ? (
              <motion.div 
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Radar Grid */}
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                />
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                    backgroundSize: '10px 10px'
                  }}
                />

                {/* Simulated Radar Sweep */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent/5 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent/5 rounded-full pointer-events-none" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-10"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, #e11d48 20deg, transparent 25deg)'
                  }}
                />

                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full p-20 overflow-visible">
                  <motion.g animate={{ scale: zoom }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                    {/* Decorative stylized map elements */}
                    {activeShipment.type === 'freight' ? (
                      <g opacity="0.3">
                         <path d="M 0 -10 Q 50 20 100 -10" stroke="white" strokeWidth="0.05" fill="none" />
                         <path d="M 0 110 Q 50 80 100 110" stroke="white" strokeWidth="0.05" fill="none" />
                         <path d="M -10 0 C 10 50 -10 100 -10 100" stroke="white" strokeWidth="0.05" fill="none" />
                         <path d="M 110 0 C 90 50 110 100 110 100" stroke="white" strokeWidth="0.05" fill="none" />
                      </g>
                    ) : (
                      <g opacity="0.3">
                         <rect x="-10" y="-10" width="120" height="120" stroke="white" strokeWidth="0.05" fill="none" strokeDasharray="1 1" />
                         <path d="M -10 50 L 110 50 M 50 -10 L 50 110" stroke="white" strokeWidth="0.05" fill="none" strokeDasharray="2 2" />
                      </g>
                    )}

                    {/* Path Smoothing - More complex curved routes */}
                    <motion.path
                      d={activeShipment.type === 'freight' 
                        ? "M 20 20 C 40 10, 60 90, 80 80" 
                        : "M 80 80 Q 70 30, 50 50 T 20 20"}
                      fill="none"
                      stroke="white"
                      strokeWidth="0.15"
                      strokeDasharray="0.5 1.5"
                      className="opacity-20"
                    />

                    {/* Shipment Icon */}
                    <motion.g
                      transition={{ type: 'spring', damping: 20 }}
                      whileHover={{ scale: 1.2 }}
                      className="cursor-pointer"
                      onClick={handleAssetClick}
                      animate={{ 
                        x: activeShipment.type === 'freight' 
                          ? 20 + (activeShipment.progress * 0.6)
                          : 80 - (activeShipment.progress * 0.6),
                        y: activeShipment.type === 'freight'
                          ? 20 + (activeShipment.progress * 0.6)
                          : 80 - (activeShipment.progress * 0.6)
                      }}
                    >
                      {/* Visual Marker */}
                      <circle cx="0" cy="0" r="4" className="fill-accent/10 border border-accent/40" />
                      <motion.circle 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        cx="0" cy="0" r="8" className="fill-accent/20" 
                      />
                      
                      {/* Invisible Hit Area for better mobile touch */}
                      <circle cx="0" cy="0" r="15" className="fill-transparent" />

                      <foreignObject x="-6" y="-6" width="12" height="12" className="pointer-events-none">
                        <div className="flex items-center justify-center w-full h-full text-accent drop-shadow-[0_0_5px_rgba(255,45,85,0.8)]">
                          {activeShipment.type === 'freight' ? <Ship size={8} /> : <Truck size={8} />}
                        </div>
                      </foreignObject>
                      
                      {/* Data Tag */}
                      <g transform="translate(10, 0)" className="pointer-events-none">
                        <rect x="0" y="-8" width="25" height="10" className="fill-black/80 stroke-white/20" strokeWidth="0.1" />
                        <text x="2" y="-1" className="fill-white font-mono" style={{ fontSize: '3px' }}>{activeShipment.id}</text>
                        <text x="2" y="-5" className="fill-accent font-mono font-bold" style={{ fontSize: '2px' }}>SPD: 24.5 KN</text>
                      </g>
                    </motion.g>
                    
                    {/* Origin/Dest Pins */}
                    <g transform={activeShipment.type === 'freight' ? "translate(20, 20)" : "translate(80, 80)"}>
                      <circle r="0.5" className="fill-white" />
                      <text y="5" className="fill-white/40 font-mono text-center tracking-tighter" style={{ fontSize: '2px', textAnchor: 'middle' }}>ORIGIN</text>
                    </g>
                    <g transform={activeShipment.type === 'freight' ? "translate(80, 80)" : "translate(20, 20)"}>
                      <circle r="0.5" className="fill-white" />
                      <text y="5" className="fill-white/40 font-mono text-center tracking-tighter" style={{ fontSize: '2px', textAnchor: 'middle' }}>DESTINATION</text>
                    </g>
                  </motion.g>
                </svg>

                {/* Zoom Controls */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                   <button 
                     onClick={() => handleZoom(0.2)}
                     className="w-10 h-10 bg-black/80 border border-white/10 flex items-center justify-center text-white hover:border-accent hover:text-accent transition-all backdrop-blur-md rounded-full shadow-xl"
                     title="Zoom In"
                   >
                     <Plus size={16} />
                   </button>
                   <button 
                     onClick={() => handleZoom(-0.2)}
                     className="w-10 h-10 bg-black/80 border border-white/10 flex items-center justify-center text-white hover:border-accent hover:text-accent transition-all backdrop-blur-md rounded-full shadow-xl"
                     title="Zoom Out"
                   >
                     <Minus size={16} />
                   </button>
                </div>

                {/* HUD Corner Data */}
                <div className="absolute top-8 left-8 space-y-4 pointer-events-none">
                  <div className="space-y-1">
                    <div className="font-mono text-[7px] text-white/30 tracking-widest">BEARING: 154.2° NNE</div>
                    <div className="font-mono text-[7px] text-white/30 tracking-widest">ALT: 0000.0 MSL</div>
                    <div className="font-mono text-[7px] text-white/30 tracking-widest">SATELLITE: GPS_B204</div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 pointer-events-none flex gap-4">
                  <div className="p-2 border border-white/5 bg-black/40 backdrop-blur-md">
                     <div className="font-mono text-[6px] text-white/40 tracking-widest mb-1">DATA_STREAM_X</div>
                     <div className="flex gap-1">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ height: [2, 8, 2] }}
                            transition={{ duration: Math.random() + 0.5, repeat: Infinity }}
                            className="w-0.5 bg-accent/40"
                          />
                        ))}
                     </div>
                  </div>
                  <div className="p-2 border border-white/5 bg-black/40 backdrop-blur-md">
                     <div className="font-mono text-[6px] text-white/40 tracking-widest mb-1">COMM_LINK</div>
                     <div className="font-mono text-[7px] text-accent tracking-widest font-bold uppercase">Ready</div>
                  </div>
                </div>

                {/* Optimized Popup Display - High Visibility & Mobile Focused */}
                <AnimatePresence>
                  {showPopup && (
                    <>
                      {/* Mobile Overlay for dismissal */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPopup(false)}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
                      />
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          // Position logic for desktop vs mobile
                          left: typeof window !== 'undefined' && window.innerWidth < 768 ? '1rem' : `${popupPos.x + 20}px`,
                          top: typeof window !== 'undefined' && window.innerWidth < 768 ? 'auto' : `${popupPos.y - 20}px`,
                          bottom: typeof window !== 'undefined' && window.innerWidth < 768 ? '1rem' : 'auto',
                          width: typeof window !== 'undefined' && window.innerWidth < 768 ? 'calc(100% - 2rem)' : '340px'
                        }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{ position: 'absolute', zIndex: 100 }}
                        className="bg-black/95 border border-accent/40 p-5 md:p-6 backdrop-blur-xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] space-y-6"
                      >
                        <div className="flex justify-between items-start border-b border-white/10 pb-4">
                          <div className="space-y-1">
                            <div className="font-mono text-[9px] text-accent font-bold uppercase tracking-[0.3em]">Asset Intelligence</div>
                            <div className="font-display font-black text-xl text-white tracking-widest uppercase italic">{activeShipment.id}</div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}
                            className="w-10 h-10 flex items-center justify-center border border-white/10 hover:border-accent group transition-colors bg-white/5"
                          >
                            <span className="font-mono text-xs text-white/40 group-hover:text-accent">X</span>
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                          <div className="space-y-1">
                            <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest leading-tight">Origin Node</div>
                            <div className="font-mono text-[10px] md:text-[11px] text-white tracking-widest font-bold">{activeShipment.origin}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest leading-tight">Dest Node</div>
                            <div className="font-mono text-[10px] md:text-[11px] text-white tracking-widest font-bold">{activeShipment.destination}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <div className="space-y-1">
                              <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest">ETA Schedule</div>
                              <div className="font-mono text-xs text-white tracking-widest italic">{activeShipment.eta}</div>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="font-mono text-[8px] opacity-40 uppercase tracking-widest">Signal State</div>
                              <div className="font-mono text-[10px] text-accent tracking-widest font-bold uppercase animate-pulse">{activeShipment.status.split(':')[0]}</div>
                            </div>
                          </div>
                          
                          <div className="h-1 bg-white/5 relative overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${activeShipment.progress}%` }}
                              className="absolute h-full bg-accent shadow-[0_0_15px_rgba(225,29,72,0.6)]" 
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex gap-3 md:gap-4">
                          <button 
                            onClick={() => { setShowPopup(false); setView('details'); }}
                            className="flex-1 py-3 bg-accent border border-accent text-white font-mono text-[9px] uppercase tracking-widest font-bold hover:bg-transparent transition-colors shadow-lg shadow-accent/20 rounded-full"
                          >
                            Full Telemetry
                          </button>
                          <div className="w-12 h-12 flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-full">
                            {activeShipment.type === 'freight' ? <Ship size={16} className="text-white/40" /> : <Truck size={16} className="text-white/40" />}
                          </div>
                        </div>
                        
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                           <Globe size={40} className="text-white" />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                key="telemetry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-0 p-12 overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-10">
                   <div className="flex justify-between items-center border-b border-white/10 pb-6">
                      <h3 className="font-display font-black text-3xl uppercase tracking-tighter text-white italic">Telemetry Report</h3>
                      <div className="font-mono text-[8px] text-white/40 tracking-widest uppercase">Encryption: AES-256 Valid</div>
                   </div>

                   <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div className="space-y-4">
                            <h5 className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">Load Specifications //</h5>
                            <div className="p-6 bg-white/[0.02] border border-white/5 space-y-4 font-mono text-[10px]">
                               <div className="flex justify-between">
                                  <span className="opacity-40 tracking-widest">UNIT TYPE</span>
                                  <span className="text-white tracking-widest">40ft HIGH-CUBE</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="opacity-40 tracking-widest">WEIGHT</span>
                                  <span className="text-white tracking-widest">24,400 KG</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="opacity-40 tracking-widest">CONTENTS</span>
                                  <span className="text-white tracking-widest">INDUSTRIAL PARTS</span>
                               </div>
                               <div className="flex justify-between">
                                  <span className="opacity-40 tracking-widest">HAZMAT</span>
                                  <span className="text-accent tracking-widest">NONE DETECTED</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-4">
                            <h5 className="font-mono text-[9px] text-white/40 font-bold uppercase tracking-widest">Network Validation //</h5>
                            <div className="space-y-2">
                               {[
                                 { node: 'HUB_ACCRA_01', status: 'ACTIVE', latency: '24ms' },
                                 { node: 'RELAY_LHR_04', status: 'ACTIVE', latency: '42ms' },
                                 { node: 'SAT_OM_LINK', status: 'SYNC', latency: '128ms' }
                               ].map((node, i) => (
                                 <div key={i} className="flex justify-between p-3 border border-white/5 font-mono text-[8px]">
                                    <span className="text-white/60 tracking-widest">{node.node}</span>
                                    <div className="flex gap-4">
                                       <span className="text-accent font-bold">{node.status}</span>
                                       <span className="opacity-20">{node.latency}</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="space-y-4">
                            <h5 className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">Environmental Data //</h5>
                            <div className="grid grid-cols-2 gap-4 h-full">
                               <div className="p-6 border border-white/5 aspect-square flex flex-col justify-center items-center text-center">
                                  <div className="text-2xl font-display font-black text-white italic">28.4°C</div>
                                  <div className="font-mono text-[7px] opacity-40 tracking-widest uppercase mt-2">Ambient Temp</div>
                               </div>
                               <div className="p-6 border border-white/5 aspect-square flex flex-col justify-center items-center text-center">
                                  <div className="text-2xl font-display font-black text-white italic">64%</div>
                                  <div className="font-mono text-[7px] opacity-40 tracking-widest uppercase mt-2">Rel Humidity</div>
                               </div>
                            </div>
                         </div>
                         <div className="p-6 bg-accent/5 border border-accent/20">
                            <p className="font-mono text-[8px] leading-loose opacity-60 tracking-widest">
                               <Activity size={10} className="inline mr-2 text-accent" />
                               System check confirmed. Cargo environment remains within specified threshold parameters. GPS lock stable with 12 satellites.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isSearching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-12"
              >
                <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-8" />
                <div className="space-y-2 text-center">
                  <div className="font-display font-black text-2xl uppercase tracking-widest text-accent italic animate-pulse">Scanning Frequency</div>
                  <div className="font-mono text-[9px] tracking-[0.4em] opacity-40">Searching global asset registry...</div>
                </div>
                <div className="absolute bottom-12 w-full max-w-xs px-12 space-y-2">
                   <div className="h-1 bg-white/5">
                      <motion.div 
                        animate={{ x: [-200, 400] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-full bg-accent" 
                      />
                   </div>
                   <div className="flex justify-between font-mono text-[6px] tracking-widest opacity-20">
                      <span>REF_0028</span>
                      <span>SYNC_ACTIVE</span>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white/[0.02] border border-white/5 p-6 md:px-10">
         <div className="flex items-center gap-4">
            <Boxes className="text-accent" size={16} />
            <div>
               <div className="font-mono text-[10px] text-white tracking-widest font-bold">Consolidated Ops System</div>
               <div className="font-mono text-[8px] opacity-40 tracking-[0.2em] uppercase">Unified logistics dashboard enabled</div>
            </div>
         </div>
         <div className="flex gap-6 items-center">
            <span className="font-mono text-[8px] tracking-widest opacity-40 uppercase">External tracking:</span>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 font-mono text-[8px] tracking-widest text-white/60 hover:text-accent transition-colors bg-white/5 px-4 py-2 border border-white/5 rounded-full backdrop-blur-sm">
                  Tema Port Sys <ExternalLink size={10} />
               </button>
               <button className="flex items-center gap-2 font-mono text-[8px] tracking-widest text-white/60 hover:text-accent transition-colors bg-white/5 px-4 py-2 border border-white/5 rounded-full backdrop-blur-sm">
                  IATA Gateway <ExternalLink size={10} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ShipmentTracker;
