import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Colaborador } from "../../domain/Colaborador.ts";
import { ColaboradorService } from "../../application/services/ColaboradorService.ts";

export const useColaboradorStore = defineStore("colaborador", () => {
  const colaboradores = ref<Colaborador[]>([]);
  const colaborador = ref<Colaborador>({
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
    prestacion: {
      prima: null,
      vacaciones: null,
      cesantias: null,
      interesCesantias: null,
      totalPrestacion: null,
    },
    totalNeto: null,
    totalNomina: null,
  });

  const totalNomina = computed(() =>
    colaboradores.value.reduce((acc, c) => acc + (c.totalNomina || 0), 0)
  );

  const addColaborador = () => {
    if (!colaborador.value.cedula || !colaborador.value.nombre) return;
    // Business logic applied before saving

    const recalculatedColaborador = ColaboradorService.calcularColaborador(
      colaborador.value,
    );

    // colaborador.value.valorHoraOrdinaria = ColaboradorService.calcularValorHoraOrdinaria(colaborador.value);
    // colaborador.value.auxTransporte = ColaboradorService.calcularValorAuxTransporte(colaborador.value);
    // colaboradores.value.push({ ...colaborador.value });
    colaboradores.value.push(recalculatedColaborador);
    resetColaborador();
  };

  const resetColaborador = () => {
    colaborador.value = {
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
      prestacion: {
        prima: null,
        vacaciones: null,
        cesantias: null,
        interesCesantias: null,
        totalPrestacion: null,
      },
      totalNeto: null,
      totalNomina: null,
    };
  };

  return {
    colaboradores,
    colaborador,
    totalNomina,
    addColaborador,
    resetColaborador,
  };
});
