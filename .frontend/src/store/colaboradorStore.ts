import { defineStore } from "pinia";
import { useStore } from "@nanostores/vue";
import {
  $colaboradores,
  $selectedYear,
  $colaborador,
  $empleador,
  $colaboradoresTotal,
  addColaborador,
  resetColaborador,
  setSelectedYear,
  setEmpleador
} from "@src/application/state/colaboradorState";

export { MONEY_FORMAT as moneyFormatForComponent } from "@src/infrastructure/config/constants";

export const useColaboradorStore = defineStore("colaborador", () => {
  // Bridge Nanostores to Vue reactivity
  const colaboradores = useStore($colaboradores);
  const selectedYear = useStore($selectedYear);
  const colaborador = useStore($colaborador);
  const empleador = useStore($empleador);
  const colaboradoresTotal = useStore($colaboradoresTotal);

  return {
    colaboradores,
    colaborador,
    empleador,
    selectedYear,
    colaboradoresTotal,
    addColaborador,
    resetColaborador,
    // Add setters if components expect to write directly to refs (they likely do)
    setSelectedYear,
    setEmpleador
  };
});
