/**
 * Objeto que contiene constantes utilizadas para cálculos laborales.
 */
export const CONSTANTS = {
  /**
   * Horas hábiles diarias.
   */
  horasHabiles: 8,
  /**
   * Días en un mes (para cálculos generales).
   */
  diasMes: 30,
  /**
   * Factores para el cálculo de horas extras.
   */
  horasExtras: {
    /**
     * Factor para horas extras diurnas.
     */
    diurna: 1.25,
    /**
     * Factor para horas extras nocturnas.
     */
    nocturna: 1.75,
    /**
     * Factor para horas extras en domingos.
     */
    domingos: 2,
    /**
     * Factor para horas extras nocturnas en domingos.
     */
    nocturnaDomingos: 2.5,
    /**
     * Factor para recargo nocturno adicional.
     */
    recargoNocturno: 1.35,
  },
  /**
   * Salario mínimo legal vigente para 2023.
   */
  slmv2023: 1300000,
  /**
   * Valor de la Unidad de Valor Tributario (UVT) para 2023.
   */
  uvt2023: 42412,
  /**
   * Auxilio de transporte.
   */
  auxTransporte: 162000,
  /**
   * Porcentajes de salud.
   */
  salud: {
    /**
     * Porcentaje de salud que paga el colaborador.
     */
    colaborador: 4,
    /**
     * Porcentaje de salud que paga el empleador.
     */
    empleador: 8.5,
  },
  /**
   * Porcentajes de pensión.
   */
  pension: {
    /**
     * Porcentaje de pensión que paga el colaborador.
     */
    colaborador: 4,
    /**
     * Porcentaje de pensión que paga el empleador.
     */
    empleador: 12,
  },
  /**
   * Porcentajes de parafiscales.
   */
  parafiscal: {
    /**
     * Porcentaje de ARL.
     */
    arl: 0.522,
    /**
     * Porcentaje de SENA.
     */
    sena: 2,
    /**
     * Porcentaje de ICBF.
     */
    icbf: 3,
    /**
     * Porcentaje de Cajas de Compensación Familiar.
     */
    cajas: 4,
  },
  /**
   * Porcentajes para el cálculo de prestaciones sociales.
   */
  prestacion: {
    /**
     * Porcentaje para el cálculo de prima.
     */
    prima: 8.333333,
    /**
     * Porcentaje para el cálculo de vacaciones.
     */
    vacaciones: 4.17,
    /**
     * Porcentaje para el cálculo de cesantías.
     */
    cesantias: 8.333333,
    /**
     * Porcentaje para el cálculo de intereses de cesantías.
     */
    interesCesantias: 1,
  },
};
