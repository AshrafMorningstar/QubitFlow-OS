/**
 * @file NebulaDock.tsx
 * @author Ashraf Morningstar <https://github.com/AshrafMorningstar>
 * @copyright 2025 Ashraf Morningstar
 * @license MIT
 *
 * 🌌 QubitFlow OS - The Quantum Computing Interface
 * "The future is unwritten, but the code is compiled."
 */

import React from 'react';
import { AppId, AppConfig } from '../types';
import { User, Folder, Brain, PenTool, Gamepad2, Settings, Terminal, Files, Code2, Radio, Globe, Palette, Calculator, Camera, StickyNote, CloudSun } from 'lucide-react';

interface NebulaDockProps {
  openApps: AppId[];
  onOpenApp: (id: AppId) => void;
}

export const apps: AppConfig[] = [
  { id: AppId.PROFILE, name: 'Cosmic Profile', icon: User, color: 'text-neuro-purple', defaultSize: { width: 900, height: 700 } },
  { id: AppId.PROJECTS, name: 'Project Nebula', icon: Folder, color: 'text-quantum-energy', defaultSize: { width: 1000, height: 700 } },
  { id: AppId.QUANTUM_BROWSER, name: 'Quantum Net', icon: Globe, color: 'text-pink-500', defaultSize: { width: 1000, height: 750 } },
  { id: AppId.HOLO_FILES, name: 'HoloFiles', icon: Files, color: 'text-yellow-500', defaultSize: { width: 800, height: 600 } },
  { id: AppId.CODE_NEXUS, name: 'Code Nexus', icon: Code2, color: 'text-blue-400', defaultSize: { width: 900, height: 700 } },
  { id: AppId.NEURO_AI, name: 'Neuro AI', icon: Brain, color: 'text-neuro-cyan', defaultSize: { width: 500, height: 700 } },
  { id: AppId.COSMIC_CANVAS, name: 'Cosmic Canvas', icon: Palette, color: 'text-orange-500', defaultSize: { width: 800, height: 600 } },
  // { id: AppId.NEURAL_CAM, name: 'Neural Cam', icon: Camera, color: 'text-red-400', defaultSize: { width: 640, height: 520 } },
  { id: AppId.WEATHER, name: 'Atmosphere', icon: CloudSun, color: 'text-sky-400', defaultSize: { width: 400, height: 600 } },
  // { id: AppId.MATTER_SHAPER, name: 'Matter Shaper', icon: PenTool, color: 'text-quantum-matter', defaultSize: { width: 1000, height: 700 } },
  { id: AppId.QUANTUM_RADIO, name: 'Quantum Radio', icon: Radio, color: 'text-red-500', defaultSize: { width: 400, height: 500 } },
  { id: AppId.CALCULATOR, name: 'Calculator', icon: Calculator, color: 'text-green-400', defaultSize: { width: 320, height: 450 } },
  { id: AppId.TERMINAL, name: 'Chronos Terminal', icon: Terminal, color: 'text-green-500', defaultSize: { width: 700, height: 500 } },
  { id: AppId.STICKY_NOTES, name: 'Notes', icon: StickyNote, color: 'text-yellow-300', defaultSize: { width: 300, height: 300 } },
  { id: AppId.SETTINGS, name: 'System Core', icon: Settings, color: 'text-gray-400', defaultSize: { width: 800, height: 600 } },
];

const NebulaDock: React.FC<NebulaDockProps> = ({ openApps, onOpenApp }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const resetTimer = () => {
      setIsVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
      }, 3000); // 3 seconds auto-hide
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        // If mouse is at the bottom 10% of screen, show dock
        if (e.clientY > window.innerHeight - 100) {
            resetTimer();
        } 
    };

    window.addEventListener('mousemove', handleMouseMove);
    resetTimer(); // Start timer on mount

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
        className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] flex justify-center perspective-1000 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-[200%]'}`}
        onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsVisible(true);
        }}
        onMouseLeave={resetTimer}
    >
      <div 
        className="
            flex items-end gap-2 px-6 py-4 rounded-3xl 
            bg-black/40 backdrop-blur-2xl border border-white/10 
            shadow-[0_10px_30px_rgba(0,0,0,0.5),_inset_0_0_20px_rgba(255,255,255,0.05)]
            transition-all duration-300
            hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(255,255,255,0.1)]
            hover:scale-[1.02]
        "
      >
        {apps.map((app) => (
          <div key={app.id} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 bg-black/80 text-neuro-cyan px-3 py-1.5 rounded-lg text-xs font-mono border border-neuro-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.3)] pointer-events-none whitespace-nowrap z-50">
              {app.name}
              <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-black/80 border-r border-b border-neuro-cyan/30 transform rotate-45"></div>
            </div>

            {/* Icon Button */}
            <button
              onClick={() => onOpenApp(app.id)}
              className={`
                relative p-3 rounded-2xl transition-all duration-300 ease-out
                flex items-center justify-center
                group-hover:-translate-y-4 group-hover:scale-125 group-hover:mx-2
                ${openApps.includes(app.id) 
                  ? 'bg-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.1)]' 
                  : 'hover:bg-white/5'}
              `}
            >
              <app.icon className={`w-6 h-6 ${app.color} transition-all duration-300 group-hover:drop-shadow-[0_0_8px_currentColor]`} />
              
              {/* Reflection/Shine */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"></div>

              {/* Active Indicator */}
              {openApps.includes(app.id) && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-neuro-cyan shadow-[0_0_10px_#00F5FF]"></div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NebulaDock;