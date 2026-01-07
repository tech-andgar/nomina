import { Colaborador } from "../../domain/Colaborador.ts";
import { GLOBAL_CONSTANTS, YearlyConstants, getYearlyConstants } from "../../infrastructure/config/constants.ts";

export class ColaboradorService {
  static checkNotEmptyDataColaborador(colaborador: Colaborador): boolean {
    return (
      colaborador.sueldo !== null &&
      colaborador.cedula !== null &&
      colaborador.nombre !== "" &&
      colaborador.diasTrabajados !== null
    );
  }

  static calcularValorHoraOrdinaria(colaborador: Colaborador): number | null {
    if (!colaborador.sueldo) return null;
    return colaborador.sueldo / (GLOBAL_CONSTANTS.horasHabiles * GLOBAL_CONSTANTS.diasMes);
  }

  static calcularValorAuxTransporte(colaborador: Colaborador, constants: YearlyConstants): number | null {
    if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

    let auxTransporte = 0;
    if (colaborador.sueldo < constants.slmv * 2) {
      auxTransporte = (constants.auxTransporte / GLOBAL_CONSTANTS.diasMes) *
        colaborador.diasTrabajados;
    }
    return auxTransporte;
  }

  static calcularValorExtrasDiurna(
    colaborador: Colaborador,
    optionalValorHora?: number | null,
  ): number | null {
    const valorHoraOrdinaria = optionalValorHora ?? this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasDiurna = colaborador.devengado.horasExtras.diurna;

    if (!valorHoraOrdinaria || !horasExtrasDiurna) return null;

    return valorHoraOrdinaria *
      horasExtrasDiurna * GLOBAL_CONSTANTS.horasExtras.diurna;
  }

  static calcularValorExtrasNocturna(
    colaborador: Colaborador,
    optionalValorHora?: number | null,
  ): number | null {
    const valorHoraOrdinaria = optionalValorHora ?? this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasNocturna = colaborador.devengado.horasExtras.nocturna;

    if (!valorHoraOrdinaria || !horasExtrasNocturna) return null;

    return valorHoraOrdinaria * horasExtrasNocturna *
      GLOBAL_CONSTANTS.horasExtras.nocturna;
  }

  static calcularValorExtrasDomingos(
    colaborador: Colaborador,
    optionalValorHora?: number | null,
  ): number | null {
    const valorHoraOrdinaria = optionalValorHora ?? this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasDomingos = colaborador.devengado.horasExtras.domingos;

    if (!valorHoraOrdinaria || !horasExtrasDomingos) return null;

    return valorHoraOrdinaria *
      horasExtrasDomingos *
      GLOBAL_CONSTANTS.horasExtras.domingos;
  }

  static calcularValorExtrasNocturnaDomingos(
    colaborador: Colaborador,
    optionalValorHora?: number | null,
  ): number | null {
    const valorHoraOrdinaria = optionalValorHora ?? this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasNocturnaDomingos =
      colaborador.devengado.horasExtras.nocturnaDomingos;

    if (
      !valorHoraOrdinaria || !horasExtrasNocturnaDomingos
    ) return null;

    return valorHoraOrdinaria *
      horasExtrasNocturnaDomingos *
      GLOBAL_CONSTANTS.horasExtras.nocturnaDomingos;
  }

  static calcularValorRecargoNocturno(
    colaborador: Colaborador,
    optionalValorHora?: number | null,
  ): number | null {
    const valorHoraOrdinaria = optionalValorHora ?? this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasRecargoNocturno =
      colaborador.devengado.horasExtras.recargoNocturno;

    if (
      !valorHoraOrdinaria || !horasExtrasRecargoNocturno
    ) return null;

    return valorHoraOrdinaria *
      horasExtrasRecargoNocturno *
      GLOBAL_CONSTANTS.horasExtras.recargoNocturno;
  }

  static calcularValorTotalExtrasValor(
    colaborador: Colaborador,
  ): number | null {
    const valorHora = this.calcularValorHoraOrdinaria(colaborador);

    const diurna = this.calcularValorExtrasDiurna(colaborador, valorHora) ?? 0;
    const nocturna = this.calcularValorExtrasNocturna(colaborador, valorHora) ?? 0;
    const domingos = this.calcularValorExtrasDomingos(colaborador, valorHora) ?? 0;
    const nocturnaDomingos = this.calcularValorExtrasNocturnaDomingos(
      colaborador,
      valorHora,
    ) ?? 0;
    const recargoNocturno = this.calcularValorRecargoNocturno(colaborador, valorHora) ?? 0;

    return (diurna + nocturna + domingos + nocturnaDomingos + recargoNocturno);
  }

  static calcularValorSueldoBasico(colaborador: Colaborador): number | null {
    if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

    return (colaborador.sueldo / GLOBAL_CONSTANTS.diasMes) *
      colaborador.diasTrabajados;
  }

