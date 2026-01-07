import type { Colaborador } from "@src/domain/Colaborador.ts";
import type { InfoEmpleador } from "@src/domain/Empleador.ts";
import { GLOBAL_CONSTANTS, getYearlyConstants } from "@src/infrastructure/config/constants.ts";
import type { YearlyConstants } from "@src/infrastructure/config/constants.ts";
import { TAX_TABLES, type TaxTable } from "@src/infrastructure/config/tax_tables.ts";

export function checkNotEmptyDataColaborador(colaborador: Colaborador): boolean {
  return (
    colaborador.sueldo !== null &&
    colaborador.cedula !== null &&
    colaborador.nombre !== "" &&
    colaborador.diasTrabajados !== null
  );
}

export function calcularValorHoraOrdinaria(colaborador: Colaborador, constants?: YearlyConstants): number | null {
  if (!colaborador.sueldo) return null;
  const divisor = constants?.horasMensuales ?? (GLOBAL_CONSTANTS.horasHabiles * GLOBAL_CONSTANTS.diasMes);
  return colaborador.sueldo / divisor;
}

export function calcularValorAuxTransporte(colaborador: Colaborador, constants: YearlyConstants): number | null {
  if (colaborador.sueldo === null || colaborador.diasTrabajados === null) return null;
  if (colaborador.sueldo === 0 || colaborador.diasTrabajados === 0) return 0;

  let auxTransporte = 0;
  if (colaborador.sueldo < constants.slmv * 2) {
    auxTransporte = (constants.auxTransporte / GLOBAL_CONSTANTS.diasMes) *
      colaborador.diasTrabajados;
  }
  return auxTransporte;
}

export function calcularValorExtrasDiurna(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
  constants?: YearlyConstants,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador, constants);
  const horasExtrasDiurna = colaborador.devengado.horasExtras.diurna;

  if (!valorHoraOrdinaria || !horasExtrasDiurna) return null;

  const factor = constants?.multipliers.diurna ?? GLOBAL_CONSTANTS.horasExtras.diurna;
  return valorHoraOrdinaria * horasExtrasDiurna * factor;
}

export function calcularValorExtrasNocturna(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
  constants?: YearlyConstants,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador, constants);
  const horasExtrasNocturna = colaborador.devengado.horasExtras.nocturna;

  if (!valorHoraOrdinaria || !horasExtrasNocturna) return null;

  const factor = constants?.multipliers.nocturna ?? GLOBAL_CONSTANTS.horasExtras.nocturna;
  return valorHoraOrdinaria * horasExtrasNocturna * factor;
}

export function calcularValorExtrasDomingos(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
  constants?: YearlyConstants,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador, constants);
  const horasExtrasDomingos = colaborador.devengado.horasExtras.domingos;

  if (!valorHoraOrdinaria || !horasExtrasDomingos) return null;

  const factor = constants?.multipliers.festivaDiurna ?? GLOBAL_CONSTANTS.horasExtras.domingos;
  return valorHoraOrdinaria * horasExtrasDomingos * factor;
}

export function calcularValorExtrasNocturnaDomingos(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
  constants?: YearlyConstants,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador, constants);
  const horasExtrasNocturnaDomingos =
    colaborador.devengado.horasExtras.nocturnaDomingos;

  if (
    !valorHoraOrdinaria || !horasExtrasNocturnaDomingos
  ) return null;

  const factor = constants?.multipliers.festivaNocturna ?? GLOBAL_CONSTANTS.horasExtras.nocturnaDomingos;
  return valorHoraOrdinaria * horasExtrasNocturnaDomingos * factor;
}

export function calcularValorRecargoNocturno(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
  constants?: YearlyConstants,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador, constants);
  const horasExtrasRecargoNocturno =
    colaborador.devengado.horasExtras.recargoNocturno;

  if (
    !valorHoraOrdinaria || !horasExtrasRecargoNocturno
  ) return null;

  const factor = constants?.multipliers.recargoNocturno ?? GLOBAL_CONSTANTS.horasExtras.recargoNocturno;
  return valorHoraOrdinaria * horasExtrasRecargoNocturno * factor;
}

