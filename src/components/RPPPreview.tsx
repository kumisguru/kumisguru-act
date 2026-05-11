import React, { useRef, useState } from 'react';
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
    // Enhanced styles for Word
    const style = `
      <style>
        @page { size: A4; margin: 2cm; }
        body { font-family: "Times New Roman", serif; font-size: 11pt; color: #000; }
        table { border-collapse: collapse; width: 100%; border: 1pt solid black; margin-bottom: 20px; }
        td, th { border: 1pt solid black; padding: 8px; vertical-align: top; }
        .border-none { border: none !important; }
        .p-0 { padding: 0 !important; }
        .p-1 { padding: 4px !important; }
        .p-4 { padding: 16px !important; }
        .font-bold { font-weight: bold; }
        .font-black { font-weight: 900; }
        .uppercase { text-transform: uppercase; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-xs { font-size: 8pt; }
        .text-sm { font-size: 10pt; }
        .bg-slate-50 { background-color: #f1f5f9; }
        .bg-black { background-color: #000000; }
        .w-full { width: 100%; }
        .w-1/2 { width: 50%; }
        .italic { font-style: italic; }
        .whitespace-pre-wrap { white-space: pre-wrap; }
        .flex { display: flex; }
        .items-start { align-items: flex-start; }
        .gap-2 { gap: 8px; }
        .w-3\\.5 { width: 14px; }
        .h-3\\.5 { height: 14px; }
        .border { border: 1pt solid black; }
        .flex-shrink-0 { flex-shrink: 0; }
        .mt-1 { margin-top: 4px; }
      </style>
    `;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>RPP Export</title>${style}</head><body>`;
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dokumen Terkonsolidasi</h2>
            <p className="text-sm font-medium text-slate-500">Pratinjau akhir sesuai panduan resmi pembelajaran mendalam.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all shadow-elegant active:scale-95 border border-slate-100 text-xs sm:text-base"
          >
            <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span>Salin</span>
          </button>
          <button
            onClick={handleExportWord}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all shadow-elegant active:scale-95 border border-slate-100 text-xs sm:text-base"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span>Word</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-1 shadow-elegant rounded-[2rem] md:rounded-[3.5rem] border border-slate-100 overflow-hidden">
        <div className="bg-[#f8fafc] p-2 md:p-12 overflow-x-auto custom-scrollbar">
          <div 
            ref={contentRef}
            className="bg-white p-6 md:p-20 shadow-2xl rounded-2xl min-w-[800px] max-w-[950px] mx-auto text-slate-900 print:p-0 print:shadow-none font-serif relative"
            style={{ lineHeight: '1.6' }}
          >
            {/* Watermark/Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f1f5f9] rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none print:hidden" />

            {/* HEADER DOKUMEN */}
            <div className="mb-10">
              <h1 className="text-xl font-bold mb-8">PERENCANAAN PEMBELAJARAN MENDALAM</h1>
              <table className="w-full border-none mb-10 text-sm">
                <tbody>
                  <tr>
                    <td className="p-1 border-none font-bold w-[250px]">NAMA PENYUSUN</td>
                    <td className="p-1 border-none font-black uppercase tracking-tight">: {data.nama}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-none font-bold">SATUAN PENDIDIKAN</td>
                    <td className="p-1 border-none">: {data.satuan}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-none font-bold">MATA PELAJARAN</td>
                    <td className="p-1 border-none">: {data.mapel}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-none font-bold">FASE</td>
                    <td className="p-1 border-none font-bold">: {data.fase}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-none font-bold">KELAS / SEMESTER</td>
                    <td className="p-1 border-none font-bold">: {data.kelas}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-none font-bold">ALOKASI WAKTU</td>
                    <td className="p-1 border-none">: {data.waktu}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* MAIN DATA TABLE */}
            <table className="w-full border-collapse border border-black text-[10pt] mb-10">
              <tbody>
                {/* IDENTIFIKASI */}
                <tr>
                  <td rowSpan={4} className="border border-black p-4 font-bold bg-slate-50 uppercase text-center w-[120px] align-middle">IDENTIFIKASI</td>
                  <td className="border border-black p-4 font-bold w-[220px]">Peserta Didik</td>
                  <td className="border border-black p-4 italic text-slate-600">{data.pesertaDidik}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Materi Pelajaran</td>
                  <td className="border border-black p-4 whitespace-pre-wrap">{data.materi}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Dimensi Profil Lulusan (DPL)</td>
                  <td className="border border-black p-4 text-xs italic">Pilihlah dimensi profil lulusan yang akan dicapai dalam pembelajaran</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-4">
                    <table className="w-full border-none text-[10pt]">
                      <tbody>
                        {DPL_OPTIONS.filter(opt => data.dpl.includes(opt.id)).reduce((acc: any[][], opt, i) => {
                          if (i % 2 === 0) acc.push([opt]);
                          else acc[acc.length - 1].push(opt);
                          return acc;
                        }, []).map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            {row.map(opt => (
                              <td key={opt.id} className="p-1 border-none w-1/2">
                                <div className="flex items-start gap-2">
                                  <div className="w-3.5 h-3.5 border border-black bg-black flex-shrink-0 mt-1" />
                                  <div className="leading-tight">
                                    <div className="font-bold text-[8.5pt] uppercase">{opt.id}</div>
                                    <div className="text-[7.5pt] text-slate-700">{opt.label.split(': ')[1]}</div>
                                  </div>
                                </div>
                              </td>
                            ))}
                            {row.length === 1 && <td className="p-2 border-none w-1/2"></td>}
                          </tr>
                        ))}
                        {data.dpl.length === 0 && (
                          <tr>
                            <td className="p-2 border-none italic text-slate-400">Tidak ada dimensi yang dipilih</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* DESAIN PEMBELAJARAN */}
                <tr>
                  <td rowSpan={8} className="border border-black p-4 font-bold bg-slate-50 uppercase text-center align-middle">DESAIN PEMBELAJARAN</td>
                  <td className="border border-black p-4 font-bold">Capaian Pembelajaran</td>
                  <td className="border border-black p-4 italic text-slate-600">{data.cp}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Lintas Disiplin Ilmu</td>
                  <td className="border border-black p-4">{data.lintasDisiplin}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Tujuan Pembelajaran</td>
                  <td className="border border-black p-4 font-bold">{data.tujuan}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Topik Pembelajaran</td>
                  <td className="border border-black p-4 font-bold">{data.topik}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Praktik Pedagogis</td>
                  <td className="border border-black p-4">{data.pedagogis}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Kemitraan Pembelajaran</td>
                  <td className="border border-black p-4">{data.kemitraan}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Lingkungan Pembelajaran</td>
                  <td className="border border-black p-4">{data.lingkungan}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Pemanfaatan Digital</td>
                  <td className="border border-black p-4">{data.digital}</td>
                </tr>

                {/* PENGALAMAN BELAJAR */}
                <tr>
                  <td rowSpan={6} className="border border-black p-4 font-bold bg-slate-50 uppercase text-center align-middle">PENGALAMAN BELAJAR</td>
                  <td colSpan={2} className="border border-black p-3 bg-slate-50 font-bold text-xs uppercase tracking-tight">AWAL (tuliskan prinsip pembelajaran yang digunakan, misal berkesadaran, bermakna, menggembirakan)</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-5 whitespace-pre-wrap">{data.awal}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-3 bg-slate-50 font-bold uppercase text-xs tracking-tight">INTI</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-5 font-medium text-[9pt] italic leading-relaxed">
                    Pada tahap ini, siswa aktif terlibat dalam pengalaman belajar memahami, mengaplikasi, dan merefleksi. Guru menerapkan prinsip pembelajaran berkesadaran, bermakna, menyenangkan untuk mencapai tujuan pembelajaran. Pengalaman belajar tidak harus dilaksanakan dalam satu kali pertemuan.
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-0">
                    <table className="w-full border-collapse border-none">
                      <tbody>
                        <tr>
                          <td className="p-5 border-r border-b border-black font-bold w-[340px] text-xs">Memahami (tuliskan prinsip pembelajaran yang digunakan, misal berkesadaran, bermakna, menggembirakan)</td>
                          <td className="p-5 border-b border-black whitespace-pre-wrap">{data.intiMemahami}</td>
                        </tr>
                        <tr>
                          <td className="p-5 border-r border-b border-black font-bold text-xs">Mengaplikasi (tuliskan prinsip pembelajaran yang digunakan, misal berkesadaran, bermakna, menggembirakan)</td>
                          <td className="p-5 border-b border-black whitespace-pre-wrap">{data.intiMengaplikasi}</td>
                        </tr>
                        <tr>
                          <td className="p-5 border-r border-black font-bold text-xs">Merefleksi (tuliskan prinsip pembelajaran yang digunakan, misal berkesadaran, bermakna, menggembirakan)</td>
                          <td className="p-5 whitespace-pre-wrap">{data.intiMerefleksi}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-0">
                    <table className="w-full border-collapse border-none">
                      <tbody>
                        <tr>
                          <td className="p-3 border-t border-b border-black bg-slate-50 font-bold text-xs uppercase tracking-tight">PENUTUP (tuliskan prinsip pembelajaran yang digunakan, misal berkesadaran, bermakna, menggembirakan)</td>
                        </tr>
                        <tr>
                          <td className="p-5 whitespace-pre-wrap">{data.penutup}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                {/* ASESMEN PEMBELAJARAN */}
                <tr>
                  <td rowSpan={4} className="border border-black p-4 font-bold bg-slate-50 uppercase text-center align-middle">ASESMEN PEMBELAJARAN</td>
                  <td className="border border-black p-4 font-bold">Asesmen pada Awal Pembelajaran</td>
                  <td className="border border-black p-4 whitespace-pre-wrap">{data.asesmenAwal}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Asesmen pada Proses Pembelajaran</td>
                  <td className="border border-black p-4 whitespace-pre-wrap">{data.asesmenProses}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold">Asesmen pada Akhir Pembelajaran</td>
                  <td className="border border-black p-4 whitespace-pre-wrap">{data.asesmenAkhir}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black p-4 text-[8pt] italic text-slate-500 bg-[#f8fafc]">
                    Asesmen dalam pembelajaran mendalam disesuaikan dengan assessment as learning, assessment for learning, dan assessment of learning. Tentukan metode atau cara yang digunakan secara komprehensif untuk mengukur pencapaian kompetensi peserta didik. Contoh: Tes tertulis, Tes lisan, Penilaian Kinerja, Penilaian Proyek, Penilaian Produk, Observasi, Portofolio, Peer Assessment, Self Assessment, penilaian berbasis kelas, dan sebagainya.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* RUBRIK PENILAIAN */}
            <div className="mt-20">
              <h3 className="text-[12pt] font-black uppercase mb-3 text-indigo-700">RUBRIK PENILAIAN DISKUSI KELAS</h3>
              <p className="text-[10pt] font-bold mb-6 italic text-slate-600">Tujuan Pembelajaran: {data.tujuanRubrik || data.tujuan}</p>
              
              <table className="w-full border-collapse border border-black text-[9pt]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="border border-black p-4 text-left font-bold w-1/5 bg-[#eef2ff]">Indikator</th>
                    <th className="border border-black p-4 text-center font-bold w-1/5">Baru Memulai</th>
                    <th className="border border-black p-4 text-center font-bold w-1/5">Berkembang</th>
                    <th className="border border-black p-4 text-center font-bold w-1/5">Cakap</th>
                    <th className="border border-black p-4 text-center font-bold w-1/5">Mahir</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rubrik.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-black p-4 align-top font-bold bg-[#f1f5f9]">{row.indikator}</td>
                      <td className="border border-black p-4 align-top leading-tight text-slate-700">{row.baruMemulai}</td>
                      <td className="border border-black p-4 align-top leading-tight text-slate-700">{row.berkembang}</td>
                      <td className="border border-black p-4 align-top leading-tight text-slate-700">{row.cakap}</td>
                      <td className="border border-black p-4 align-top leading-tight text-slate-700">{row.mahir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 text-[8pt] space-y-1 font-medium bg-[#f8fafc] p-4 rounded-xl border border-dotted border-slate-300">
                <p className="font-bold underline mb-2">Keterangan:</p>
                <p>● <span className="font-bold">Baru Memulai</span>: Peserta didik menunjukkan pemahaman dan keterampilan yang sangat dasar.</p>
                <p>● <span className="font-bold">Berkembang</span>: Peserta didik menunjukkan pemahaman dan keterampilan yang sedang berkembang, tetapi masih perlu perbaikan.</p>
                <p>● <span className="font-bold">Cakap</span>: Peserta didik menunjukkan pemahaman dan keterampilan yang baik, sesuai dengan harapan.</p>
                <p>● <span className="font-bold">Mahir</span>: Peserta didik menunjukkan pemahaman dan keterampilan yang sangat baik, melebihi harapan.</p>
              </div>
            </div>

            {/* TANDA TANGAN */}
            <table className="w-full border-none mt-24 text-[11pt]">
              <tbody>
                <tr>
                  <td className="border-none w-1/2 align-top text-center px-4">
                    <p className="font-bold mb-1 text-slate-900">Mengesahkan,</p>
                    <p className="text-[10pt] font-black uppercase text-slate-400 mb-10">Kepala Sekolah</p>
                    <div className="h-20" />
                    <div className="w-full h-px bg-slate-900 mb-1 mx-auto max-w-[220px]" />
                    <p className="font-black text-slate-900">NAMA: ...........................................</p>
                    <p className="text-[10pt] font-bold text-slate-900">NIP. ...........................................</p>
                  </td>
                  <td className="border-none w-1/2 align-top text-center px-4">
                    <p className="mb-1 text-slate-900 text-[10pt] italic">Purbalingga, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-[10pt] font-black uppercase text-indigo-600 mb-10">Guru Kelas / Mata Pelajaran</p>
                    <div className="h-20" />
                    <div className="w-full h-px bg-indigo-600 mb-1 mx-auto max-w-[220px]" />
                    <p className="font-black text-indigo-700 underline decoration-indigo-600 decoration-2 underline-offset-4">{data.nama}</p>
                    <p className="text-[10pt] font-bold text-slate-900">NIP. ...........................................</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

