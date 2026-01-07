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
  },
  // Porcentajes de pensión.
  pension: {
    // Porcentaje de pensión que paga el colaborador.
    colaborador: 4,
    // Porcentaje de pensión que paga el empleador.
    empleador: 12,
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

// Interfaz para el tipado de constantes anuales
export interface YearlyConstants {
  slmv: number;
  uvt: number;
  auxTransporte: number;
}

interface RawYearlyDataEntry {
  slmv?: number;
  salarioMinimoMensual?: number | string;
  uvt?: number | string;
  auxTransporte?: number | string;
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
export const getYearlyConstants = (year: number): YearlyConstants => {
  const data = YEARLY_DATA[String(year)] || YEARLY_DATA["2026"];

  return {
    slmv: Number(data.slmv || data.salarioMinimoMensual || 0),
    uvt: Number(data.uvt || 0),
    auxTransporte: Number(
      data.auxTransporte ||
      data.salarioPagadoEmpleadorEjemplo?.["Subsidio de transporte"] ||
      0
    ),
  };
};
