import type { Colaborador } from "../../domain/Colaborador.ts";
import { GLOBAL_CONSTANTS, YearlyConstants, getYearlyConstants } from "../../infrastructure/config/constants.ts";

export function checkNotEmptyDataColaborador(colaborador: Colaborador): boolean {
  return (
    colaborador.sueldo !== null &&
    colaborador.cedula !== null &&
    colaborador.nombre !== "" &&
    colaborador.diasTrabajados !== null
  );
}

export function calcularValorHoraOrdinaria(colaborador: Colaborador): number | null {
  if (!colaborador.sueldo) return null;
  return colaborador.sueldo / (GLOBAL_CONSTANTS.horasHabiles * GLOBAL_CONSTANTS.diasMes);
}

export function calcularValorAuxTransporte(colaborador: Colaborador, constants: YearlyConstants): number | null {
  if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

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
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador);
  const horasExtrasDiurna = colaborador.devengado.horasExtras.diurna;

  if (!valorHoraOrdinaria || !horasExtrasDiurna) return null;

  return valorHoraOrdinaria *
    horasExtrasDiurna * GLOBAL_CONSTANTS.horasExtras.diurna;
}

export function calcularValorExtrasNocturna(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador);
  const horasExtrasNocturna = colaborador.devengado.horasExtras.nocturna;

  if (!valorHoraOrdinaria || !horasExtrasNocturna) return null;

  return valorHoraOrdinaria * horasExtrasNocturna *
    GLOBAL_CONSTANTS.horasExtras.nocturna;
}

export function calcularValorExtrasDomingos(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador);
  const horasExtrasDomingos = colaborador.devengado.horasExtras.domingos;

  if (!valorHoraOrdinaria || !horasExtrasDomingos) return null;

  return valorHoraOrdinaria *
    horasExtrasDomingos *
    GLOBAL_CONSTANTS.horasExtras.domingos;
}

export function calcularValorExtrasNocturnaDomingos(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador);
  const horasExtrasNocturnaDomingos =
    colaborador.devengado.horasExtras.nocturnaDomingos;

  if (
    !valorHoraOrdinaria || !horasExtrasNocturnaDomingos
  ) return null;

  return valorHoraOrdinaria *
    horasExtrasNocturnaDomingos *
    GLOBAL_CONSTANTS.horasExtras.nocturnaDomingos;
}

export function calcularValorRecargoNocturno(
  colaborador: Colaborador,
  optionalValorHora?: number | null,
): number | null {
  const valorHoraOrdinaria = optionalValorHora ?? calcularValorHoraOrdinaria(colaborador);
  const horasExtrasRecargoNocturno =
    colaborador.devengado.horasExtras.recargoNocturno;

  if (
    !valorHoraOrdinaria || !horasExtrasRecargoNocturno
  ) return null;

  return valorHoraOrdinaria *
    horasExtrasRecargoNocturno *
    GLOBAL_CONSTANTS.horasExtras.recargoNocturno;
}

export function calcularValorTotalExtrasValor(
  colaborador: Colaborador,
): number | null {
  const valorHora = calcularValorHoraOrdinaria(colaborador);

  const diurna = calcularValorExtrasDiurna(colaborador, valorHora) ?? 0;
  const nocturna = calcularValorExtrasNocturna(colaborador, valorHora) ?? 0;
  const domingos = calcularValorExtrasDomingos(colaborador, valorHora) ?? 0;
  const nocturnaDomingos = calcularValorExtrasNocturnaDomingos(
    colaborador,
    valorHora,
  ) ?? 0;
  const recargoNocturno = calcularValorRecargoNocturno(colaborador, valorHora) ?? 0;

  return (diurna + nocturna + domingos + nocturnaDomingos + recargoNocturno);
}

export function calcularValorSueldoBasico(colaborador: Colaborador): number | null {
  if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

  return (colaborador.sueldo / GLOBAL_CONSTANTS.diasMes) *
    colaborador.diasTrabajados;
}

export function calcularValorTotalDevengado(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const sueldoBasico = calcularValorSueldoBasico(colaborador);
  const totalValorExtras = calcularValorTotalExtrasValor(colaborador);
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
  const uvt = ((totalDevengado - salud - pension - fondoSolidaridad) * 0.75) /
    uvtValue;

  return Number.parseFloat(uvt.toFixed(3));
}

