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

// New interface for optional deductions (Art. 387 ET)
export interface OpcionesDeducciones {
  dependientes: boolean; // Deducts 10% of total income (capped at 32 UVT)
  medicinaPrepagadaMensual: number | null; // Deducts actual value (capped at 16 UVT)
  viviendaMensual: number | null; // Deducts actual value (capped at 100 UVT)
  /**
   * Tabla de Retención en la Fuente a aplicar:
   * - "actual": Ley 2277 (2023-Presente) -> Inicia 95 UVT, Max 39%
   * - "legacy_2019_2022": Ley 1943/2010 -> Inicia 87 UVT, Max 39%
   * - "legacy_2017_2018": Ley 1819 -> Inicia 95 UVT, Max 35%
   * - "legacy_2013_2016": Ley 1607 -> Inicia 95 UVT, Max 33%
   * - "legacy_2010_2012": Ley 1111 -> Inicia 95 UVT, Max 33% (Igual a 2013-2016 para Art 383, difiere exenciones)
   * - "legacy_user_85uvt": Tabla Personalizada Usuario (Pre-2013) -> Inicia 85 UVT
   */
  tipoTabla?: "actual" | "legacy_2019_2022" | "legacy_2017_2018" | "legacy_2013_2016" | "legacy_2010_2012" | "legacy_user_85uvt";
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
  deduccionesOpcionales: OpcionesDeducciones; // Renamed to avoid confusion with 'deducido'
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
    valorHoraOrdinaria: 0,
    auxTransporte: 0,
    diasTrabajados: null,
    devengado: {
      horasExtras: { diurna: null, nocturna: null, domingos: null, nocturnaDomingos: null, recargoNocturno: null },
      sueldoBasico: 0,
      valorExtras: { diurna: null, nocturna: null, domingos: null, nocturnaDomingos: null, recargoNocturno: null },
      totalValorExtras: 0,
      ibc: 0,
      totalDevengado: 0,
    },
    deducido: {
      salud: 0,
      pension: 0,
      fondoSolidaridad: 0,
      uvt: 0,
      retefuente: 0,
      totalDeducido: 0,
    },
    deduccionesOpcionales: {
      dependientes: false,
      medicinaPrepagadaMensual: null,
      viviendaMensual: null,
      tipoTabla: "actual",
    },
    parafiscales: {
      salud: 0,
      pension: 0,
      arl: 0,
      sena: 0,
      icbf: 0,
      cajas: 0,
      totalParafiscales: 0,
    },
    prestaciones: {
      prima: 0,
      vacaciones: 0,
      cesantias: 0,
      interesCesantias: 0,
      totalPrestacion: 0,
    },
    totalNeto: 0,
    totalNomina: 0,
  };
}
