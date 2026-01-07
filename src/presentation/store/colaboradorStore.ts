import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Colaborador } from "@src/domain/Colaborador.ts";
import { createEmptyColaborador } from "@src/domain/Colaborador.ts";
import * as ColaboradorService from "@src/application/services/ColaboradorService.ts";

export { MONEY_FORMAT as moneyFormatForComponent } from "@src/infrastructure/config/constants.ts";

export const useColaboradorStore = defineStore("colaborador", () => {
  const colaboradores = ref<Colaborador[]>([]);
  const selectedYear = ref<number>(2026);

  const colaborador = ref<Colaborador>(createEmptyColaborador());

  const colaboradoresTotal = computed(() =>
    ColaboradorService.calcularTotales(colaboradores.value)
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
    colaboradoresTotal,
    addColaborador,
    resetColaborador,
  };
});
