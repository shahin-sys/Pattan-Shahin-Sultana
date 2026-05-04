/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Github, Music, Gamepad2, Settings } from 'lucide-react';

export default function App() {
  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden selection:bg-fuchsia-500/30">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <header className="relative z-20 h-20 border-b border-cyan-500/30 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-10 h-10 bg-gradient-to-tr from-fuchsia-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]"
          >
            <span className="text-2xl font-black italic">S</span>
          </motion.div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-gradient-vibrant">
            Neon Synth Snake
          </h1>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-cyan-400 opacity-70">Status</p>
            <p className="text-xl font-mono text-white leading-none uppercase">Online</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-fuchsia-500 opacity-70">Encryption</p>
            <p className="text-xl font-mono text-white leading-none uppercase">Active</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Sidebar: Music Library */}
        <aside className="w-80 flex flex-col gap-6">
          <MusicPlayer />
        </aside>

        {/* Center: Game Board */}
        <div className="flex-1 flex flex-col">
          <div className="relative flex-1 bg-black rounded-[32px] border-2 border-cyan-500/20 shadow-[0_0_50px_rgba(0,243,255,0.1)] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            <SnakeGame />
          </div>
        </div>

        {/* Right: Stats and Visualizer */}
        <aside className="w-72 flex flex-col gap-6">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-lime-400 mb-6">Internal Processor</h3>
            
            <div className="flex items-end justify-between h-32 gap-1 mb-8 px-2">
              {[...Array(12)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${20 + Math.random() * 40}%`, `${40 + Math.random() * 60}%`, `${20 + Math.random() * 40}%`] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                  className={`flex-1 rounded-t ${i % 3 === 0 ? 'bg-fuchsia-500/60' : 'bg-cyan-500/40'}`}
                />
              ))}
            </div>

            <div className="space-y-6">
              <div>
                 <p className="text-[10px] uppercase text-white/40 mb-2">Neural Load</p>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                    animate={{ width: ["20%", "85%", "40%"] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" 
                   />
                 </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <h4 className="text-[10px] font-mono text-white/40 uppercase mb-3">Controls</h4>
                <div className="grid grid-cols-1 gap-2 text-[10px] font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/60">MOVE</span>
                    <span className="text-cyan-400">ARROWS</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-white/60">PAUSE</span>
                    <span className="text-fuchsia-500">SPACE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-40 bg-gradient-to-br from-lime-500 to-emerald-700 rounded-3xl p-5 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl transition-all" />
            <h4 className="text-black font-black uppercase text-xl leading-tight relative z-10">Play Like<br/>The Machine</h4>
            <button className="mt-4 bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-tighter hover:scale-105 active:scale-95 transition-transform relative z-10">
               Direct Link
            </button>
          </div>
        </aside>
      </main>

      {/* Footer Status Bar */}
      <footer className="h-10 px-8 flex items-center justify-between text-[10px] uppercase tracking-widest text-white/30 border-t border-white/5 bg-black/80">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <motion.span 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-lime-500 rounded-full" 
            />
            Server: Active
          </span>
          <span>Latency: 12ms</span>
        </div>
        <div>© 2026 NEON SYNTH SYSTEMS // V.0.4.2-BETA</div>
      </footer>
    </div>
  );
}

