import React from 'react';
import { ShieldCheck, Users, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="w-full bg-white/40 backdrop-blur-md border-t border-slate-200/60 py-8 px-4 mt-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2 text-slate-800 font-black text-xl tracking-tight">
            <span className="text-blue-600">Hena</span> Chicken & Fish
          </div>
          <p className="text-xs text-slate-500 font-medium">Freshness quick delivered to your doorstep.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">10k+ Families</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Served with Trust</p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={55} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800">FSSAI Certified</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lic. No: 22824035000123</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            Made with <Heart size={14} className="text-red-400 fill-red-400" /> for Fish Lovers
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">© 2026 Hena Fish Suppliers</p>
        </div>
      </div>
    </footer>
  );
}
