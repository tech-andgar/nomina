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

export function createEmptyColaborador(): Colaborador {
  return {
    cedula: null,
    nombre: null,
    sueldo: null,
    valorHoraOrdinaria: null,
    auxTransporte: null,
    diasTrabajados: null,
    devengado: {
      horasExtras: {
        diurna: null,
        nocturna: null,
        domingos: null,
        nocturnaDomingos: null,
        recargoNocturno: null,
      },
      sueldoBasico: null,
      valorExtras: {
        diurna: null,
        nocturna: null,
        domingos: null,
        nocturnaDomingos: null,
        recargoNocturno: null,
      },
      totalValorExtras: null,
      ibc: null,
      totalDevengado: null,
    },
    deducido: {
      salud: null,
      pension: null,
      fondoSolidaridad: null,
      uvt: null,
      retefuente: null,
      totalDeducido: null,
    },
    parafiscales: {
      salud: null,
      pension: null,
      arl: null,
      sena: null,
      icbf: null,
      cajas: null,
      totalParafiscales: null,
    },
    prestaciones: {
      prima: null,
      vacaciones: null,
      cesantias: null,
      interesCesantias: null,
      totalPrestacion: null,
    },
    totalNeto: null,
    totalNomina: null,
  };
}
