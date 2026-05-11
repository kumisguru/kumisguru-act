import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import RPPForm from './components/RPPForm';
import RPPPreview from './components/RPPPreview';
import { RPPData } from './types';
import { DEFAULT_RPP, getHistory, saveRPP } from './services/dbService';

export default function App() {
  const [history, setHistory] = useState<RPPData[]>([]);
  const [currentRPP, setCurrentRPP] = useState<RPPData>(DEFAULT_RPP);
  const [showPreview, setShowPreview] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [activeSection, setActiveSection] = useState('section-1');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadHistory();
    
    // Intersection Observer for active section tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: document.getElementById('main-scroll'), threshold: 0.5 }
    );

    const sections = ['section-1', 'section-2', 'section-3', 'section-4', 'section-5', 'section-6'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    const data = await getHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectRPP = (rpp: RPPData) => {
    setCurrentRPP(rpp);
    setShowPreview(true);
    setIsSidebarOpen(false);
    showToast(`Memuat: ${rpp.mapel}`);
  };

  const handleNewRPP = () => {
    setCurrentRPP(DEFAULT_RPP);
    setShowPreview(false);
    setIsSidebarOpen(false);
    showToast("Memulai RPP Baru");
  };

  const handlePreview = (data: RPPData) => {
    setCurrentRPP(data);
    setShowPreview(true);
    showToast("Preview Siap!");
  };

  const handleSave = async (data: RPPData) => {
    try {
      await saveRPP(data);
      await loadHistory();
      showToast("Tersimpan Berhasil!");
    } catch (error) {
      showToast("Gagal menyimpan.", "error");
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsSidebarOpen(false); // Close mobile sidebar if open
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Sidebar - Desktop */}
      <Sidebar 
        history={history} 
        onSelect={handleSelectRPP} 
        onNew={handleNewRPP} 
        isLoading={isLoading} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeSection={activeSection}
        onScrollToSection={scrollToSection}
        className="hidden md:flex"
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-30">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <div>
              <h1 className="font-bold tracking-tight leading-none text-sm">GEN RPP</h1>
              <p className="text-[8px] uppercase tracking-widest font-black text-slate-500">by kumisguru</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden"
              >
                <Sidebar 
                  history={history} 
                  onSelect={handleSelectRPP} 
                  onNew={handleNewRPP} 
                  isLoading={isLoading} 
                  onScrollToSection={scrollToSection}
                  activeSection={activeSection}
                  className="w-full h-full"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Content Scroll Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar scroll-smooth" id="main-scroll">
          <div className="max-w-5xl mx-auto">
            {/* Page Title for Desktop */}
            <div className="hidden md:block mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-elegant border border-slate-200">
                  <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                    Aplikasi Pembuat RPP
                  </h2>
                  <p className="text-slate-500 font-medium tracking-wide">Penyusunan RPP Mendalam sesuai panduan resmi</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RPPForm 
                initialData={currentRPP} 
                onPreview={handlePreview} 
                onSave={handleSave} 
              />
            </motion.div>

            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <RPPPreview data={currentRPP} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`fixed bottom-10 right-10 z-[100] px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 glass-dark border ${
                toast.type === 'success' 
                  ? 'border-emerald-500/30' 
                  : 'border-rose-500/30'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-white text-sm uppercase tracking-widest">{toast.type === 'success' ? 'Berhasil' : 'Error'}</p>
                <p className="text-slate-400 text-xs mt-0.5">{toast.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