export function calcularValorTotalExtrasValor(
  colaborador: Colaborador,
  constants?: YearlyConstants,
): number | null {
  const valorHora = calcularValorHoraOrdinaria(colaborador, constants);

  const diurna = calcularValorExtrasDiurna(colaborador, valorHora, constants) ?? 0;
  const nocturna = calcularValorExtrasNocturna(colaborador, valorHora, constants) ?? 0;
  const domingos = calcularValorExtrasDomingos(colaborador, valorHora, constants) ?? 0;
  const nocturnaDomingos = calcularValorExtrasNocturnaDomingos(
    colaborador,
    valorHora,
    constants,
  ) ?? 0;
  const recargoNocturno = calcularValorRecargoNocturno(colaborador, valorHora, constants) ?? 0;

  return (diurna + nocturna + domingos + nocturnaDomingos + recargoNocturno);
}

export function calcularValorSueldoBasico(colaborador: Colaborador): number | null {
  if (colaborador.sueldo === null || colaborador.diasTrabajados === null) return null;
  if (colaborador.sueldo === 0 || colaborador.diasTrabajados === 0) return 0;

  return (colaborador.sueldo / GLOBAL_CONSTANTS.diasMes) *
    colaborador.diasTrabajados;
}

export function calcularValorTotalDevengado(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const sueldoBasico = calcularValorSueldoBasico(colaborador);
  const totalValorExtras = calcularValorTotalExtrasValor(colaborador, constants);
  const auxTransporte = calcularValorAuxTransporte(colaborador, constants);

  if (sueldoBasico === null || totalValorExtras === null || auxTransporte === null) return null;

  return totalValorExtras + auxTransporte + sueldoBasico;
}

export function calcularValorIBC(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  const auxTransporte = calcularValorAuxTransporte(colaborador, constants);

  if (totalDevengado === null || auxTransporte === null) return null;

  return totalDevengado - auxTransporte;
}

export function calcularValorSaludColaborador(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;
  return (ibc * GLOBAL_CONSTANTS.salud.colaborador) / 100;
}

export function calcularValorPensionColaborador(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;
  return (ibc * GLOBAL_CONSTANTS.pension.colaborador) / 100;
}

export function calcularValorFondoSolidaridad(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  if (totalDevengado === null) return null;

  const slmv = constants.slmv;
  let fondoSolidaridad = 0;

  if (totalDevengado > 20 * slmv) {
    fondoSolidaridad = (totalDevengado * 2) / 100;
  } else if (
    totalDevengado >= 19 * slmv &&
    totalDevengado < 20 * slmv
  ) {
    fondoSolidaridad = (totalDevengado * 1.8) / 100;
  } else if (
    totalDevengado >= 18 * slmv &&
    totalDevengado < 19 * slmv
  ) {
    fondoSolidaridad = (totalDevengado * 1.6) / 100;
  } else if (
    totalDevengado >= 17 * slmv &&
    totalDevengado < 18 * slmv
  ) {
    fondoSolidaridad = (totalDevengado * 1.4) / 100;
  } else if (
    totalDevengado >= 16 * slmv &&
    totalDevengado < 17 * slmv
  ) {
    fondoSolidaridad = (totalDevengado * 1.2) / 100;
  } else if (
    totalDevengado >= 4 * slmv &&
    totalDevengado <= 16 * slmv
  ) {
    fondoSolidaridad = (totalDevengado * 1) / 100;
  }

  return fondoSolidaridad;
}

export function calcularValorUVT(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  const salud = calcularValorSaludColaborador(colaborador, constants);
  const pension = calcularValorPensionColaborador(colaborador, constants);
  const fondoSolidaridad = calcularValorFondoSolidaridad(colaborador, constants);

  if (totalDevengado === null || salud === null || pension === null || fondoSolidaridad === null) return null;

  const uvtValue = constants.uvt;

  // Optional Deductions
  let deduccionDependientes = 0;
  if (colaborador.deduccionesOpcionales?.dependientes) {
    const topeDependientes = 32 * uvtValue;
    deduccionDependientes = Math.min(totalDevengado * 0.10, topeDependientes);
  }

  let deduccionMedicina = 0;
  if (colaborador.deduccionesOpcionales?.medicinaPrepagadaMensual) {
    const topeMedicina = 16 * uvtValue;
    deduccionMedicina = Math.min(colaborador.deduccionesOpcionales.medicinaPrepagadaMensual, topeMedicina);
  }

  // Base for 25% Exemption = (Income - INCR - Deductions)
  // INCR = Salud + Pension + Fondo
  const baseDepurada = totalDevengado - salud - pension - fondoSolidaridad - deduccionDependientes - deduccionMedicina;

  // Apply 25% Exempt Income (Renta Exenta)
  // Note: There is also an annual cap for 25% (790 UVT), but we stick to monthly simplification for now
  const ingresoGravable = baseDepurada * 0.75;

  const uvt = ingresoGravable / uvtValue;

  return Number.parseFloat(uvt.toFixed(3));
}

