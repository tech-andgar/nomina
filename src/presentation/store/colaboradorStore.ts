import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { Colaborador } from "@src/domain/Colaborador.ts";
import { createEmptyColaborador } from "@src/domain/Colaborador.ts";
import type { InfoEmpleador } from "@src/domain/Empleador.ts";
import * as ColaboradorService from "@src/application/services/ColaboradorService.ts";

export { MONEY_FORMAT as moneyFormatForComponent } from "@src/infrastructure/config/constants.ts";

export const useColaboradorStore = defineStore("colaborador", () => {
  const colaboradores = ref<Colaborador[]>([]);
  const selectedYear = ref<number>(2026);

  const colaborador = ref<Colaborador>(createEmptyColaborador());

  // Default to Persona Jurídica (Exempt by default if < 10 SLMV)
  const empleador = ref<InfoEmpleador>({
    tipo: 'PERSONA_JURIDICA',
    numeroTrabajadores: 10
  });

  const colaboradoresTotal = computed(() =>
    ColaboradorService.calcularTotales(colaboradores.value)
  );

  const addColaborador = () => {
    if (!ColaboradorService.checkNotEmptyDataColaborador(colaborador.value)) return;

    const recalculatedColaborador = ColaboradorService.calcularColaborador(
      colaborador.value,
      selectedYear.value,
      empleador.value
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
      ColaboradorService.calcularColaborador(c, newYear, empleador.value)
    );
  });

  // Re-calculate when employer info changes (e.g. switching to Persona Natural < 2 workers)
  watch(empleador, (newEmpleador) => {
    colaboradores.value = colaboradores.value.map(c =>
      ColaboradorService.calcularColaborador(c, selectedYear.value, newEmpleador)
    );
  }, { deep: true });

  return {
    colaboradores,
    colaborador,
    empleador, // Exposed for UI binding
    selectedYear,
    colaboradoresTotal,
    addColaborador,
    resetColaborador,
  };
});
