import { Colaborador } from "../../domain/Colaborador.ts";
import { CONSTANTS } from "../../infrastructure/config/constants.ts";

export class ColaboradorService {
  static checkNotEmptyDataColaborador(colaborador: Colaborador): true | false {
    return (
      !colaborador.sueldo &&
      !colaborador.cedula &&
      colaborador.nombre !== "" &&
      !colaborador.diasTrabajados
    );
  }

  static calcularValorHoraOrdinaria(colaborador: Colaborador): number | null {
    if (!colaborador.sueldo) return null;
    return colaborador.sueldo / (CONSTANTS.horasHabiles * CONSTANTS.diasMes);
  }

  static calcularValorAuxTransporte(colaborador: Colaborador): number | null {
    if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

    let auxTransporte = 0;
    if (colaborador.sueldo < CONSTANTS.slmv2023 * 2) {
      auxTransporte = (CONSTANTS.auxTransporte / CONSTANTS.diasMes) *
        colaborador.diasTrabajados;
    }
    return auxTransporte;
  }

  static calcularValorExtrasDiurna(colaborador: Colaborador): number | null {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasDiurna = colaborador.devengado.horasExtras.diurna;

    if (!valorHoraOrdinaria || !horasExtrasDiurna) return null;

    return valorHoraOrdinaria *
      horasExtrasDiurna * CONSTANTS.horasExtras.diurna;
  }

  static calcularValorExtrasNocturna(colaborador: Colaborador): number | null {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasNocturna = colaborador.devengado.horasExtras.nocturna;

    if (!valorHoraOrdinaria || !horasExtrasNocturna) return null;

    return valorHoraOrdinaria * horasExtrasNocturna *
      CONSTANTS.horasExtras.nocturna;
  }

  static calcularValorExtrasDomingos(colaborador: Colaborador): number | null {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasDomingos = colaborador.devengado.horasExtras.domingos;

    if (!valorHoraOrdinaria || !horasExtrasDomingos) return null;

    return valorHoraOrdinaria *
      horasExtrasDomingos *
      CONSTANTS.horasExtras.domingos;
  }

  static calcularValorExtrasNocturnaDomingos(
    colaborador: Colaborador,
  ): number | null {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasNocturnaDomingos =
      colaborador.devengado.horasExtras.nocturnaDomingos;

    if (
      !valorHoraOrdinaria || !horasExtrasNocturnaDomingos
    ) return null;

    return valorHoraOrdinaria *
      horasExtrasNocturnaDomingos *
      CONSTANTS.horasExtras.nocturnaDomingos;
  }

  static calcularValorRecargoNocturno(colaborador: Colaborador): number | null {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const horasExtrasRecargoNocturno =
      colaborador.devengado.horasExtras.recargoNocturno;

    if (
      !valorHoraOrdinaria || !horasExtrasRecargoNocturno
    ) return null;

    return valorHoraOrdinaria *
      horasExtrasRecargoNocturno *
      CONSTANTS.horasExtras.recargoNocturno;
  }

  // TODO: Need check perf because double call each
  static calcularValorTotalExtrasValor(
    colaborador: Colaborador,
  ): number | null {
    const diurna = this.calcularValorExtrasDiurna(colaborador) ?? 0;
    const nocturna = this.calcularValorExtrasNocturna(colaborador) ?? 0;
    const domingos = this.calcularValorExtrasDomingos(colaborador) ?? 0;
    const nocturnaDomingos = this.calcularValorExtrasNocturnaDomingos(
      colaborador,
    ) ?? 0;
    const recargoNocturno = this.calcularValorRecargoNocturno(colaborador) ?? 0;

    return (diurna + nocturna + domingos + nocturnaDomingos + recargoNocturno);
  }

  static calcularValorSueldoBasico(colaborador: Colaborador): number | null {
    if (!colaborador.sueldo || !colaborador.diasTrabajados) return null;

    return (colaborador.sueldo / CONSTANTS.diasMes) *
      colaborador.diasTrabajados;
  }

  static calcularValorTotalDevengado(colaborador: Colaborador): number | null {
    const sueldoBasico = this.calcularValorSueldoBasico(colaborador);
    const totalValorExtras = this.calcularValorTotalExtrasValor(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador);

    if (!sueldoBasico || !totalValorExtras || !auxTransporte) return null;

    return totalValorExtras + auxTransporte + sueldoBasico;
  }

  static calcularValorIBC(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador);

    if (!totalDevengado || !auxTransporte) return null;

