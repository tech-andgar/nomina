import yearlyData from "@assets/data/yearly_data.json";

// Estas son las constantes globales para el cálculo de nómina en Colombia
export const GLOBAL_CONSTANTS = {
  // Horas de trabajo al día
  horasHabiles: 8,
  // Días base para el cálculo mensual
  diasMes: 30,

  // Factores para horas extras y recargos
  horasExtras: {
    // Factor para horas extras diurnas.
    diurna: 1.25,
    // Factor para horas extras nocturnas.
    nocturna: 1.75,
    // Factor para horas extras en domingos.
    domingos: 2,
    // Factor para horas extras nocturnas en domingos.
    nocturnaDomingos: 2.5,
    // Factor para recargo nocturno adicional.
    recargoNocturno: 1.35,
  },

  // Aportes de salud
  salud: {
    // Porcentaje de salud que paga el colaborador.
    colaborador: 4,
    // Porcentaje de salud que paga el empleador.
    empleador: 8.5,
    // Porcentaje total para independiente
    independiente: 12.5,
  },
  // Porcentajes de pensión.
  pension: {
    // Porcentaje de pensión que paga el colaborador.
    colaborador: 4,
    // Porcentaje de pensión que paga el empleador.
    empleador: 12,
    // Porcentaje total para independiente
    independiente: 16,
  },

  // Aportes parafiscales
  parafiscal: {
    // Porcentaje de ARL.
    arl: 0.522,
    // Porcentaje de SENA.
    sena: 2,
    // Porcentaje de ICBF.
    icbf: 3,
    // Porcentaje de Cajas de Compensación Familiar.
    cajas: 4,
  },

  // Beneficios y prestaciones sociales
  prestacion: {
    // Porcentaje para el cálculo de prima.
    prima: 8.333333,
    // Porcentaje para el cálculo de vacaciones.
    vacaciones: 4.17,
    // Porcentaje para el cálculo de cesantías.
    cesantias: 8.333333,
    // Porcentaje para el cálculo de intereses de cesantías.
    interesCesantias: 1,
  },
};

export const TAX_LIMITS = {
  // Topes deducciones (Art 387 ET) en UVT mensuales
  dependientes: 32,
  medicinaPrepagada: 16,
  vivienda: 100,

  // Porcentajes
  dependientesRate: 0.1, // 10% del ingreso bruto
  rentaExentaRate: 0.25, // 25% de renta exenta
  globalLimitRate: 0.4, // 40% limitacion global

  // Topes Renta Exenta 25% (Anual en UVT)
  rentaExentaCapAnnual: {
    ley2277: 790,
    pre2023: 2880,
  },

  // Topes Globales (Anual en UVT)
  globalLimitCapAnnual: {
    ley2277: 1340,
    pre2023: 5040,
  }
};


export const MONEY_FORMAT = {
  decimal: ",",
  thousands: ".",
  prefix: "$ ",
  precision: 0,
  masked: true,
};

export interface YearlyMultipliers {
  diurna: number;
  nocturna: number;
  festiva: number;
  festivaDiurna: number;
  festivaNocturna: number;
  recargoNocturno: number;
}

// Interfaz para el tipado de constantes anuales
export interface YearlyConstants {
  slmv: number;
  uvt: number;
  auxTransporte: number;
  horasMensuales: number;
  year: string;
  multipliers: YearlyMultipliers;
}

interface RawYearlyDataEntry {
  slmv?: number;
  salarioMinimoMensual?: number | string;
  uvt?: number | string;
  auxTransporte?: number | string;
  horasMensuales?: number;
  multipliers?: Partial<YearlyMultipliers>;
  salarioPagadoEmpleadorEjemplo?: {
    "Subsidio de transporte"?: number | string;
  };
  [key: string]: unknown;
}

// Datos históricos y dinámicos por año
export const YEARLY_DATA: Record<string, RawYearlyDataEntry> = yearlyData as unknown as Record<string, RawYearlyDataEntry>;

/**
 * Determina las horas mensuales base según la transición de la Ley 2101 de 2021.
 */
const getHorasMensualesTransition = (year: number, month: number): number => {
  if (year === 2026) return month >= 7 ? 210 : 220;
  if (year === 2025) return 220;
  if (year === 2024) return 230;
  if (year === 2023) return 235;
  if (year < 2023) return 240;
  return 210; // 2027+
};

/**
 * Determina el recargo dominical base según la Ley 2466 de 2024.
 */
const getBaseSundaySurcharge = (year: number, month: number): number => {
  if (year >= 2027) return 1;
  if (year === 2026) return month >= 7 ? 0.9 : 0.8;
  if (year === 2025) return 0.8;
  return 0.75;
};

/**
 * Función que extrae las constantes de un año específico, 
 * manteniendo la compatibilidad con el sistema de scraper.
 */
export const getYearlyConstants = (year: number, month: number = 1): YearlyConstants => {
  const data = YEARLY_DATA[String(year)] || YEARLY_DATA["2026"];
  const defaultHoras = getHorasMensualesTransition(year, month);
  const sundaySurcharge = getBaseSundaySurcharge(year, month);

  const isTransitionYear = year === 2026 || year === 2025;

  return {
    slmv: Number(data.slmv || data.salarioMinimoMensual || 0),
    uvt: Number(data.uvt || 0),
    auxTransporte: Number(
      data.auxTransporte ||
      data.salarioPagadoEmpleadorEjemplo?.["Subsidio de transporte"] ||
      0
    ),
    horasMensuales: isTransitionYear ? defaultHoras : Number(data.horasMensuales || defaultHoras),
    multipliers: {
      diurna: Number(data.multipliers?.diurna || GLOBAL_CONSTANTS.horasExtras.diurna),
      nocturna: Number(data.multipliers?.nocturna || GLOBAL_CONSTANTS.horasExtras.nocturna),
      recargoNocturno: Number(data.multipliers?.recargoNocturno || GLOBAL_CONSTANTS.horasExtras.recargoNocturno),
      festiva: isTransitionYear ? (1 + sundaySurcharge) : Number(data.multipliers?.festiva || (1 + sundaySurcharge)),
      festivaDiurna: isTransitionYear ? (1 + sundaySurcharge + 0.25) : Number(data.multipliers?.festivaDiurna || (1 + sundaySurcharge + 0.25)),
      festivaNocturna: isTransitionYear ? (1 + sundaySurcharge + 0.75) : Number(data.multipliers?.festivaNocturna || (1 + sundaySurcharge + 0.75)),
    },
    year: String(year),
  };
};

// Resolución 532 de 2024 - Esquema de Presunción de Costos
export const COSTOS_PRESUNTOS: Record<string, number> = {
  COMERCIO_MAYOR_MENOR: 75.9,
  EXPLOTACION_MINAS: 74,
  SECTOR_AGROPECUARIO: 73.9,
  ALOJAMIENTO_COMIDA: 71,
  INDUSTRIAS_MANUFACTURERAS: 70,
  EDUCACION: 68.3,
  CONSTRUCCION: 67.9,
  TRANSPORTE_ALMACENAMIENTO: 66.5,
  INMOBILIARIAS: 65.7,
  ARTISTICAS: 65.5,
  DEMAS_ACTIVIDADES: 64.7,
  SERVICIOS_ADMINISTRATIVOS: 64.2,
  OTRAS_ACTIVIDADES_SERVICIOS: 63.8,
  INFORMACION_COMUNICACION: 63.2,
  PROFESIONALES: 61.9,
  ATENCION_SALUD: 59.7,
  FINANCIERAS: 57.2,
  RENTISTAS_CAPITAL: 27.5,
  OTRA: 0,
};
