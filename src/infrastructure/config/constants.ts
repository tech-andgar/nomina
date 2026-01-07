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
 * Función que extrae las constantes de un año específico, 
 * manteniendo la compatibilidad con el sistema de scraper.
 */
export const getYearlyConstants = (year: number, month: number = 1): YearlyConstants => {
  const data = YEARLY_DATA[String(year)] || YEARLY_DATA["2026"];

  // Ley 2101 de 2021: Reducción Jornada Laboral
  // 2023: 47h -> ~235h
  // 2024: 46h -> ~230h
  // 2025: 44h -> ~220h
  // 2026: 42h -> 210h (Definitiva desde 15 Julio)

  // Default to full implementation for 2027+
  let defaultHorasMensuales = 210;

  if (year === 2026) {
    // Transition year 2026:
    // Jan - Jun (H1): 44 hours (approx 220 monthly)
    // Jul - Dec (H2): 42 hours (210 monthly)
    defaultHorasMensuales = month >= 7 ? 210 : 220;
  }
  else if (year === 2025) defaultHorasMensuales = 220;
  else if (year === 2024) defaultHorasMensuales = 230;
  else if (year === 2023) defaultHorasMensuales = 235;
  else if (year < 2023) defaultHorasMensuales = 240;


  // Base Surcharge Defaults (Pre-Reform / Standard)
  let baseSundaySurcharge = 0.75; // 75%

  // Logic for 2025/2026 Reform (Recargo Dominical)
  // Ley 2466 de 2024
  if (year >= 2027) {
    baseSundaySurcharge = 1.0; // 100% fully implemented
  } else if (year === 2026) {
    // 2026 H1: 80%
    // 2026 H2: 90%
    baseSundaySurcharge = month >= 7 ? 0.9 : 0.8;
  } else if (year === 2025) {
    baseSundaySurcharge = 0.8; // 80%
  }

  // Derived Multipliers per existing logic logic in constants
  // festiva = 1 + surcharge
  const defaultFestiva = 1 + baseSundaySurcharge;
  // festivaDiurna (Extra Diurna Dominical) = 1 + Surcharge + 0.25 (Extra Diurna)
  const defaultFestivaDiurna = 1 + baseSundaySurcharge + 0.25;
  // festivaNocturna (Extra Nocturna Dominical) = 1 + Surcharge + 0.75 (Extra Nocturna)
  const defaultFestivaNocturna = 1 + baseSundaySurcharge + 0.75;

  return {
    slmv: Number(data.slmv || data.salarioMinimoMensual || 0),
    uvt: Number(data.uvt || 0),
    auxTransporte: Number(
      data.auxTransporte ||
      data.salarioPagadoEmpleadorEjemplo?.["Subsidio de transporte"] ||
      0
    ),
    // For 2025 and 2026, we mandate the transition logic over static JSON data which might be outdated (e.g. flat 210 or 230)
    horasMensuales: (year === 2026 || year === 2025)
      ? defaultHorasMensuales
      : Number(data.horasMensuales || defaultHorasMensuales),
    multipliers: {
      diurna: Number(data.multipliers?.diurna || GLOBAL_CONSTANTS.horasExtras.diurna),
      nocturna: Number(data.multipliers?.nocturna || GLOBAL_CONSTANTS.horasExtras.nocturna),
      recargoNocturno: Number(data.multipliers?.recargoNocturno || GLOBAL_CONSTANTS.horasExtras.recargoNocturno),
      // Force logic for reform transition years
      festiva: (year === 2026 || year === 2025)
        ? defaultFestiva
        : Number(data.multipliers?.festiva || defaultFestiva),
      festivaDiurna: (year === 2026 || year === 2025)
        ? defaultFestivaDiurna
        : Number(data.multipliers?.festivaDiurna || defaultFestivaDiurna),
      festivaNocturna: (year === 2026 || year === 2025)
        ? defaultFestivaNocturna
        : Number(data.multipliers?.festivaNocturna || defaultFestivaNocturna),
    },
    year: String(year),
  };
};
