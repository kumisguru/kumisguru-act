import { GoogleGenAI, Type } from "@google/genai";
import { RPPData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateRPPContent(partialData: Partial<RPPData>): Promise<Partial<RPPData>> {
  const prompt = `Sebagai pakar desain instruksional Kurikulum Merdeka dan Arsitek Pembelajaran Mendalam (Deep Learning), susunlah isi detail Rencana Pelaksanaan Pembelajaran (RPP) yang inovatif sesuai panduan resmi.

  STRUKTUR DOKUMEN YANG WAJIB DIIKUTI:
  1. IDENTIFIKASI:
     - Peserta Didik: Identifikasi kesiapan, minat, latar belakang, dan kebutuhan belajar.
     - Materi Pelajaran: Analisis jenis pengetahuan, relevansi kehidupan nyata, tingkat kesulitan, struktur materi, integrasi nilai/karakter.
     - DPL (Dimensi Profil Lulusan): Pilih 2-3 ID DPL yang relevan (dpl1-dpl8).

  2. DESAIN PEMBELAJARAN:
     - Capaian Pembelajaran: Sesuai fase ${partialData.fase}.
     - Lintas Disiplin Ilmu: Disiplin ilmu/mata pelajaran relevan.
     - Tujuan Pembelajaran: Kompetensi yang diharapkan (subjek, pengetahuan/sikap/keterampilan, konteks, indikator).
     - Topik Pembelajaran: Topik utama ${partialData.topik}.
     - Praktik Pedagogis: Model/Strategi/Metode (PBL, PjBL, Inkuiri, dll).
     - Kemitraan Pembelajaran: Kerjasama dengan orang tua, komunitas, ahli, atau mitra industri.
     - Lingkungan Pembelajaran: Integrasi ruang fisik, virtual, dan budaya belajar.
     - Pemanfaatan Digital: Penggunaan teknologi interaktif dan kolaboratif.

  3. PENGALAMAN BELAJAR (Deep Learning):
     - AWAL: Pembuka (orientasi, apersepsi, motivasi). Cantumkan prinsip yang digunakan (berkesadaran, bermakna, menggembirakan).
     - INTI:
        * Memahami: Eksplorasi konsep (tuliskan prinsip yang digunakan).
        * Mengaplikasi: Penerapan konsep (tuliskan prinsip yang digunakan).
        * Merefleksi: Umpan balik & metakognisi (tuliskan prinsip yang digunakan).
     - PENUTUP: Tahap akhir (umpan balik konstruktif, simpulan, perencanaan bersama). Cantumkan prinsip yang digunakan.

  4. ASESMEN PEMBELAJARAN:
     - Diagnostik (Awal Pembelajaran).
     - Formatif (Proses Pembelajaran).
     - Sumatif (Akhir Pembelajaran).

  5. RUBRIK PENILAIAN:
     - Indikator ketercapaian.
     - Level: Baru Memulai, Berkembang, Cakap, Mahir.

  DATA INPUT:
  - Mata Pelajaran: ${partialData.mapel}
  - Fase: ${partialData.fase}
  - Kelas/Semester: ${partialData.kelas}
  - Alokasi Waktu: ${partialData.waktu}
  - Capaian Pembelajaran (Draft): ${partialData.cp}
  - Topik: ${partialData.topik}

  RESPON HARUS SELALU BERUPA JSON VALID SESUAI SKEMA BERIKUT.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pesertaDidik: { type: Type.STRING },
          materi: { type: Type.STRING },
          dpl: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Array of DPL IDs like ['dpl3', 'dpl4']"
          },
          lintasDisiplin: { type: Type.STRING },
          tujuan: { type: Type.STRING },
          pedagogis: { type: Type.STRING },
          lingkungan: { type: Type.STRING },
          kemitraan: { type: Type.STRING, description: "Kemitraan Pembelajaran (Orang tua/komunitas)" },
          digital: { type: Type.STRING },
          awal: { type: Type.STRING },
          intiMemahami: { type: Type.STRING, description: "Memahami (Mindful, Meaningful, Joyful)" },
          intiMengaplikasi: { type: Type.STRING, description: "Mengaplikasi (Mindful, Meaningful, Joyful)" },
          intiMerefleksi: { type: Type.STRING, description: "Merefleksi (Mindful, Meaningful, Joyful)" },
          penutup: { type: Type.STRING },
          asesmenAwal: { type: Type.STRING },
          asesmenProses: { type: Type.STRING },
          asesmenAkhir: { type: Type.STRING },
          judulRubrik: { type: Type.STRING },
          tujuanRubrik: { type: Type.STRING },
          rubrik: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                indikator: { type: Type.STRING },
                baruMemulai: { type: Type.STRING },
                berkembang: { type: Type.STRING },
                cakap: { type: Type.STRING },
                mahir: { type: Type.STRING }
              },
              required: ["indikator", "baruMemulai", "berkembang", "cakap", "mahir"]
            }
          }
        },
        required: [
          "pesertaDidik", "materi", "dpl", "lintasDisiplin", "tujuan", "pedagogis", 
          "lingkungan", "digital", "awal", "intiMemahami", "intiMengaplikasi", 
          "intiMerefleksi", "penutup", "asesmenAwal", "asesmenProses", "asesmenAkhir", "rubrik"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return {};
  }
}
