import { GoogleGenAI, Type } from "@google/genai";
import { RPPData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateRPPContent(partialData: Partial<RPPData>): Promise<Partial<RPPData>> {
  const prompt = `Sebagai pakar desain instruksional Kurikulum Merdeka dan Arsitek Pembelajaran Mendalam (Deep Learning), susunlah isi detail Rencana Pelaksanaan Pembelajaran (RPP) yang inovatif.

  DATA IDENTITAS:
  - Mata Pelajaran: ${partialData.mapel}
  - Fase: ${partialData.fase}
  - Kelas/Semester: ${partialData.kelas}
  - Alokasi Waktu: ${partialData.waktu}
  - Capaian Pembelajaran: ${partialData.cp}
  - Topik Pembelajaran: ${partialData.topik}
  
  INSTRUKSI KHUSUS PEDAGOGIS:
  Tugas utama Anda adalah merancang pengalaman belajar yang BERORIENTASI MASA DEPAN dengan menyeimbangkan tiga pilar utama Deep Learning secara proporsional:
  
  1. BERKESADARAN (Mindful): Pastikan siswa hadir utuh, merasa aman, dan terlibat secara emosional. Fokus pada fokus diri, empati, dan kehadiran mental.
  2. BERMAKNA (Meaningful): Hubungkan materi dengan realitas kehidupan, kearifan lokal, atau isu global yang relevan. Siswa harus memahami 'mengapa' mereka mempelajari hal ini.
  3. MENGGEMBIRAKAN (Joyful): Hadirkan unsur kejutan, tantangan yang menyenangkan, kolaborasi yang hidup, dan apresiasi terhadap proses kreatif.
  
  STRUKTUR KEGIATAN INTI:
  Anda wajib menguraikan kegiatan inti ke dalam 3 tahap (Memahami, Mengaplikasi, Merefleksi). Setiap tahap harus mengandung narasi operasional yang kuat dengan komposisi:
  - MEMAHAMI: Eksplorasi konsep melalui pemantik rasa ingin tahu dan dialog mendalam yang mindful.
  - MENGAPLIKASI: Penerapan konsep dalam bentuk proyek kecil, simulasi, atau karya nyata yang bermakna.
  - MEREFLEKSI: Umpan balik berkelanjutan dan metakognisi yang menggembirakan.

  PERSYARATAN TEKNIS:
  - Pilih 2-3 Dimensi Profil Lulusan (DPL) yang paling fungsional untuk topik ini (Gunakan ID: dpl1 s.d dpl8).
  - Susun Rubrik Penilaian dengan indikator yang terukur dan deskripsi kualitatif yang jelas untuk setiap level (Baru Memulai -> Mahir).
  - Gunakan bahasa Indonesia yang profesional, inspiratif, namun mudah dipahami oleh guru.
  - RESPON HARUS SELALU BERUPA JSON VALID SESUAI SKEMA BERIKUT.`;

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