// --- Tax Strategies ---



function calculateTaxFromTable(uvt: number, table: TaxTable): number {
  for (const bracket of table) {
    if (uvt >= bracket.threshold) {
      return (
        (uvt - bracket.subtractUVT) * bracket.rate + bracket.addedBaseUVT
      );
    }
  }
  return 0;
}

export function calcularValorRetefuente(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const uvt = calcularValorUVT(colaborador, constants);
  if (uvt === null) return null;

  const uvtValor = constants.uvt;
  const tipoTabla = colaborador.deduccionesOpcionales?.tipoTabla ?? "actual";

  // Default to actual if the type is somehow not found in our map
  const table = TAX_TABLES[tipoTabla] ?? TAX_TABLES.actual;

  const taxInUVT = calculateTaxFromTable(uvt, table);
  return taxInUVT * uvtValor;
}

export function calcularValorTotalDeducido(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const salud = calcularValorSaludColaborador(colaborador, constants);
  const pension = calcularValorPensionColaborador(colaborador, constants);
  const fondoSolidaridad = calcularValorFondoSolidaridad(colaborador, constants);
  const retefuente = calcularValorRetefuente(colaborador, constants);

  if (salud === null || pension === null || fondoSolidaridad === null || retefuente === null) return null;

  const totalDeducido = salud + pension + fondoSolidaridad + retefuente;

  return totalDeducido;
}

export function calcularValorTotalNeto(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  const totalDeducido = calcularValorTotalDeducido(colaborador, constants);

  if (totalDevengado === null || totalDeducido === null) return null;
  const totalNeto = totalDevengado - totalDeducido;

  return totalNeto;
}

/**
 * Determina si el empleador está exonerado de aportes parafiscales (SENA, ICBF) y Salud
 * según el Artículo 114-1 del Estatuto Tributario.
 * 
 * Requisitos para Exoneración:
 * 1. Persona Jurídica: Ingreso trabajador < 10 SMMLV.
 * 2. Persona Natural: Ingreso trabajador < 10 SMMLV Y tener 2 o más trabajadores vinculados.
 * 
 * @param empleador InfoEmpleador opcional. Si no se provee, se asume el caso general (Exonerado si < 10 SMMLV).
 */
export function isExoneradoParafiscales(colaborador: Colaborador, constants: YearlyConstants, empleador?: InfoEmpleador): boolean {
  // Regla 1: Persona Natural con menos de 2 trabajadores NUNCA está exonerada (Art 1.2.1.5.4.9 DUR 1625/2016)
  if (empleador?.tipo === 'PERSONA_NATURAL' && empleador.numeroTrabajadores < 2) {
    return false;
  }

  let totalDevengado = colaborador.devengado.totalDevengado;

  if (totalDevengado === null || totalDevengado === 0) {
    totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  }

  if (totalDevengado === null) return false;

  return totalDevengado < (10 * constants.slmv);
}

export function calcularValorSaludEmpleador(
  colaborador: Colaborador,
  constants: YearlyConstants,
  empleador?: InfoEmpleador
): number | null {
  if (isExoneradoParafiscales(colaborador, constants, empleador)) return 0;

  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesSalud = (ibc * GLOBAL_CONSTANTS.salud.empleador) / 100;

  return parafiscalesSalud;
}

export function calcularValorPensionEmpleador(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesPension = (ibc * GLOBAL_CONSTANTS.pension.empleador) / 100;

  return parafiscalesPension;
}

export function calcularValorARLEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesArl = (ibc * GLOBAL_CONSTANTS.parafiscal.arl) / 100;

  return parafiscalesArl;
}

export function calcularValorSENAEmpleador(colaborador: Colaborador, constants: YearlyConstants, empleador?: InfoEmpleador): number | null {
  if (isExoneradoParafiscales(colaborador, constants, empleador)) return 0;

  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesSena = (ibc * GLOBAL_CONSTANTS.parafiscal.sena) / 100;

  return parafiscalesSena;
}

export function calcularValorICBFEmpleador(colaborador: Colaborador, constants: YearlyConstants, empleador?: InfoEmpleador): number | null {
  if (isExoneradoParafiscales(colaborador, constants, empleador)) return 0;

  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesIcbf = (ibc * GLOBAL_CONSTANTS.parafiscal.icbf) / 100;

  return parafiscalesIcbf;
}

