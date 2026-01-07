import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Colaborador } from "@src/domain/Colaborador.ts";
import { createEmptyColaborador } from "@src/domain/Colaborador.ts";
import * as ColaboradorService from "@src/application/services/ColaboradorService.ts";

export const useColaboradorStore = defineStore("colaborador", () => {
  const colaboradores = ref<Colaborador[]>([]);
  const selectedYear = ref<number>(2026);

  const colaborador = ref<Colaborador>(createEmptyColaborador());

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
    colaborador.value = createEmptyColaborador();
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
