/*
 Copyright (c) 2026 Ashraf Morningstar
 These are personal recreations of existing projects, developed by Ashraf Morningstar
 for learning and skill development.
 Original project concepts remain the intellectual property of their respective creators.
 Repository: https://github.com/AshrafMorningstar
*/

/**
 * @file WindowFrame.tsx
 * @author Ashraf Morningstar <https://github.com/AshrafMorningstar>
 * @copyright 2025 Ashraf Morningstar
 * @license MIT
 *
 * 🌌 QubitFlow OS - The Quantum Computing Interface
 * "The future is unwritten, but the code is compiled."
 */

import React, { useState, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { WindowState } from '../types';

interface WindowFrameProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  theme: 'dark' | 'light';
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ 
  window: win, onClose, onMinimize, onFocus, onMove, onResize, theme, children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (win.isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y
    });
    onFocus(win.id);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
      setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: win.width,
          height: win.height
      });
      onFocus(win.id);
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(win.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
      if (isResizing) {
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          onResize(win.id, Math.max(400, resizeStart.width + deltaX), Math.max(300, resizeStart.height + deltaY));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win.id, onMove, onResize]);

  if (win.isMinimized) return null;

  return (
    <div 
      className={`absolute flex flex-col rounded-xl overflow-hidden backdrop-blur-2xl transition-all duration-200 animate-in zoom-in-95
        ${theme === 'dark' 
            ? 'bg-chronos-dark/60 border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8),_0_0_0_1px_rgba(255,255,255,0.05)]' 
            : 'bg-white/80 border border-gray-200 shadow-2xl'}
      `}
      style={{
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 0 : win.y,
        width: win.isMaximized ? '100vw' : win.width,
        height: win.isMaximized ? '100vh' : win.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={() => onFocus(win.id)}
    >
      {/* Intelligent Glowing Border */}
       <div className={`absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-300 ${isDragging ? 'opacity-100' : 'opacity-0'} shadow-[inset_0_0_20px_rgba(0,240,255,0.2)] border-2 border-neuro-cyan/30 z-[60]`}></div>

      {/* Window Header */}
      <div 
        className={`h-10 flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing relative z-50
            ${theme === 'dark' 
                ? 'bg-gradient-to-r from-white/5 to-transparent border-b border-white/10' 
                : 'bg-gradient-to-r from-gray-100 to-transparent border-b border-gray-200'}
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => { /* Toggle Maximize logic could go here */ }}
      >
        {/* Title / Identity */}
        <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-neuro-cyan animate-pulse"></div>
             <div className={`text-xs font-bold font-space-grotesk tracking-widest uppercase ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`}>
                {win.title}
            </div>
        </div>
        
        {/* Quantum Controls */}
        <div className="flex items-center gap-1">
            <button 
                onClick={(e) => { e.stopPropagation(); onMinimize(win.id); }} 
                className="w-8 h-6 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white rounded transition"
            >
                <Minus size={12} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); /* onMaximize */ }} 
                className="w-8 h-6 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white rounded transition"
            >
                {win.isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onClose(win.id); }} 
                className="w-8 h-6 flex items-center justify-center hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded transition"
            >
                <X size={14} />
            </button>
        </div>
      </div>

      {/* Window Content */}
      <div className={`flex-1 overflow-hidden relative ${theme === 'dark' ? 'bg-black/40' : 'bg-white/50'}`}>
        {children}
        
        {/* Subtle Grid Overlay for Content */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div 
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-[60] flex items-end justify-end p-1 group"
            onMouseDown={handleResizeStart}
        >
             <div className="w-2 h-2 border-r-2 border-b-2 border-gray-500 group-hover:border-neuro-cyan transition-colors"></div>
        </div>
      )}
    </div>
  );
};

export default WindowFrame;