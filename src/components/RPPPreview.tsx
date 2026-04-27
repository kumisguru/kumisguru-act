import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileDown, 
  Copy, 
  FileText, 
  Download, 
  FileCheck, 
  Printer, 
  ChevronRight, 
  Sparkles,
  Zap,
  Activity,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { RPPData } from '../types';
import { DPL_OPTIONS } from '../constants';

interface RPPPreviewProps {
  data: RPPData;
}

export default function RPPPreview({ data }: RPPPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    if (!contentRef.current) return;
    const range = document.createRange();
    range.selectNode(contentRef.current);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    try {
      document.execCommand('copy');
      // Toast replacement could be here, but using alert as fallback
    } catch (e) {
      console.error(e);
    }
    window.getSelection()?.removeAllRanges();
  };

  const handleExportWord = () => {
    if (!contentRef.current) return;
    const html = contentRef.current.innerHTML;
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>RPP Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial; font-size: 11pt; } td, th { border: 1px solid black; padding: 8px; }</style></head><body>";
    const footer = "</body></html>";
    const fullHtml = header + html + footer;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPP_${data.mapel}_${data.kelas}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDplLabels = () => {
    return data.dpl.map(id => DPL_OPTIONS.find(opt => opt.id === id)?.label || id);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-16 space-y-12 pb-24"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dokumen Terkonstruksi</h2>
            <p className="text-sm font-medium text-slate-500">Pratinjau akhir sebelum dibagikan atau dicetak.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-800 px-6 py-4 rounded-2xl font-bold transition-all shadow-elegant active:scale-95 border border-slate-100"
          >
            <Copy className="w-5 h-5 text-indigo-600" />
            <span className="hidden sm:inline">Salin Konten</span>
          </button>
          <button
            onClick={handleExportWord}
            className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-800 px-6 py-4 rounded-2xl font-bold transition-all shadow-elegant active:scale-95 border border-slate-100"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="hidden sm:inline">Word Doc</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl active:scale-95 translate-y-[-2px]"
          >
            <Printer className="w-5 h-5" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-1 md:p-1 shadow-elegant rounded-[3.5rem] border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 p-6 md:p-12 overflow-x-auto custom-scrollbar">
          <div 
            ref={contentRef}
            className="bg-white p-12 md:p-20 shadow-2xl rounded-2xl min-w-[800px] max-w-[950px] mx-auto text-slate-900 print:p-0 print:shadow-none font-serif relative"
            style={{ lineHeight: '1.7' }}
          >
            {/* Watermark/Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            {/* HEADER DOKUMEN */}
            <div className="text-center mb-16 border-b-4 border-slate-900 pb-10 relative">
              <h1 className="text-2xl font-black uppercase tracking-tight mb-2">PERENCANAAN PEMBELAJARAN MENDALAM</h1>
              <h2 className="text-xl font-bold text-slate-600 uppercase tracking-[0.2em] mb-6">(DEEP LEARNING ARCHITECT)</h2>
              <div className="inline-flex items-center gap-3 bg-indigo-50 px-6 py-2 rounded-full">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <p className="text-[10pt] font-black italic text-indigo-600 uppercase tracking-widest">Berorientasi pada Dimensi Profil Lulusan</p>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              </div>
            </div>

            {/* TABEL INFORMASI UMUM */}
            <div className="mb-14">
              <div className="inline-flex items-center gap-2 mb-6 text-indigo-600">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Identitas Pendidik & Satuan</span>
              </div>
              <table className="w-full border-2 border-slate-900 border-collapse">
                <tbody>
                  <tr className="border-b-2 border-slate-900">
                    <td className="w-1/3 p-5 font-black bg-slate-50 border-r-2 border-slate-900 uppercase text-[10pt]">Nama Penyusun</td>
                    <td className="p-5 font-bold uppercase tracking-tight">{data.nama}</td>
                  </tr>
                  <tr className="border-b-2 border-slate-900">
                    <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 uppercase text-[10pt]">Satuan Pendidikan</td>
                    <td className="p-5 font-bold">{data.satuan}</td>
                  </tr>
                  <tr className="border-b-2 border-slate-900">
                    <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 uppercase text-[10pt]">Mata Pelajaran</td>
                    <td className="p-5 font-bold">{data.mapel}</td>
                  </tr>
                  <tr className="border-b-2 border-slate-900">
                    <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 uppercase text-[10pt]">Fase / Kelas / Semester</td>
                    <td className="p-5 font-bold">{data.fase} / {data.kelas}</td>
                  </tr>
                  <tr>
                    <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 uppercase text-[10pt]">Alokasi Waktu</td>
                    <td className="p-5 font-bold">{data.waktu}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TABEL STRUKTUR RPP */}
            <div className="space-y-14">
              {/* SEKSI IDENTIFIKASI */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-slate-900 text-white inline-block px-4 py-1">I. Tahap Identifikasi</h3>
                <table className="w-full border-2 border-slate-900 border-collapse">
                  <tbody>
                    <tr className="border-b-2 border-slate-900">
                      <td className="w-1/3 p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Pesan Utama & Karakteristik</td>
                      <td className="p-5 whitespace-pre-wrap leading-relaxed">{data.pesertaDidik}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Materi Pelajaran</td>
                      <td className="p-5 whitespace-pre-wrap leading-relaxed">{data.materi}</td>
                    </tr>
                    <tr>
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Hattrick DPL</td>
                      <td className="p-5">
                        <div className="flex flex-wrap gap-2">
                          {getDplLabels().map((label, i) => (
                            <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-lg text-xs font-black uppercase">
                              {label}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SEKSI DESAIN PEMBELAJARAN */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-slate-900 text-white inline-block px-4 py-1">II. Desain Pembelajaran</h3>
                <table className="w-full border-2 border-slate-900 border-collapse">
                  <tbody>
                    <tr className="border-b-2 border-slate-900">
                      <td className="w-1/3 p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Capaian Pembelajaran (CP)</td>
                      <td className="p-5 italic leading-relaxed text-slate-600">{data.cp}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Lingkup Disiplin Ilmu</td>
                      <td className="p-5">{data.lintasDisiplin}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900 bg-indigo-50/30">
                      <td className="p-5 font-black border-r-2 border-slate-900 text-indigo-700 text-[10pt]">Tujuan Pembelajaran Khusus</td>
                      <td className="p-5 font-black text-indigo-900 leading-snug">{data.tujuan}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Topik & Fokus Utama</td>
                      <td className="p-5 font-bold">{data.topik}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Strategi Pedagogis</td>
                      <td className="p-5">{data.pedagogis}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Ekosistem Pembelajaran</td>
                      <td className="p-5">{data.lingkungan}</td>
                    </tr>
                    <tr className="border-b-2 border-slate-900">
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Kemitraan Komunitas</td>
                      <td className="p-5">{data.kemitraan}</td>
                    </tr>
                    <tr>
                      <td className="p-5 font-black bg-slate-50 border-r-2 border-slate-900 text-[10pt]">Akselerasi Digital</td>
                      <td className="p-5 font-mono text-emerald-700 bg-emerald-50/30">{data.digital}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SEKSI PENGALAMAN BELAJAR */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-6 bg-slate-900 text-white inline-block px-4 py-1">III. Pengalaman Belajar (Deep Learning)</h3>
                <div className="space-y-6">
                  <div className="border-2 border-slate-900 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                       <RotateCcw className="w-16 h-16" />
                    </div>
                    <p className="text-[10pt] font-black uppercase text-indigo-600 mb-4 tracking-widest">A. Kegiatan Awal (Koneksi & Kebutuhan)</p>
                    <div className="text-[11pt] leading-relaxed whitespace-pre-wrap">{data.awal}</div>
                  </div>
                  
                  <div className="border-2 border-slate-900 overflow-hidden rounded-[2rem]">
                    <div className="bg-slate-900 text-white p-5 border-b-2 border-slate-900">
                      <p className="text-[11pt] font-black uppercase tracking-[0.2em] text-center">B. Konstruksi Inti (Deep Exploration)</p>
                    </div>
                    <div className="divide-y-2 divide-slate-900">
                      <div className="p-10 relative">
                        <div className="absolute top-10 right-10 text-[60pt] font-black text-slate-100 -z-10 leading-none">01</div>
                        <p className="text-[10pt] font-black text-indigo-600 uppercase mb-4 flex items-center gap-3">
                          <Zap className="w-5 h-5" />
                          Memahami (Eksplorasi Konsep)
                        </p>
                        <div className="text-[11pt] leading-relaxed whitespace-pre-wrap relative z-10">{data.intiMemahami}</div>
                      </div>
                      <div className="p-10 relative bg-slate-50/50">
                        <div className="absolute top-10 right-10 text-[60pt] font-black text-slate-100 -z-10 leading-none">02</div>
                        <p className="text-[10pt] font-black text-indigo-600 uppercase mb-4 flex items-center gap-3">
                          <Activity className="w-5 h-5" />
                          Mengaplikasi (Penerapan Kreatif)
                        </p>
                        <div className="text-[11pt] leading-relaxed whitespace-pre-wrap relative z-10">{data.intiMengaplikasi}</div>
                      </div>
                      <div className="p-10 relative">
                        <div className="absolute top-10 right-10 text-[60pt] font-black text-slate-100 -z-10 leading-none">03</div>
                        <p className="text-[10pt] font-black text-indigo-600 uppercase mb-4 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5" />
                          Merefleksi (Umpan Balik & Evaluasi)
                        </p>
                        <div className="text-[11pt] leading-relaxed whitespace-pre-wrap relative z-10">{data.intiMerefleksi}</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-slate-900 p-8 rounded-3xl relative overflow-hidden bg-slate-50/30">
                    <p className="text-[10pt] font-black uppercase text-indigo-600 mb-4 tracking-widest">C. Kegiatan Penutup (Sintesis & Transfer)</p>
                    <div className="text-[11pt] leading-relaxed whitespace-pre-wrap">{data.penutup}</div>
                  </div>
                </div>
              </div>

              {/* SEKSI ASESMEN */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 bg-slate-900 text-white inline-block px-4 py-1">IV. Penilaian & Evaluasi</h3>
                <table className="w-full border-2 border-slate-900 border-collapse">
                  <tbody>
                    <tr className="border-b-2 border-slate-900 text-center uppercase text-[8pt] font-black bg-slate-100">
                      <td className="w-1/3 p-3 border-r-2 border-slate-900">Diagnostik (Awal)</td>
                      <td className="w-1/3 p-3 border-r-2 border-slate-900">Formatif (Proses)</td>
                      <td className="w-1/3 p-3">Sumatif (Akhir)</td>
                    </tr>
                    <tr className="align-top">
                      <td className="p-5 border-r-2 border-slate-900 whitespace-pre-wrap text-[10pt]">{data.asesmenAwal}</td>
                      <td className="p-5 border-r-2 border-slate-900 whitespace-pre-wrap text-[10pt]">{data.asesmenProses}</td>
                      <td className="p-5 whitespace-pre-wrap text-[10pt]">{data.asesmenAkhir}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RUBRIK PENILAIAN */}
              <div className="mt-12 page-break">
                <div className="text-center mb-10">
                  <h3 className="text-[13pt] font-black mb-1 uppercase tracking-tight">{data.judulRubrik || "Matriks Ketercapaian Pembelajaran"}</h3>
                  <div className="h-1 w-24 bg-slate-900 mx-auto mb-3" />
                  <p className="text-[10pt] italic font-medium text-slate-500">Tujuan: {data.tujuanRubrik || data.tujuan}</p>
                </div>
                
                <table className="w-full border-2 border-slate-900 border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="border-2 border-slate-900 p-4 text-left font-black uppercase tracking-widest text-[8pt] w-1/5">Indikator</th>
                      <th className="border-2 border-slate-900 p-4 text-center font-black uppercase tracking-widest text-[8pt] w-1/5 bg-rose-600/20">Baru Memulai</th>
                      <th className="border-2 border-slate-900 p-4 text-center font-black uppercase tracking-widest text-[8pt] w-1/5 bg-amber-600/20">Berkembang</th>
                      <th className="border-2 border-slate-900 p-4 text-center font-black uppercase tracking-widest text-[8pt] w-1/5 bg-emerald-600/20">Cakap</th>
                      <th className="border-2 border-slate-900 p-4 text-center font-black uppercase tracking-widest text-[8pt] w-1/5 bg-indigo-600/20">Mahir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rubrik.map((row, i) => (
                      <tr key={i}>
                        <td className="border-2 border-slate-900 p-5 align-top font-black bg-slate-50 text-[10pt]">{row.indikator}</td>
                        <td className="border-2 border-slate-900 p-5 align-top text-[9pt] leading-tight text-slate-700">{row.baruMemulai}</td>
                        <td className="border-2 border-slate-900 p-5 align-top text-[9pt] leading-tight text-slate-700">{row.berkembang}</td>
                        <td className="border-2 border-slate-900 p-5 align-top text-[9pt] leading-tight text-slate-700">{row.cakap}</td>
                        <td className="border-2 border-slate-900 p-5 align-top text-[9pt] leading-tight text-slate-700">{row.mahir}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TANDA TANGAN */}
            <div className="mt-24 flex justify-between items-start text-[11pt] px-8 border-t-2 border-slate-100 pt-16">
              <div className="text-center w-64 group">
                <p className="font-bold mb-1">Mengesahkan,</p>
                <p className="text-sm font-black uppercase text-slate-400 mb-1">Kepala Sekolah</p>
                <div className="h-32" />
                <div className="w-full h-px bg-slate-900 mb-1" />
                <p className="font-black">NIP.</p>
              </div>
              <div className="text-center w-72 group">
                <p className="mb-1">Purbalingga, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="text-sm font-black uppercase text-indigo-600 mb-1">Guru Kelas / Mata Pelajaran</p>
                <div className="h-32 flex flex-col justify-end items-center italic text-slate-300 text-xs pb-4">
                   <span>Digital Signature Space</span>
                </div>
                <div className="w-full h-px bg-indigo-600 mb-1" />
                <p className="font-black text-indigo-700 underline decoration-indigo-600 decoration-2 underline-offset-4">{data.nama}</p>
                <p className="text-sm font-bold">NIP.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

