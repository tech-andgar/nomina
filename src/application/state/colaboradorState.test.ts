import { describe, it, expect, beforeEach } from "bun:test";
import {
    $colaboradores,
    $selectedYear,
    $colaborador,
    $empleador,
    addColaborador,
    setSelectedYear,
    setEmpleador,
    resetColaborador
} from "./colaboradorState.ts";
import { createEmptyColaborador } from "@src/domain/Colaborador.ts";

describe("colaboradorState", () => {
    beforeEach(() => {
        $colaboradores.set([]);
        $selectedYear.set(2026);
        $colaborador.set(createEmptyColaborador());
        $empleador.set({
            tipo: 'PERSONA_JURIDICA',
            numeroTrabajadores: 10
        });
    });

    it("should initialize with default values", () => {
        expect($colaboradores.get()).toEqual([]);
        expect($selectedYear.get()).toBe(2026);
    });

    it("should add a colaborador and recalculate", () => {
        $colaborador.set({
            ...$colaborador.get(),
            cedula: "123",
            nombre: "Test User",
            sueldo: 2000000,
            diasTrabajados: 30
        });

        addColaborador();

        const current = $colaboradores.get();
        expect(current.length).toBe(1);
        expect(current[0].nombre).toBe("Test User");
        expect(current[0].totalNeto).toBeGreaterThan(0);
    });

    it("should recalculate all colaboradores when year changes", () => {
        $colaborador.set({
            ...$colaborador.get(),
            cedula: "123",
            nombre: "Test User",
            sueldo: 1300000,
            diasTrabajados: 30
        });
        addColaborador();

        const originalNeto = $colaboradores.get()[0].totalNeto;

        setSelectedYear(2025);
        const updatedNeto = $colaboradores.get()[0].totalNeto;

        expect(updatedNeto).not.toBe(originalNeto);
    });

    it("should reset current colaborador state", () => {
        $colaborador.set({ ...$colaborador.get(), nombre: "Temp" });
        resetColaborador();
        expect($colaborador.get().nombre).toBe(null);
    });
});
