import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Save, Info, Users, BookOpen, Layout, Activity, CheckSquare, FileText } from 'lucide-react';
import { RPPData, RubrikIndikator } from '../types';
import { FASE_OPTIONS, JENJANG_OPTIONS, MAPEL_SUGGESTIONS, DPL_OPTIONS } from '../constants';
import { generateRPPContent } from '../services/geminiService';

interface RPPFormProps {
  initialData: RPPData;
  onPreview: (data: RPPData) => void;
  onSave: (data: RPPData) => void;
}

export default function RPPForm({ initialData, onPreview, onSave }: RPPFormProps) {
  const [formData, setFormData] = useState<RPPData>(initialData);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDplChange = (id: string, checked: boolean) => {
    setFormData(prev => {
      const newDpl = checked 
        ? [...prev.dpl, id]
        : prev.dpl.filter(d => d !== id);
      return { ...prev, dpl: newDpl };
    });
  };

  const handleRubrikChange = (index: number, field: keyof RubrikIndikator, value: string) => {
    setFormData(prev => {
      const newRubrik = [...prev.rubrik];
      newRubrik[index] = { ...newRubrik[index], [field]: value };
      return { ...prev, rubrik: newRubrik };
    });
  };

  const handleAiFill = async () => {
    if (!formData.fase || !formData.kelas || !formData.cp || !formData.topik) {
      alert("Isi Fase, Kelas/Semester, CP, dan Topik Pembelajaran sebelum menggunakan AI!");
      return;
    }

    setIsAiLoading(true);
    try {
      const aiData = await generateRPPContent(formData);
      setFormData(prev => ({ 
        ...prev, 
        ...aiData,
        // Ensure dpl is an array and if AI returned it, merge it
        dpl: aiData.dpl && Array.isArray(aiData.dpl) ? aiData.dpl : prev.dpl,
        // Preserve CP and Topic if they weren't in response
        cp: prev.cp,
        topik: prev.topik,
        rubrik: aiData.rubrik || prev.rubrik
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Gagal menghubungi AI. Pastikan koneksi internet stabil.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreview(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      {/* Top Header Section */}
      <div className="glass p-8 rounded-[2.5rem] shadow-elegant flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
             <Layout className="w-6 h-6" />
           </div>
           <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Panel Kontrol Arsitek</h2>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Kelola dan simulasikan draf RPP Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="group flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-slate-200 transition-all active:scale-95 shadow-sm"
          >
            <Save className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Simpan Dokumentasi</span>
          </button>
          <button
            type="button"
            onClick={handleAiFill}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {isAiLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            Simulasikan AI
          </button>
        </div>
      </div>

      {/* 1. Informasi Umum */}
      <section id="section-1" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant border-t-[6px] border-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
          <Info className="w-64 h-64 text-indigo-600" />
        </div>
        
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">1</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Informasi Dasar</h2>
            <p className="text-xs font-bold text-indigo-600/60 uppercase tracking-widest mt-1">Identitas Mata Pelajaran & Satuan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Penyusun</label>
            <input 
              id="nama" required value={formData.nama} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold"
              placeholder="Contoh: kumisguru, M.Pd."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Jenjang</label>
            <select 
              id="jenjang" required value={formData.jenjang} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold appearance-none"
            >
              <option value="">Pilih Jenjang</option>
              {JENJANG_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Institusi / Satuan</label>
            <input 
              id="satuan" required value={formData.satuan} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold"
              placeholder="Contoh: SD Negeri 2 Tanalum"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Bidang Studi</label>
            <select 
              id="mapel" required value={formData.mapel} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-bold cursor-pointer"
            >
              <option value="" disabled>Pilih Mata Pelajaran...</option>
              {MAPEL_SUGGESTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Fase Perkembangan</label>
            <select 
              id="fase" required value={formData.fase} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold appearance-none"
            >
              <option value="">Pilih Fase</option>
              {FASE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kelas & Semester</label>
            <input 
              id="kelas" required value={formData.kelas} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold"
              placeholder="Contoh: IV / Ganjil"
            />
          </div>

          <div className="col-span-full space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Durasi (Alokasi Waktu)</label>
            <input 
              id="waktu" required value={formData.waktu} onChange={handleChange}
              className="w-full bg-slate-50/50 border-2 border-slate-100 rounded-2xl p-4 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-semibold"
              placeholder="Contoh: 2 JP (2 x 35 Menit)"
            />
          </div>

          <div className="col-span-full space-y-3 bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100 shadow-inner">
            <label className="text-sm font-black text-indigo-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Capaian Pembelajaran (CP)
            </label>
            <textarea 
              id="cp" required value={formData.cp} onChange={handleChange} rows={5}
              className="w-full bg-white border border-indigo-100 rounded-2xl p-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm leading-relaxed"
              placeholder="Salin Capaian Pembelajaran resmi dari Panduan Kurikulum Merdeka..."
            />
          </div>

          <div className="col-span-full space-y-3 bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100 shadow-inner">
            <label className="text-sm font-black text-indigo-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Pokok Bahasan / Topik Spesifik
            </label>
            <textarea 
              id="topik" required value={formData.topik} onChange={handleChange} rows={2}
              className="w-full bg-white border border-indigo-100 rounded-2xl p-6 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-bold placeholder:font-normal"
              placeholder="Topik spesifik yang akan dipelajari (contoh: Perkembangbiakan Hewan Vivipar)..."
            />
          </div>
        </div>

        {/* AI Activation Box */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="mt-12 p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-[2rem] shadow-2xl relative group overflow-hidden"
        >
          <div className="bg-slate-900 rounded-[1.95rem] p-8 md:p-10 text-white relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                Auto-Architect Mode
              </div>
              <h3 className="text-2xl font-black flex items-center justify-center md:justify-start gap-3">
                Rancang RPP dalam Detik
              </h3>
              <p className="text-slate-400 text-sm mt-2 max-w-md font-medium leading-relaxed">
                Teknologi AI kami akan menganalisis CP dan Topik Anda untuk menyusun strategi <span className="text-indigo-400">Deep Learning</span> yang komprehensif.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiFill}
              disabled={isAiLoading}
              className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-5 rounded-2xl font-black shadow-2xl transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-4 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 pointer-events-none opacity-5" />
              {isAiLoading ? (
                <>
                  <div className="w-5 h-5 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Generate Strategi
                </>
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Identifikasi */}
      <section id="section-2" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center font-black text-lg">2</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Karakteristik & Materi</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Identifikasi Konteks Pembelajaran</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              Analisis Peserta Didik
            </label>
            <textarea 
              id="pesertaDidik" value={formData.pesertaDidik} onChange={handleChange} rows={3}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all leading-relaxed"
              placeholder="Contoh: Peserta didik memiliki kecenderungan gaya belajar kinestetik..."
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              Materi Ajar Spesifik
            </label>
            <textarea 
              id="materi" value={formData.materi} onChange={handleChange} rows={3}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all leading-relaxed"
              placeholder="Point-point inti materi yang akan disampaikan..."
            />
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dimensi Profil Lulusan (Goal)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {DPL_OPTIONS.map(opt => (
                  <label key={opt.id} className={`flex flex-col gap-2 p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.dpl.includes(opt.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={formData.dpl.includes(opt.id)} 
                      onChange={(e) => handleDplChange(opt.id, e.target.checked)} 
                    />
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.dpl.includes(opt.id) ? 'bg-white/20' : 'bg-slate-100'}`}>
                        <CheckSquare className={`w-4 h-4 ${formData.dpl.includes(opt.id) ? 'text-white' : 'text-slate-300'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">DPL</span>
                    </div>
                    <span className="text-xs font-black leading-tight mt-1">{opt.label}</span>
                  </label>
                ))}
              </div>
          </div>
        </div>
      </section>

      {/* 3. Desain Pembelajaran */}
      <section id="section-3" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center font-black text-lg">3</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Rancangan Strategis</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pilar Desain Instruksional</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-full space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lintas Disiplin Ilmu (Integrasi)</label>
            <textarea id="lintasDisiplin" value={formData.lintasDisiplin} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm"/>
          </div>
          <div className="col-span-full space-y-3 bg-indigo-50/20 p-6 rounded-3xl border border-indigo-100/50">
            <label className="text-xs font-black text-indigo-900 uppercase tracking-widest ml-1">Tujuan Pembelajaran Khusus</label>
            <textarea id="tujuan" value={formData.tujuan} onChange={handleChange} rows={2} className="w-full bg-white border-2 border-indigo-100 rounded-2xl p-5 text-sm font-bold text-slate-800 outline-none focus:border-indigo-600 transition-all"/>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Praktik Pedagogis (Metode)</label>
            <textarea id="pedagogis" value={formData.pedagogis} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm"/>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lingkungan Pembelajaran</label>
            <textarea id="lingkungan" value={formData.lingkungan} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm"/>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kemitraan Pembelajaran</label>
            <textarea id="kemitraan" value={formData.kemitraan} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm" placeholder="Contoh: Kolaborasi dengan orang tua..."/>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pemanfaatan Digital (IT)</label>
            <textarea id="digital" value={formData.digital} onChange={handleChange} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-sm"/>
          </div>
        </div>
      </section>

      {/* 4. Pengalaman Belajar */}
      <section id="section-4" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant relative">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-600/20">4</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Skenario Pembelajaran</h2>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">Implementasi Deep Learning</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="relative pl-10 border-l-4 border-slate-100">
            <div className="absolute top-0 -left-4 w-8 h-8 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">A</div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Kegiatan Awal (Introduction)</label>
            <textarea id="awal" value={formData.awal} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-sm focus:bg-white transition-all"/>
          </div>

          <div className="relative pl-10 border-l-4 border-indigo-100 bg-indigo-50/10 rounded-tr-[2rem] rounded-br-[2rem] py-8 pr-8">
            <div className="absolute top-8 -left-4 w-8 h-8 bg-indigo-600 border-4 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg">B</div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              Kegiatan Inti (Core Activities)
            </div>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-xs text-indigo-600 border border-indigo-50">1</div>
                  MEMAHAMI (Berkesadaran, Bermakna, Menggembirakan)
                </label>
                <textarea id="intiMemahami" value={formData.intiMemahami} onChange={handleChange} rows={4} className="w-full bg-white border-2 border-indigo-100 rounded-3xl p-8 text-sm shadow-sm focus:border-indigo-600 outline-none transition-all"/>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-xs text-indigo-600 border border-indigo-50">2</div>
                  MENGAPLIKASI (Berkesadaran, Bermakna, Menggembirakan)
                </label>
                <textarea id="intiMengaplikasi" value={formData.intiMengaplikasi} onChange={handleChange} rows={4} className="w-full bg-white border-2 border-indigo-100 rounded-3xl p-8 text-sm shadow-sm focus:border-indigo-600 outline-none transition-all"/>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-xs text-indigo-600 border border-indigo-50">3</div>
                  MEREFLEKSI (Berkesadaran, Bermakna, Menggembirakan)
                </label>
                <textarea id="intiMerefleksi" value={formData.intiMerefleksi} onChange={handleChange} rows={4} className="w-full bg-white border-2 border-indigo-100 rounded-3xl p-8 text-sm shadow-sm focus:border-indigo-600 outline-none transition-all"/>
              </div>
            </div>
          </div>

          <div className="relative pl-10 border-l-4 border-slate-100">
            <div className="absolute top-0 -left-4 w-8 h-8 bg-white border-4 border-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">C</div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Kegiatan Penutup (Closing)</label>
            <textarea id="penutup" value={formData.penutup} onChange={handleChange} rows={3} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-sm focus:bg-white transition-all"/>
          </div>
        </div>
      </section>

      {/* 5. Asesmen */}
      <section id="section-5" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant border-b-8 border-slate-900">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">5</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Evaluasi & Asesmen</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ukur Keberhasilan Siswa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4 group">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Asesmen Awal</label>
              <div className="w-2 h-2 bg-slate-200 rounded-full group-focus-within:bg-indigo-600 transition-colors" />
            </div>
            <textarea id="asesmenAwal" value={formData.asesmenAwal} onChange={handleChange} rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all shadow-inner"/>
          </div>
          <div className="space-y-4 group">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Asesmen Proses</label>
              <div className="w-2 h-2 bg-slate-200 rounded-full group-focus-within:bg-indigo-600 transition-colors" />
            </div>
            <textarea id="asesmenProses" value={formData.asesmenProses} onChange={handleChange} rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all shadow-inner"/>
          </div>
          <div className="space-y-4 group">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Asesmen Akhir</label>
              <div className="w-2 h-2 bg-slate-200 rounded-full group-focus-within:bg-indigo-600 transition-colors" />
            </div>
            <textarea id="asesmenAkhir" value={formData.asesmenAkhir} onChange={handleChange} rows={5} className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm focus:bg-white focus:border-slate-300 outline-none transition-all shadow-inner"/>
          </div>
        </div>
      </section>

      {/* 6. Rubrik Penilaian */}
      <section id="section-6" className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elegant overflow-hidden">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-black text-lg">6</div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Rubrik Indikator</h2>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Kriteria Ketercapaian</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Judul Rubrik Utama</label>
            <input 
              id="judulRubrik" value={formData.judulRubrik} onChange={handleChange} 
              className="w-full border-b-4 border-slate-50 p-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all bg-slate-50/30 rounded-t-2xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tujuan Spesifik Rubrik</label>
            <input 
              id="tujuanRubrik" value={formData.tujuanRubrik} onChange={handleChange}
              className="w-full border-b-4 border-slate-50 p-4 text-sm font-bold focus:border-emerald-500 outline-none transition-all bg-slate-50/30 rounded-t-2xl"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-8 md:mx-0 border-t border-slate-100">
          <table className="w-full border-collapse min-w-[1000px] text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-6 text-left w-[20%] font-black uppercase tracking-widest text-[10px]">Indikator</th>
                <th className="p-6 text-center w-[20%] font-black uppercase tracking-widest text-[10px] bg-rose-500/10 text-rose-500">Baru Memulai</th>
                <th className="p-6 text-center w-[20%] font-black uppercase tracking-widest text-[10px] bg-amber-500/10 text-amber-500">Berkembang</th>
                <th className="p-6 text-center w-[20%] font-black uppercase tracking-widest text-[10px] bg-emerald-500/10 text-emerald-500">Cakap</th>
                <th className="p-6 text-center w-[20%] font-black uppercase tracking-widest text-[10px] bg-indigo-500/10 text-indigo-500">Mahir</th>
              </tr>
            </thead>
            <tbody>
              {formData.rubrik.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 group">
                  <td className="p-0 align-top">
                    <textarea 
                      value={row.indikator} 
                      onChange={(e) => handleRubrikChange(idx, 'indikator', e.target.value)}
                      className="w-full p-6 min-h-[120px] outline-none border-0 focus:bg-slate-50 transition-colors text-xs font-black text-slate-800 leading-relaxed"
                      placeholder="Indikator..."
                    />
                  </td>
                  <td className="p-0 align-top border-l border-slate-100">
                    <textarea 
                      value={row.baruMemulai} 
                      onChange={(e) => handleRubrikChange(idx, 'baruMemulai', e.target.value)}
                      className="w-full p-6 min-h-[120px] outline-none border-0 focus:bg-rose-50 transition-colors text-[11px] leading-relaxed"
                    />
                  </td>
                  <td className="p-0 align-top border-l border-slate-100">
                    <textarea 
                      value={row.berkembang} 
                      onChange={(e) => handleRubrikChange(idx, 'berkembang', e.target.value)}
                      className="w-full p-6 min-h-[120px] outline-none border-0 focus:bg-amber-50 transition-colors text-[11px] leading-relaxed"
                    />
                  </td>
                  <td className="p-0 align-top border-l border-slate-100">
                    <textarea 
                      value={row.cakap} 
                      onChange={(e) => handleRubrikChange(idx, 'cakap', e.target.value)}
                      className="w-full p-6 min-h-[120px] outline-none border-0 focus:bg-emerald-50 transition-colors text-[11px] leading-relaxed"
                    />
                  </td>
                  <td className="p-0 align-top border-l border-slate-100">
                    <textarea 
                      value={row.mahir} 
                      onChange={(e) => handleRubrikChange(idx, 'mahir', e.target.value)}
                      className="w-full p-6 min-h-[120px] outline-none border-0 focus:bg-indigo-50 transition-colors text-[11px] leading-relaxed"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Main Submit Action */}
      <div className="flex flex-col sm:flex-row gap-6 pt-10 pb-20">
        <button
          type="submit"
          className="flex-1 group relative bg-indigo-600 overflow-hidden text-white font-black py-7 px-10 rounded-[2rem] shadow-indigo-soft active:scale-[0.98] transition-all flex justify-center items-center gap-4 text-xl"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none opacity-10" />
          <Layout className="w-8 h-8" />
          Konstruksi & Tampilkan RPP
        </button>
      </div>
    </form>
  );
}
