import { RPPData } from '../types';

// Initial empty RPP
export const DEFAULT_RPP: RPPData = {
  nama: '',
  jenjang: '',
  satuan: '',
  mapel: '',
  fase: '',
  kelas: '',
  waktu: '',
  cp: '',
  topik: '',
  pesertaDidik: '',
  materi: '',
  dpl: [],
  lintasDisiplin: '',
  tujuan: '',
  pedagogis: '',
  lingkungan: '',
  kemitraan: '',
  digital: '',
  awal: '',
  intiMemahami: '',
  intiMengaplikasi: '',
  intiMerefleksi: '',
  penutup: '',
  asesmenAwal: '',
  asesmenProses: '',
  asesmenAkhir: '',
  judulRubrik: 'Rubrik Penilaian Diskusi Kelas:',
  tujuanRubrik: '',
  rubrik: [
    { indikator: 'Indikator 1', baruMemulai: '', berkembang: '', cakap: '', mahir: '' },
    { indikator: 'Indikator 2', baruMemulai: '', berkembang: '', cakap: '', mahir: '' }
  ]
};

// Simple local storage history for now until Firebase is setup
export async function getHistory(): Promise<RPPData[]> {
  const stored = localStorage.getItem('rpp_history');
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function saveRPP(data: RPPData): Promise<void> {
  const history = await getHistory();
  const newData = { ...data, id: data.id || Date.now().toString(), timestamp: Date.now() };
  
  let updatedHistory;
  if (data.id) {
    updatedHistory = history.map(item => item.id === data.id ? newData : item);
  } else {
    updatedHistory = [newData, ...history];
  }
  
  localStorage.setItem('rpp_history', JSON.stringify(updatedHistory));
}