  static calcularValorTotalDevengado(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const sueldoBasico = this.calcularValorSueldoBasico(colaborador);
    const totalValorExtras = this.calcularValorTotalExtrasValor(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador, constants);

    if (sueldoBasico === null || totalValorExtras === null || auxTransporte === null) return null;

    return totalValorExtras + auxTransporte + sueldoBasico;
  }

  static calcularValorIBC(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador, constants);

    if (totalDevengado === null || auxTransporte === null) return null;

    return totalDevengado - auxTransporte;
  }

  static calcularValorSaludColaborador(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;
    return (ibc * GLOBAL_CONSTANTS.salud.colaborador) / 100;
  }

  static calcularValorPensionColaborador(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;
    return (ibc * GLOBAL_CONSTANTS.pension.colaborador) / 100;
  }

  static calcularValorFondoSolidaridad(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
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

  static calcularValorUVT(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    const salud = this.calcularValorSaludColaborador(colaborador, constants);
    const pension = this.calcularValorPensionColaborador(colaborador, constants);
    const fondoSolidaridad = this.calcularValorFondoSolidaridad(colaborador, constants);

    if (totalDevengado === null || salud === null || pension === null || fondoSolidaridad === null) return null;

    const uvtValue = constants.uvt;
    const uvt = ((totalDevengado - salud - pension - fondoSolidaridad) * 0.75) /
      uvtValue;

    return Number.parseFloat(uvt.toFixed(3));
  }

  static calcularValorRetefuente(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const uvt = this.calcularValorUVT(colaborador, constants);
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

  static calcularValorTotalDeducido(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const salud = this.calcularValorSaludColaborador(colaborador, constants);
    const pension = this.calcularValorPensionColaborador(colaborador, constants);
    const fondoSolidaridad = this.calcularValorFondoSolidaridad(colaborador, constants);
    const retefuente = this.calcularValorRetefuente(colaborador, constants);

    if (salud === null || pension === null || fondoSolidaridad === null || retefuente === null) return null;

    const totalDeducido = salud + pension + fondoSolidaridad + retefuente;

    return totalDeducido;
  }

  static calcularValorTotalNeto(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    const totalDeducido = this.calcularValorTotalDeducido(colaborador, constants);

    if (totalDevengado === null || totalDeducido === null) return null;
    const totalNeto = totalDevengado - totalDeducido;

    return totalNeto;
  }

  static calcularValorSaludEmpleador(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesSalud = (ibc * GLOBAL_CONSTANTS.salud.empleador) / 100;

    return parafiscalesSalud;
  }

  static calcularValorPensionEmpleador(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesPension = (ibc * GLOBAL_CONSTANTS.pension.empleador) / 100;

    return parafiscalesPension;
  }

  static calcularValorARLEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesArl = (ibc * GLOBAL_CONSTANTS.parafiscal.arl) / 100;

    return parafiscalesArl;
  }

  static calcularValorSENAEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesSena = (ibc * GLOBAL_CONSTANTS.parafiscal.sena) / 100;

    return parafiscalesSena;
  }

  static calcularValorICBFEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesIcbf = (ibc * GLOBAL_CONSTANTS.parafiscal.icbf) / 100;

    return parafiscalesIcbf;
  }

  static calcularValorCajaEmpleador(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const ibc = this.calcularValorIBC(colaborador, constants);
    if (ibc === null) return null;

    const parafiscalesCaja = (ibc * GLOBAL_CONSTANTS.parafiscal.cajas) / 100;

    return parafiscalesCaja;
  }

  static calcularValorTotalParafiscales(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const salud = this.calcularValorSaludEmpleador(colaborador, constants);
    const pension = this.calcularValorPensionEmpleador(colaborador, constants);
    const arl = this.calcularValorARLEmpleador(colaborador, constants);
    const sena = this.calcularValorSENAEmpleador(colaborador, constants);
    const icbf = this.calcularValorICBFEmpleador(colaborador, constants);
    const cajas = this.calcularValorCajaEmpleador(colaborador, constants);

    if (salud === null || pension === null || arl === null || sena === null || icbf === null || cajas === null) return null;

    const totalParafiscales = salud + pension + arl + sena + icbf + cajas;

    return totalParafiscales;
  }

  static calcularValorPrima(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const sueldoBasico = colaborador.devengado.sueldoBasico;
    const auxTransporte = this.calcularValorAuxTransporte(colaborador, constants);
    if (sueldoBasico === null || auxTransporte === null) return null;

    const prima =
      ((sueldoBasico + auxTransporte) * GLOBAL_CONSTANTS.prestacion.prima) / 100;

    return prima;
  }

  static calcularValorVacaciones(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    if (totalDevengado === null) return null;

    const vacaciones = (totalDevengado * GLOBAL_CONSTANTS.prestacion.vacaciones) / 100;

    return vacaciones;
  }

  static calcularValorCesantias(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    if (totalDevengado === null) return null;

    const cesantias =
      (totalDevengado * GLOBAL_CONSTANTS.prestacion.cesantias) / 100;

    return cesantias;
  }

  static calcularValorInteresCesantias(
    colaborador: Colaborador,
    constants: YearlyConstants,
  ): number | null {
    const cesantias = this.calcularValorCesantias(colaborador, constants);
    if (cesantias === null) return null;

    const interesCesantias =
      (cesantias * GLOBAL_CONSTANTS.prestacion.interesCesantias) / 100;

    return interesCesantias;
  }

  static calcularValorTotalPrestacion(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const prima = this.calcularValorPrima(colaborador, constants);
    const vacaciones = this.calcularValorVacaciones(colaborador, constants);
    const cesantias = this.calcularValorCesantias(colaborador, constants);
    const interesCesantias = this.calcularValorInteresCesantias(colaborador, constants);

    if (prima === null || vacaciones === null || cesantias === null || interesCesantias === null) return null;

    const totalPrestacion = prima + vacaciones + cesantias +
      interesCesantias;

    return totalPrestacion;
  }

  static calcularValorTotalNomina(colaborador: Colaborador, constants: YearlyConstants): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);
    const totalParafiscales = this.calcularValorTotalParafiscales(colaborador, constants);
    const totalPrestacion = this.calcularValorTotalPrestacion(colaborador, constants);

    if (totalDevengado === null || totalParafiscales === null || totalPrestacion === null) return null;

    const totalNomina = totalDevengado + totalParafiscales + totalPrestacion;

    return totalNomina;
  }

  /**
   * Recalculates all fields of a Colaborador and returns a new, updated object.
   */
  static calcularColaborador(colaborador: Colaborador, optionalYear?: number): Colaborador {
    const constants = getYearlyConstants(optionalYear || 2026);

    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador, constants);
    const sueldoBasico = this.calcularValorSueldoBasico(colaborador);
    const extrasDiurna = this.calcularValorExtrasDiurna(colaborador, valorHoraOrdinaria);
    const extrasNocturna = this.calcularValorExtrasNocturna(colaborador, valorHoraOrdinaria);
    const extrasDomingos = this.calcularValorExtrasDomingos(colaborador, valorHoraOrdinaria);
    const extrasNocturnaDomingos = this.calcularValorExtrasNocturnaDomingos(
      colaborador,
      valorHoraOrdinaria,
    );
    const recargoNocturno = this.calcularValorRecargoNocturno(colaborador, valorHoraOrdinaria);
    const totalValorExtras = (extrasDiurna ?? 0) +
      (extrasNocturna ?? 0) +
      (extrasDomingos ?? 0) +
      (extrasNocturnaDomingos ?? 0) +
      (recargoNocturno ?? 0);
    const IBC = this.calcularValorIBC(colaborador, constants);
    const totalDevengado = this.calcularValorTotalDevengado(colaborador, constants);

    const saludColaborador = this.calcularValorSaludColaborador(colaborador, constants);
    const pensionColaborador = this.calcularValorPensionColaborador(
      colaborador,
      constants,
    );
    const fondoSolidaridad = this.calcularValorFondoSolidaridad(colaborador, constants);
    const UVT = this.calcularValorUVT(colaborador, constants);
    const retefuente = this.calcularValorRetefuente(colaborador, constants);
    const totalDeducido = this.calcularValorTotalDeducido(colaborador, constants);

    const saludEmpleador = this.calcularValorSaludEmpleador(colaborador, constants);
    const pensionEmpleador = this.calcularValorPensionEmpleador(colaborador, constants);
    const ARLEmpleador = this.calcularValorARLEmpleador(colaborador, constants);
    const SENAEmpleador = this.calcularValorSENAEmpleador(colaborador, constants);
    const ICBFEmpleador = this.calcularValorICBFEmpleador(colaborador, constants);
    const cajaEmpleador = this.calcularValorCajaEmpleador(colaborador, constants);
    const totalParafiscales = this.calcularValorTotalParafiscales(colaborador, constants);

    const prima = this.calcularValorPrima(colaborador, constants);
    const vacaciones = this.calcularValorVacaciones(colaborador, constants);
    const cesantias = this.calcularValorCesantias(colaborador, constants);
    const interesCesantias = this.calcularValorInteresCesantias(colaborador, constants);
    const totalPrestacion = this.calcularValorTotalPrestacion(colaborador, constants);

    const totalNeto = this.calcularValorTotalNeto(colaborador, constants);
    const totalNomina = this.calcularValorTotalNomina(colaborador, constants);

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
}
