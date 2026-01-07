import { atom, computed } from "nanostores";
import type { Colaborador } from "@src/domain/Colaborador";
import { createEmptyColaborador } from "@src/domain/Colaborador";
import type { InfoEmpleador } from "@src/domain/Empleador";
import * as ColaboradorService from "@src/application/services/ColaboradorService";

// State Atoms
export const $colaboradores = atom<Colaborador[]>([]);
export const $selectedYear = atom<number>(2026);
export const $colaborador = atom<Colaborador>(createEmptyColaborador());
export const $empleador = atom<InfoEmpleador>({
    tipo: 'PERSONA_JURIDICA',
    numeroTrabajadores: 10
});

// Computed State
export const $colaboradoresTotal = computed($colaboradores, (colaboradores) =>
    ColaboradorService.calcularTotales(colaboradores)
);

// Actions
export const addColaborador = () => {
    const currentColaborador = $colaborador.get();
    if (!ColaboradorService.checkNotEmptyDataColaborador(currentColaborador)) return;

    const recalculatedColaborador = ColaboradorService.calcularColaborador(
        currentColaborador,
        $selectedYear.get(),
        undefined,
        $empleador.get()
    );

    $colaboradores.set([...$colaboradores.get(), recalculatedColaborador]);
    resetColaborador();
};

export const resetColaborador = () => {
    $colaborador.set(createEmptyColaborador());
};

export const setSelectedYear = (year: number) => {
    $selectedYear.set(year);
    // Recalculate all colaboradores
    const updatedColaboradores = $colaboradores.get().map(c =>
        ColaboradorService.calcularColaborador(c, year, undefined, $empleador.get())
    );
    $colaboradores.set(updatedColaboradores);
};

export const setEmpleador = (empleador: InfoEmpleador) => {
    $empleador.set(empleador);
    // Recalculate all colaboradores
    const updatedColaboradores = $colaboradores.get().map(c =>
        ColaboradorService.calcularColaborador(c, $selectedYear.get(), undefined, empleador)
    );
    $colaboradores.set(updatedColaboradores);
};

// Re-sync logic if needed (optional, actions above already handle it)