export function calcularValorRetefuente(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const uvt = calcularValorUVT(colaborador, constants);
  if (uvt === null) return null;

  const uvtValor = constants.uvt;
  let retefuente = 0;

  if (uvt >= 1140) {
    retefuente = (uvt * 0.37 + 341) * uvtValor;
  } else if (uvt >= 640) {
    retefuente = (uvt * 0.35 + 166) * uvtValor;
  } else if (uvt >= 350) {
    retefuente = (uvt * 0.33 + 70) * uvtValor;
  } else if (uvt >= 140) {
    retefuente = (uvt * 0.28 + 11) * uvtValor;
  } else if (uvt >= 85) {
    retefuente = uvt * 0.19 * uvtValor;
  }

  return retefuente;
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

export function calcularValorSaludEmpleador(
  colaborador: Colaborador,
  constants: YearlyConstants,
): number | null {
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

export function calcularValorSENAEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const ibc = calcularValorIBC(colaborador, constants);
  if (ibc === null) return null;

  const parafiscalesSena = (ibc * GLOBAL_CONSTANTS.parafiscal.sena) / 100;

  return parafiscalesSena;
}

export function calcularValorICBFEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
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
): number | null {
  const salud = calcularValorSaludEmpleador(colaborador, constants);
  const pension = calcularValorPensionEmpleador(colaborador, constants);
  const arl = calcularValorARLEmpleador(colaborador, constants);
  const sena = calcularValorSENAEmpleador(colaborador, constants);
  const icbf = calcularValorICBFEmpleador(colaborador, constants);
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

export function calcularValorTotalNomina(colaborador: Colaborador, constants: YearlyConstants): number | null {
  const totalDevengado = calcularValorTotalDevengado(colaborador, constants);
  const totalParafiscales = calcularValorTotalParafiscales(colaborador, constants);
  const totalPrestacion = calcularValorTotalPrestacion(colaborador, constants);

  if (totalDevengado === null || totalParafiscales === null || totalPrestacion === null) return null;

  const totalNomina = totalDevengado + totalParafiscales + totalPrestacion;

  return totalNomina;
}

/**
 * Recalculates all fields of a Colaborador and returns a new, updated object.
 */
export function calcularColaborador(colaborador: Colaborador, optionalYear?: number): Colaborador {
  const constants = getYearlyConstants(optionalYear || 2026);

  const valorHoraOrdinaria = calcularValorHoraOrdinaria(colaborador);
  const auxTransporte = calcularValorAuxTransporte(colaborador, constants);
  const sueldoBasico = calcularValorSueldoBasico(colaborador);
  const extrasDiurna = calcularValorExtrasDiurna(colaborador, valorHoraOrdinaria);
  const extrasNocturna = calcularValorExtrasNocturna(colaborador, valorHoraOrdinaria);
  const extrasDomingos = calcularValorExtrasDomingos(colaborador, valorHoraOrdinaria);
  const extrasNocturnaDomingos = calcularValorExtrasNocturnaDomingos(
    colaborador,
    valorHoraOrdinaria,
  );
  const recargoNocturno = calcularValorRecargoNocturno(colaborador, valorHoraOrdinaria);
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

  const saludEmpleador = calcularValorSaludEmpleador(colaborador, constants);
  const pensionEmpleador = calcularValorPensionEmpleador(colaborador, constants);
  const ARLEmpleador = calcularValorARLEmpleador(colaborador, constants);
  const SENAEmpleador = calcularValorSENAEmpleador(colaborador, constants);
  const ICBFEmpleador = calcularValorICBFEmpleador(colaborador, constants);
  const cajaEmpleador = calcularValorCajaEmpleador(colaborador, constants);
  const totalParafiscales = calcularValorTotalParafiscales(colaborador, constants);

  const prima = calcularValorPrima(colaborador, constants);
  const vacaciones = calcularValorVacaciones(colaborador, constants);
  const cesantias = calcularValorCesantias(colaborador, constants);
  const interesCesantias = calcularValorInteresCesantias(colaborador, constants);
  const totalPrestacion = calcularValorTotalPrestacion(colaborador, constants);

  const totalNeto = calcularValorTotalNeto(colaborador, constants);
  const totalNomina = calcularValorTotalNomina(colaborador, constants);

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
    prestacion: {
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