export function calcularValorCajaEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesCaja = (ibc * GLOBAL_CONSTANTS.parafiscal.cajas) / 100;

  return parafiscalesCaja;
}

export function calcularValorTotalParafiscales(
  colaborador: Colaborador,
  constants: YearlyConstants,
  empleador?: InfoEmpleador
): number | null {
  const salud = calcularValorSaludEmpleador(colaborador, constants, empleador);
  const pension = calcularValorPensionEmpleador(colaborador, constants);
  const arl = calcularValorARLEmpleador(colaborador, constants);
  const sena = calcularValorSENAEmpleador(colaborador, constants, empleador);
  const icbf = calcularValorICBFEmpleador(colaborador, constants, empleador);
  const cajas = calcularValorCajaEmpleador(colaborador, constants);

  if (salud === null || pension === null || arl === null || sena === null || icbf === null || cajas === null) return null;

  const totalParafiscales = salud + pension + arl + sena + icbf + cajas;

  return totalParafiscales;
}

export function calcularValorPrima(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const sueldoBasico = colaborador.devengado.sueldoBasico;
  const auxTransporte = calcularValorAuxTransporte(colaborador, constants);
  if (sueldoBasico === null || auxTransporte === null) return null;

  const prima =
    ((sueldoBasico + auxTransporte) * GLOBAL_CONSTANTS.prestacion.prima) / 100;

  return prima;
}

export function calcularValorVacaciones(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  if (totalDevengado === null) return null;

  const vacaciones = (totalDevengado * GLOBAL_CONSTANTS.prestacion.vacaciones) / 100;

  return vacaciones;
}

export function calcularValorCesantias(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  if (totalDevengado === null) return null;

  const cesantias =
    (totalDevengado * GLOBAL_CONSTANTS.prestacion.cesantias) / 100;

  return cesantias;
}

export function calcularValorInteresCesantias(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
  const cesantias = calcularValorCesantias(colaborador, constants);
  if (cesantias === null) return null;

  const interesCesantias =
    (cesantias * GLOBAL_CONSTANTS.prestacion.interesCesantias) / 100;

  return interesCesantias;
}

export function calcularValorTotalPrestacion(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const prima = calcularValorPrima(colaborador, constants);
  const vacaciones = calcularValorVacaciones(colaborador, constants);
  const cesantias = calcularValorCesantias(colaborador, constants);
  const interesCesantias = calcularValorInteresCesantias(colaborador, constants);

  if (prima === null || vacaciones === null || cesantias === null || interesCesantias === null) return null;

  const totalPrestacion = prima + vacaciones + cesantias +
    interesCesantias;

  return totalPrestacion;
}

export function calcularValorTotalNomina(colaborador: Colaborador, constants: YearlyConstants, empleador?: InfoEmpleador): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  const totalParafiscales = calcularValorTotalParafiscales(colaborador, constants, empleador);
  const totalPrestacion = calcularValorTotalPrestacion(colaborador, constants);

  if (totalDevengado === null || totalParafiscales === null || totalPrestacion === null) return null;

  const totalNomina = totalDevengado + totalParafiscales + totalPrestacion;

  return totalNomina;
}

/**
 * Recalculates all fields of a Colaborador and returns a new, updated object.
 * @param empleador Opcional: InfoEmpleador para cálculo preciso de exoneraciones.
 */
