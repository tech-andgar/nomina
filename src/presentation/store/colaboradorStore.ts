import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Colaborador } from "../../domain/Colaborador.ts";
import * as ColaboradorService from "../../application/services/ColaboradorService.ts";

export const useColaboradorStore = defineStore("colaborador", () => {
  const colaboradores = ref<Colaborador[]>([]);
  const selectedYear = ref<number>(2026);

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
    if (!ColaboradorService.checkNotEmptyDataColaborador(colaborador.value)) return;

    const recalculatedColaborador = ColaboradorService.calcularColaborador(
      colaborador.value,
      selectedYear.value
    );

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

  // Recalculate all colaboradores when the year changes
  watch(selectedYear, (newYear) => {
    colaboradores.value = colaboradores.value.map(c =>
      ColaboradorService.calcularColaborador(c, newYear)
    );
  });

  return {
    colaboradores,
    colaborador,
    selectedYear,
    totalNomina,
    addColaborador,
    resetColaborador,
  };
});