    return totalDevengado - auxTransporte;
  }

  static calcularValorSaludColaborador(
    colaborador: Colaborador,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;
    return (ibc * CONSTANTS.salud.colaborador) / 100;
  }

  static calcularValorPensionColaborador(
    colaborador: Colaborador,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;
    return (ibc * CONSTANTS.pension.colaborador) / 100;
  }

  static calcularValorFondoSolidaridad(
    colaborador: Colaborador,
  ): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    if (!totalDevengado) return null;

    const slmv2023 = CONSTANTS.slmv2023;
    let fondoSolidaridad = 0;

    if (totalDevengado > 20 * slmv2023) {
      fondoSolidaridad = (totalDevengado * 2) / 100;
    } else if (
      totalDevengado >= 19 * slmv2023 &&
      totalDevengado < 20 * slmv2023
    ) {
      fondoSolidaridad = (totalDevengado * 1.8) / 100;
    } else if (
      totalDevengado >= 18 * slmv2023 &&
      totalDevengado < 19 * slmv2023
    ) {
      fondoSolidaridad = (totalDevengado * 1.6) / 100;
    } else if (
      totalDevengado >= 17 * slmv2023 &&
      totalDevengado < 18 * slmv2023
    ) {
      fondoSolidaridad = (totalDevengado * 1.4) / 100;
    } else if (
      totalDevengado >= 16 * slmv2023 &&
      totalDevengado < 17 * slmv2023
    ) {
      fondoSolidaridad = (totalDevengado * 1.2) / 100;
    } else if (
      totalDevengado >= 4 * slmv2023 &&
      totalDevengado <= 16 * slmv2023
    ) {
      fondoSolidaridad = (totalDevengado * 1) / 100;
    }

    return fondoSolidaridad;
  }

  static calcularValorUVT(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    const salud = this.calcularValorSaludColaborador(colaborador);
    const pension = this.calcularValorPensionColaborador(colaborador);
    const fondoSolidaridad = this.calcularValorFondoSolidaridad(colaborador);

    if (!totalDevengado || !salud || !pension || !fondoSolidaridad) return null;

    const uvt = ((totalDevengado - salud - pension - fondoSolidaridad) * 0.75) /
      CONSTANTS.uvt2023;

    return parseFloat(uvt.toFixed(3));
  }

  static calcularValorRetefuente(colaborador: Colaborador): number | null {
    const uvt = this.calcularValorUVT(colaborador);
    if (!uvt) return null;

    const uvtValor = CONSTANTS.uvt2023;
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

  static calcularValorTotalDeducido(colaborador: Colaborador): number | null {
    const salud = this.calcularValorSaludColaborador(colaborador);
    const pension = this.calcularValorSaludColaborador(colaborador);
    const fondoSolidaridad = this.calcularValorSaludColaborador(colaborador);
    const retefuente = this.calcularValorSaludColaborador(colaborador);

    if (!salud || !pension || !fondoSolidaridad || !retefuente) return null;

    const totalDeducido = salud + pension + fondoSolidaridad + retefuente;

    return totalDeducido;
  }

  static calcularValorTotalNeto(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    const totalDeducido = this.calcularValorTotalDeducido(colaborador);

    if (!totalDevengado || !totalDeducido) return null;
    const totalNeto = totalDevengado - totalDeducido;

    return totalNeto;
  }

  static calcularValorSaludEmpleador(
    colaborador: Colaborador,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesSalud = (ibc * CONSTANTS.salud.empleador) / 100;

    return parafiscalesSalud;
  }

  static calcularValorPensionEmpleador(
    colaborador: Colaborador,
  ): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesPension = (ibc * CONSTANTS.pension.empleador) / 100;

    return parafiscalesPension;
  }

  static calcularValorARLEmpleador(colaborador: Colaborador): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesArl = (ibc * CONSTANTS.parafiscal.arl) / 100;

    return parafiscalesArl;
  }

  static calcularValorSENAEmpleador(colaborador: Colaborador): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesSena = (ibc * CONSTANTS.parafiscal.sena) / 100;

    return parafiscalesSena;
  }

  static calcularValorICBFEmpleador(colaborador: Colaborador): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesIcbf = (ibc * CONSTANTS.parafiscal.icbf) / 100;

    return parafiscalesIcbf;
  }

  static calcularValorCajaEmpleador(colaborador: Colaborador): number | null {
    const ibc = this.calcularValorIBC(colaborador);
    if (!ibc) return null;

    const parafiscalesCaja = (ibc * CONSTANTS.parafiscal.cajas) / 100;

    return parafiscalesCaja;
  }

  static calcularValorTotalParafiscales(
    colaborador: Colaborador,
  ): number | null {
    const salud = this.calcularValorSaludEmpleador(colaborador);
    const pension = this.calcularValorPensionEmpleador(colaborador);
    const arl = this.calcularValorARLEmpleador(colaborador);
    const sena = this.calcularValorSENAEmpleador(colaborador);
    const icbf = this.calcularValorICBFEmpleador(colaborador);
    const cajas = this.calcularValorCajaEmpleador(colaborador);

    if (!salud || !pension || !arl || !sena || !icbf || !cajas) return null;

    const totalParafiscales = salud + pension + arl + sena + icbf + cajas;

    return totalParafiscales;
  }

  static calcularValorPrima(colaborador: Colaborador): number | null {
    const sueldoBasico = colaborador.devengado.sueldoBasico;
    const auxTransporte = this.calcularValorAuxTransporte(colaborador);
    if (!sueldoBasico || !auxTransporte) return null;

    const prima =
      ((sueldoBasico + auxTransporte) * CONSTANTS.prestacion.prima) / 100;

    return prima;
  }

  static calcularValorVacaciones(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    if (!totalDevengado) return null;

    const vacaciones = (totalDevengado * CONSTANTS.prestacion.vacaciones) / 100;

    return vacaciones;
    // colaborador.prestacion.vacaciones = (colaborador.devengado.sueldoBasico * colaborador.diasTrabajados) / 720
  }

  static calcularValorCesantias(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador);
    if (!totalDevengado || !auxTransporte) return null;

    const cesantias =
      ((totalDevengado + auxTransporte) * CONSTANTS.prestacion.cesantias) / 100;

    return cesantias;
  }

  static calcularValorInteresCesantias(
    colaborador: Colaborador,
  ): number | null {
    const cesantias = this.calcularValorCesantias(colaborador);
    if (!cesantias) return null;

    const interesCesantias =
      (cesantias * CONSTANTS.prestacion.interesCesantias) / 100;

    return interesCesantias;
  }

  static calcularValorTotalPrestacion(colaborador: Colaborador): number | null {
    const prima = this.calcularValorPrima(colaborador);
    const vacaciones = this.calcularValorVacaciones(colaborador);
    const cesantias = this.calcularValorCesantias(colaborador);
    const interesCesantias = this.calcularValorInteresCesantias(colaborador);

    if (!prima || !vacaciones || !cesantias || !interesCesantias) return null;

    const totalPrestacion = prima + vacaciones + cesantias +
      interesCesantias;

    return totalPrestacion;
  }

  static calcularValorTotalNomina(colaborador: Colaborador): number | null {
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);
    const totalParafiscales = this.calcularValorTotalParafiscales(colaborador);
    const totalPrestacion = this.calcularValorTotalPrestacion(colaborador);

    if (!totalDevengado || !totalParafiscales || !totalPrestacion) return null;

    const totalNomina = totalDevengado + totalParafiscales + totalPrestacion;

    return totalNomina;
  }

  /**
   * Recalculates all fields of a Colaborador and returns a new, updated object.
   */
  static calcularColaborador(colaborador: Colaborador): Colaborador {
    const valorHoraOrdinaria = this.calcularValorHoraOrdinaria(colaborador);
    const auxTransporte = this.calcularValorAuxTransporte(colaborador);
    const sueldoBasico = this.calcularValorSueldoBasico(colaborador);
    const extrasDiurna = this.calcularValorExtrasDiurna(colaborador);
    const extrasNocturna = this.calcularValorExtrasNocturna(colaborador);
    const extrasDomingos = this.calcularValorExtrasDomingos(colaborador);
    const extrasNocturnaDomingos = this.calcularValorExtrasNocturnaDomingos(
      colaborador,
    );
    const recargoNocturno = this.calcularValorRecargoNocturno(colaborador);
    const totalValorExtras = this.calcularValorTotalExtrasValor(colaborador);
    const IBC = this.calcularValorIBC(colaborador);
    const totalDevengado = this.calcularValorTotalDevengado(colaborador);

    const saludColaborador = this.calcularValorSaludColaborador(colaborador);
    const pensionColaborador = this.calcularValorPensionColaborador(
      colaborador,
    );
    const fondoSolidaridad = this.calcularValorFondoSolidaridad(colaborador);
    const UVT = this.calcularValorUVT(colaborador);
    const retefuente = this.calcularValorRetefuente(colaborador);
    const totalDeducido = this.calcularValorTotalDeducido(colaborador);

    const saludEmpleador = this.calcularValorSaludEmpleador(colaborador);
    const pensionEmpleador = this.calcularValorPensionEmpleador(colaborador);
    const ARLEmpleador = this.calcularValorARLEmpleador(colaborador);
    const SENAEmpleador = this.calcularValorSENAEmpleador(colaborador);
    const ICBFEmpleador = this.calcularValorICBFEmpleador(colaborador);
    const cajaEmpleador = this.calcularValorCajaEmpleador(colaborador);
    const totalParafiscales = this.calcularValorTotalParafiscales(colaborador);

    const prima = this.calcularValorPrima(colaborador);
    const vacaciones = this.calcularValorVacaciones(colaborador);
    const cesantias = this.calcularValorCesantias(colaborador);
    const interesCesantias = this.calcularValorInteresCesantias(colaborador);
    const totalPrestacion = this.calcularValorTotalPrestacion(colaborador);

    const totalNeto = this.calcularValorTotalNeto(colaborador);
    const totalNomina = this.calcularValorTotalNomina(colaborador);

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