export function calcularColaborador(colaborador: Colaborador, optionalYear?: number, empleador?: InfoEmpleador): Colaborador {
  const constants = getYearlyConstants(optionalYear || 2026);

  const valorHoraOrdinaria = calcularValorHoraOrdinaria(colaborador, constants);
  const auxTransporte = calcularValorAuxTransporte(colaborador, constants);
  const sueldoBasico = calcularValorSueldoBasico(colaborador);
  const extrasDiurna = calcularValorExtrasDiurna(colaborador, valorHoraOrdinaria, constants);
  const extrasNocturna = calcularValorExtrasNocturna(colaborador, valorHoraOrdinaria, constants);
  const extrasDomingos = calcularValorExtrasDomingos(colaborador, valorHoraOrdinaria, constants);
  const extrasNocturnaDomingos = calcularValorExtrasNocturnaDomingos(
    colaborador,
    valorHoraOrdinaria,
    constants,
  );
  const recargoNocturno = calcularValorRecargoNocturno(colaborador, valorHoraOrdinaria, constants);
  const totalValorExtras = (extrasDiurna ?? 0) +
    (extrasNocturna ?? 0) +
    (extrasDomingos ?? 0) +
    (extrasNocturnaDomingos ?? 0) +
    (recargoNocturno ?? 0);
  const IBC = calcularValorIBC(colaborador, constants);
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);

  const saludColaborador = calcularValorSaludColaborador(colaborador, constants);
  const pensionColaborador = calcularValorPensionColaborador(
    colaborador,
    constants,
  );
  const fondoSolidaridad = calcularValorFondoSolidaridad(colaborador, constants);
  const UVT = calcularValorUVT(colaborador, constants);
  const retefuente = calcularValorRetefuente(colaborador, constants);
  const totalDeducido = calcularValorTotalDeducido(colaborador, constants);

  const saludEmpleador = calcularValorSaludEmpleador(colaborador, constants, empleador);
  const pensionEmpleador = calcularValorPensionEmpleador(colaborador, constants);
  const ARLEmpleador = calcularValorARLEmpleador(colaborador, constants);
  const SENAEmpleador = calcularValorSENAEmpleador(colaborador, constants, empleador);
  const ICBFEmpleador = calcularValorICBFEmpleador(colaborador, constants, empleador);
  const cajaEmpleador = calcularValorCajaEmpleador(colaborador, constants);
  const totalParafiscales = calcularValorTotalParafiscales(colaborador, constants, empleador);

  const prima = calcularValorPrima(colaborador, constants);
  const vacaciones = calcularValorVacaciones(colaborador, constants);
  const cesantias = calcularValorCesantias(colaborador, constants);
  const interesCesantias = calcularValorInteresCesantias(colaborador, constants);
  const totalPrestacion = calcularValorTotalPrestacion(colaborador, constants);

  const totalNeto = calcularValorTotalNeto(colaborador, constants);
  const totalNomina = calcularValorTotalNomina(colaborador, constants, empleador);

  return {
    ...colaborador,
    valorHoraOrdinaria: valorHoraOrdinaria,
    auxTransporte: auxTransporte,
    devengado: {
      ...colaborador.devengado,
      sueldoBasico: sueldoBasico,
      valorExtras: {
        diurna: extrasDiurna,
        nocturna: extrasNocturna,
        domingos: extrasDomingos,
        nocturnaDomingos: extrasNocturnaDomingos,
        recargoNocturno: recargoNocturno,
      },
      totalValorExtras: totalValorExtras,
      ibc: IBC,
      totalDevengado: totalDevengado,
    },
    deducido: {
      salud: saludColaborador,
      pension: pensionColaborador,
      fondoSolidaridad: fondoSolidaridad,
      uvt: UVT,
      retefuente: retefuente,
      totalDeducido: totalDeducido,
    },
    parafiscales: {
      salud: saludEmpleador,
      pension: pensionEmpleador,
      arl: ARLEmpleador,
      sena: SENAEmpleador,
      icbf: ICBFEmpleador,
      cajas: cajaEmpleador,
      totalParafiscales: totalParafiscales,
    },
    prestaciones: {
      prima: prima,
      vacaciones: vacaciones,
      cesantias: cesantias,
      interesCesantias: interesCesantias,
      totalPrestacion: totalPrestacion,
    },
    totalNeto: totalNeto,
    totalNomina: totalNomina,
  };
}

/**
 * Calcula los totales agregados para una lista de colaboradores.
 */
export function calcularTotales(colaboradores: Colaborador[]) {
  return colaboradores.reduce(
    (acc, c) => ({
      totalDevengado: acc.totalDevengado + (c.devengado.totalDevengado || 0),
      totalDeducido: acc.totalDeducido + (c.deducido.totalDeducido || 0),
      totalParafiscales: acc.totalParafiscales + (c.parafiscales.totalParafiscales || 0),
      totalPrestaciones: acc.totalPrestaciones + (c.prestaciones.totalPrestacion || 0),
      totalNeto: acc.totalNeto + (c.totalNeto || 0),
      totalNomina: acc.totalNomina + (c.totalNomina || 0),
    }),
    {
      totalDevengado: 0,
      totalDeducido: 0,
      totalParafiscales: 0,
      totalPrestaciones: 0,
      totalNeto: 0,
      totalNomina: 0,
    }
  );
}
