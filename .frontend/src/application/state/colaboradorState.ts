import { atom, computed } from "nanostores";
import { persistentAtom, setPersistentEngine, windowPersistentEvents } from "@nanostores/persistent";
import type { Colaborador } from "@src/domain/Colaborador";
import { createEmptyColaborador } from "@src/domain/Colaborador";
import type { InfoEmpleador } from "@src/domain/Empleador";
import * as ColaboradorService from "@src/application/services/ColaboradorService";

const isBrowser =  globalThis.window !== undefined;

// Use sessionStorage for privacy: "no asusta datos llevar externo"
if (isBrowser) {
    setPersistentEngine(globalThis.sessionStorage, windowPersistentEvents);
}

// State Atoms with Session Persistence
export const $colaboradores = persistentAtom<Colaborador[]>("colaboradores", [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $selectedYear = persistentAtom<number>("selectedYear", 2026, {
    encode: (v) => v.toString(),
    decode: (v) => Number.parseInt(v, 10),
});

export const $colaborador = atom<Colaborador>(createEmptyColaborador());

export const $empleador = persistentAtom<InfoEmpleador>("empleador", {
    tipo: 'PERSONA_JURIDICA',
    numeroTrabajadores: 10
}, {
    encode: JSON.stringify,
    decode: JSON.parse,
});

export const $editingIndex = atom<number | null>(null);

export type Theme = 'light' | 'dark';
export const $theme = persistentAtom<Theme>('theme', 'light');

// Theme Actions
export const setTheme = (theme: Theme) => {
    $theme.set(theme);
    if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = theme;
    }
};

export const toggleTheme = () => {
    setTheme($theme.get() === 'light' ? 'dark' : 'light');
};

// Initialize theme on client side
if (isBrowser) {
    const systemTheme = globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    // persistentAtom will already have loaded the value from storage if it exists
    const initialTheme = $theme.get() || systemTheme;
    setTheme(initialTheme);
}

// Real-time Preview for the current form entry
export const $calculatedColaboradorPreview = computed(
    [$colaborador, $selectedYear, $empleador],
    (colaborador, year, empleador) => {
        if (!ColaboradorService.checkNotEmptyDataColaborador(colaborador)) return null;
        return ColaboradorService.calcularColaborador(colaborador, year, undefined, empleador);
    }
);

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

export const editColaborador = (index: number) => {
    const target = $colaboradores.get()[index];
    if (!target) return;
    $colaborador.set({ ...target });
    $editingIndex.set(index);
    // Scroll to form (dispatching custom event or just setting state is enough, UI will handle focus)
};

export const updateColaborador = () => {
    const index = $editingIndex.get();
    if (index === null) return;

    const currentColaborador = $colaborador.get();
    const recalculatedColaborador = ColaboradorService.calcularColaborador(
        currentColaborador,
        $selectedYear.get(),
        undefined,
        $empleador.get()
    );

    const list = [...$colaboradores.get()];
    list[index] = recalculatedColaborador;
    $colaboradores.set(list);
    cancelEdit();
};

export const deleteColaborador = (index: number) => {
    const list = $colaboradores.get().filter((_, i) => i !== index);
    $colaboradores.set(list);
    if ($editingIndex.get() === index) {
        cancelEdit();
    }
};

export const cancelEdit = () => {
    $editingIndex.set(null);
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
