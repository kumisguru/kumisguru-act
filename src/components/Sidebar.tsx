import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Plus, 
  FileText, 
  ChevronRight, 
  Database, 
  ChevronLeft, 
  PanelLeftClose, 
  PanelLeftOpen,
  Info,
  Compass,
  Target,
  PenTool,
  ClipboardCheck,
  Map,
  Sparkles
} from 'lucide-react';
import { RPPData } from '../types';

interface SidebarProps {
  history: RPPData[];
  onSelect: (rpp: RPPData) => void;
  onNew: () => void;
  isLoading: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeSection?: string;
  onScrollToSection?: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'section-1', label: 'Informasi Dasar', icon: Info },
  { id: 'section-2', label: 'Karakteristik & DPL', icon: Compass },
  { id: 'section-3', label: 'Desain Strategis', icon: Target },
  { id: 'section-4', label: 'Kegiatan Inti', icon: PenTool },
  { id: 'section-5', label: 'Asesmen', icon: ClipboardCheck },
  { id: 'section-6', label: 'Rubrik Pencapaian', icon: Database },
];

export default function Sidebar({ history, onSelect, onNew, isLoading, isCollapsed, onToggleCollapse, activeSection, onScrollToSection }: SidebarProps) {
  return (
    <motion.aside 
      animate={{ width: isCollapsed ? '80px' : '300px' }}
      transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      className="bg-slate-900 text-white flex flex-col h-full shadow-2xl z-20 flex-shrink-0 hidden md:flex font-sans relative border-r border-slate-800"
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={onToggleCollapse}
        className="absolute -right-3 top-24 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white rounded-full p-1.5 shadow-xl z-30 transition-all hover:scale-110 active:scale-95 hidden md:block"
      >
        {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      {/* Header / Logo */}
      <div className={`p-8 border-b border-slate-800/50 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
        <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 transform transition-transform hover:rotate-0">
          <FileText className="text-white w-6 h-6" />
        </div>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              GEN <span className="text-indigo-400">RPP</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">by kumisguru</p>
          </motion.div>
        )}
      </div>

      {/* New RPP Button */}
      <div className={`px-4 mb-6 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onNew}
          title={isCollapsed ? "Buat RPP Baru" : ""}
          className={`flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 group ${isCollapsed ? 'w-12 h-12 justify-center' : 'w-full px-4'}`}
        >
          <Plus className="w-4 h-4 flex-shrink-0 group-hover:rotate-90 transition-transform duration-300" />
          {!isCollapsed && <span className="whitespace-nowrap">RPP Baru</span>}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className={`px-4 mb-8 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-4 px-2">
            <Map className="w-3.5 h-3.5 text-slate-600" />
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">
              Navigasi Form
            </h2>
          </div>
        )}
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollToSection?.(item.id)}
              title={isCollapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                activeSection === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400' 
                  : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${activeSection === item.id ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
              {!isCollapsed && <span className="text-[12px] font-bold truncate">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className={`px-4 flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? 'no-scrollbar' : ''}`}>
        <div className={`flex items-center gap-2 mb-6 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <History className="w-3.5 h-3.5 text-slate-600" />
          {!isCollapsed && (
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">
              Riwayat
            </h2>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
            </div>
          ) : history.length === 0 ? (
            !isCollapsed && (
              <div className="py-12 px-6 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-600 font-medium italic">Empty workspace</p>
              </div>
            )
          ) : (
            <div className="space-y-2">
              {history.map((rpp, index) => (
                <motion.button
                  key={rpp.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(rpp)}
                  title={isCollapsed ? `${rpp.mapel} (${rpp.kelas})` : ""}
                  className={`group text-left bg-slate-800/20 hover:bg-slate-800/60 rounded-2xl border border-transparent hover:border-slate-700 transition-all active:scale-[0.98] flex items-center ${isCollapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full p-4'}`}
                >
                  <div className="flex items-center justify-between w-full min-w-0">
                    <div className={`${isCollapsed ? 'hidden' : 'flex-1 min-w-0'}`}>
                      <h3 className="font-bold text-[13px] text-slate-300 truncate group-hover:text-white transition-colors">
                        {rpp.mapel}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {rpp.kelas}
                      </p>
                    </div>
                    {isCollapsed ? (
                      <div className="text-indigo-400 font-black text-xs uppercase tracking-tighter">
                        {rpp.mapel.substring(0, 2)}
                      </div>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 group-hover:block hidden transition-all flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`p-6 bg-slate-900/80 backdrop-blur-md text-[10px] text-slate-600 flex items-center justify-center gap-3 border-t border-slate-800/50 ${isCollapsed ? 'flex-col' : ''}`}>
        <Database className="w-3.5 h-3.5" />
        {!isCollapsed && <span className="font-bold uppercase tracking-widest opacity-60">Cloud Sync Active</span>}
      </div>
    </motion.aside>
  );
}
