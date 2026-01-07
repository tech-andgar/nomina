export interface ExtrasBreakdown<T> {
  diurna: T;
  nocturna: T;
  domingos: T;
  nocturnaDomingos: T;
  recargoNocturno: T;
}

export interface Devengado {
  horasExtras: ExtrasBreakdown<number | null>;
  sueldoBasico: number | null;
  valorExtras: ExtrasBreakdown<number | null>;
  totalValorExtras: number | null;
  ibc: number | null;
  totalDevengado: number | null;
}

export interface Deducido {
  salud: number | null;
  pension: number | null;
  fondoSolidaridad: number | null;
  uvt: number | null;
  retefuente: number | null;
  totalDeducido: number | null;
}

export interface Parafiscales {
  salud: number | null;
  pension: number | null;
  arl: number | null;
  sena: number | null;
  icbf: number | null;
  cajas: number | null;
  totalParafiscales: number | null;
}

export interface Prestaciones {
  prima: number | null;
  vacaciones: number | null;
  cesantias: number | null;
  interesCesantias: number | null;
  totalPrestacion: number | null;
}

export interface Colaborador {
  cedula: string | null;
  nombre: string | null;
  sueldo: number | null;
  valorHoraOrdinaria: number | null;
  auxTransporte: number | null;
  diasTrabajados: number | null;
  devengado: Devengado;
  deducido: Deducido;
  parafiscales: Parafiscales;
  prestaciones: Prestaciones;
  totalNeto: number | null;
  totalNomina: number | null;
}
