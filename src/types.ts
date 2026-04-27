export interface RPPData {
  id?: string;
  nama: string;
  jenjang: string;
  satuan: string;
  mapel: string;
  fase: string;
  kelas: string;
  waktu: string;
  cp: string;
  topik: string;
  pesertaDidik: string;
  materi: string;
  dpl: string[];
  lintasDisiplin: string;
  tujuan: string;
  pedagogis: string;
  lingkungan: string;
  kemitraan: string;
  digital: string;
  awal: string;
  intiMemahami: string;
  intiMengaplikasi: string;
  intiMerefleksi: string;
  penutup: string;
  asesmenAwal: string;
  asesmenProses: string;
  asesmenAkhir: string;
  judulRubrik: string;
  tujuanRubrik: string;
  rubrik: RubrikIndikator[];
  timestamp?: number;
}

export interface RubrikIndikator {
  indikator: string;
  baruMemulai: string;
  berkembang: string;
  cakap: string;
  mahir: string;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}
