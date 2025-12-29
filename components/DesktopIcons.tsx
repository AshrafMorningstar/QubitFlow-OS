
import React from 'react';
import { AppId } from '../types';
import { FileText, Trash2, StickyNote, CloudSun, Terminal, Globe, Settings, Calculator, Brain, Code2, Folder, User, Palette } from 'lucide-react';

interface DesktopIconsProps {
    onOpenApp: (appId: AppId, data?: any) => void;
}

const DesktopIcons: React.FC<DesktopIconsProps> = ({ onOpenApp }) => {

    const desktopShortcuts = [
        { id: AppId.HOLO_FILES, name: 'My Files', icon: FileText, color: 'text-blue-400', data: 'root' },
        { id: AppId.HOLO_FILES, name: 'Recycle Bin', icon: Trash2, color: 'text-red-400', data: 'trash' },
        { id: AppId.STICKY_NOTES, name: 'Notes', icon: StickyNote, color: 'text-yellow-400' },
        { id: AppId.WEATHER, name: 'Atmosphere', icon: CloudSun, color: 'text-sky-400' },
        { id: AppId.TERMINAL, name: 'Terminal', icon: Terminal, color: 'text-green-500' },
        { id: AppId.QUANTUM_BROWSER, name: 'Quantum Net', icon: Globe, color: 'text-pink-500' },
    ];

    return (
        <div className="absolute top-12 left-4 z-0 flex flex-col flex-wrap h-[calc(100vh-100px)] gap-2 content-start w-fit pointer-events-none">
             {/* Use pointer-events-auto on children to allow clicking but let clicks pass through the container */}
            {desktopShortcuts.map((item, index) => (
                <div 
                    key={index}
                    onClick={() => onOpenApp(item.id, item.data)} 
                    className="group flex flex-col items-center gap-1 cursor-pointer w-24 p-2 rounded hover:bg-white/10 transition active:scale-95 select-none pointer-events-auto"
                >
                    <div className={`w-14 h-14 bg-white/5 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition shadow-lg ${item.color.replace('text-', 'shadow-')}/20`}>
                        <item.icon className={`${item.color} w-8 h-8 drop-shadow-md`} strokeWidth={1.5} />
                    </div>
                    <span className="text-xs text-white/90 drop-shadow-md text-center bg-black/20 px-2 py-0.5 rounded-full font-medium tracking-wide truncate w-full group-hover:bg-black/40 transition">
                        {item.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default DesktopIcons;
