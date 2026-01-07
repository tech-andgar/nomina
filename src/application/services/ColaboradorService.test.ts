import { describe, expect, test } from "bun:test";
import * as ColaboradorService from "@src/application/services/ColaboradorService.ts";
import type { Colaborador } from "@src/domain/Colaborador.ts";
import type { YearlyConstants } from "@src/infrastructure/config/constants.ts";

describe("ColaboradorService", () => {
    const mockConstants: YearlyConstants = {
        slmv: 1750905,
        uvt: 52374,
        auxTransporte: 249095,
    };

    const mockColaborador: Colaborador = {
        cedula: "12345678",
        nombre: "Juan Perez",
        sueldo: 2000000,
        diasTrabajados: 30,
        valorHoraOrdinaria: null,
        auxTransporte: null,
        devengado: {
            horasExtras: {
                diurna: 0,
                nocturna: 0,
                domingos: 0,
                nocturnaDomingos: 0,
                recargoNocturno: 0,
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
        prestaciones: {
            prima: null,
            vacaciones: null,
            cesantias: null,
            interesCesantias: null,
            totalPrestacion: null,
        },
        totalNeto: null,
        totalNomina: null,
    };

    test("checkNotEmptyDataColaborador should validate correctly", () => {
        expect(ColaboradorService.checkNotEmptyDataColaborador(mockColaborador)).toBe(true);

        const emptyColaborador = { ...mockColaborador, nombre: "" };
        expect(ColaboradorService.checkNotEmptyDataColaborador(emptyColaborador)).toBe(false);
    });

    test("calcularValorHoraOrdinaria should calculate hourly rate", () => {
        // 2,000,000 / (8 * 30) = 8333.333...
        const result = ColaboradorService.calcularValorHoraOrdinaria(mockColaborador);
        expect(result).toBeCloseTo(8333.333, 3);
    });

    test("calcularValorAuxTransporte should calculate transport subsidy if sueldo < 2*SLMV", () => {
        // 2,000,000 < 1,750,905 * 2 (3,501,810) -> Should have aux
        const result = ColaboradorService.calcularValorAuxTransporte(mockColaborador, mockConstants);
        expect(result).toBeCloseTo(249095, 2);

        const richColaborador = { ...mockColaborador, sueldo: 4000000 };
        const richResult = ColaboradorService.calcularValorAuxTransporte(richColaborador, mockConstants);
        expect(richResult).toBe(0);
    });

    test("calcularValorExtrasDiurna should calculate extra diurnal hours", () => {
        const withExtras = {
            ...mockColaborador,
            devengado: {
                ...mockColaborador.devengado,
                horasExtras: { ...mockColaborador.devengado.horasExtras, diurna: 10 }
            }
        };
        // valorHoraOrdinaria (8333.33) * 10 * 1.25 = 104166.666...
        const result = ColaboradorService.calcularValorExtrasDiurna(withExtras);
        expect(result).toBeCloseTo(104166.666, 2);
    });

    test("calcularValorSaludColaborador should calculate health contribution (4% of IBC)", () => {
        // IBC = Devengado (2,000,000 + 249,095) - AuxTrans (249,095) = 2,000,000
        // Salud = 2,000,000 * 0.04 = 80,000
        const result = ColaboradorService.calcularValorSaludColaborador(mockColaborador, mockConstants);
        expect(result).toBeCloseTo(80000, 2);
    });

    test("calcularValorFondoSolidaridad should test all progressive brackets", () => {
        const slmv = mockConstants.slmv;

        // Bracket 1: < 4 SLMV -> 0%
        expect(ColaboradorService.calcularValorFondoSolidaridad(mockColaborador, mockConstants)).toBe(0);

        // Bracket 2: 4-16 SLMV -> 1%
        const level16 = { ...mockColaborador, sueldo: 5 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level16, mockConstants)).toBeCloseTo(5 * slmv * 0.01, 2);

        // Bracket 3: 16-17 SLMV -> 1.2%
        const level16_5 = { ...mockColaborador, sueldo: 16.5 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level16_5, mockConstants)).toBeCloseTo(16.5 * slmv * 0.012, 2);

        // Bracket 4: 17-18 SLMV -> 1.4%
        const level17_5 = { ...mockColaborador, sueldo: 17.5 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level17_5, mockConstants)).toBeCloseTo(17.5 * slmv * 0.014, 2);

        // Bracket 5: 18-19 SLMV -> 1.6%
        const level18_5 = { ...mockColaborador, sueldo: 18.5 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level18_5, mockConstants)).toBeCloseTo(18.5 * slmv * 0.016, 2);

        // Bracket 6: 19-20 SLMV -> 1.8%
        const level19_5 = { ...mockColaborador, sueldo: 19.5 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level19_5, mockConstants)).toBeCloseTo(19.5 * slmv * 0.018, 2);

        // Bracket 7: > 20 SLMV -> 2%
        const level21 = { ...mockColaborador, sueldo: 21 * slmv };
        expect(ColaboradorService.calcularValorFondoSolidaridad(level21, mockConstants)).toBeCloseTo(21 * slmv * 0.02, 2);
    });

    test("calcularValorRetefuente should work for typical and high salaries", () => {

        // Caso 1: Sueldo 3,000,000 (No debería tener Retefuente)
        // Base = (3,249,095 [Dev] - 240,000 [SegSoc]) * 0.75 = 2,256,821
        // UVT = 2,256,821 / 52,374 = 43.09 UVT (< 85)
        const c1 = { ...mockColaborador, sueldo: 3000000 };
        expect(ColaboradorService.calcularValorRetefuente(c1, mockConstants)).toBe(0);

        // Caso 2: Sueldo 10,000,000 (Debería tener Retefuente en Bracket 2)
        // IBC = 10,000,000. Salud = 400k. Pension = 400k. FondoS = 100k.
        // Base = (10,000,000 - 900,000) * 0.75 = 6,825,000
        // UVT = 6,825,000 / 52,374 = 130.3127...
        // Rete = 130.3127... * 0.19 * 52374 = 1,296,752
        const c2 = { ...mockColaborador, sueldo: 10000000 };
        const rete = ColaboradorService.calcularValorRetefuente(c2, mockConstants);
        expect(rete).toBeCloseTo(1296752, 0);

        // Caso 3: Sueldo 50,000,000 (Bracket muy alto)
        // IBC = 50M. Salud = 2M. Pension = 2M. FondoS(2%) = 1M.
        // Base = (50M - 5M) * 0.75 = 33,750,000
        // UVT = 33,750,000 / 52,374 = 644.4037 UVT (Bracket 5: 640-1140)
        // Rete = (644.4037 * 0.35 + 166) * 52374 = (225.5413 + 166) * 52374 = 391.5413 * 52374 = 20,506,589
        const c3 = { ...mockColaborador, sueldo: 50000000 };
        const reteAlto = ColaboradorService.calcularValorRetefuente(c3, mockConstants);
        expect(reteAlto).toBeCloseTo(20506589, 0);
    });

    describe("Employer Obligations", () => {
        test("Parafiscales calculations", () => {
            // IBC = 2,000,000
            expect(ColaboradorService.calcularValorARLEmpleador(mockColaborador, mockConstants)).toBeCloseTo(2000000 * 0.00522, 2);
            expect(ColaboradorService.calcularValorSENAEmpleador(mockColaborador, mockConstants)).toBeCloseTo(2000000 * 0.02, 2);
            expect(ColaboradorService.calcularValorICBFEmpleador(mockColaborador, mockConstants)).toBeCloseTo(2000000 * 0.03, 2);
            expect(ColaboradorService.calcularValorCajaEmpleador(mockColaborador, mockConstants)).toBeCloseTo(2000000 * 0.04, 2);
        });

        test("Prestaciones calculations", () => {
            // Sueldo (2M) + Aux (249,095) = 2,249,095
            // The code uses colaborador.devengado.sueldoBasico for Prima
            const base = 2249095;
            const c = {
                ...mockColaborador,
                devengado: { ...mockColaborador.devengado, sueldoBasico: 2000000 }
            };

            expect(Number(ColaboradorService.calcularValorPrima(c, mockConstants))).toBeCloseTo(base * 0.08333333, 2);
            expect(Number(ColaboradorService.calcularValorCesantias(c, mockConstants))).toBeCloseTo(base * 0.08333333, 2);
            expect(Number(ColaboradorService.calcularValorVacaciones(c, mockConstants))).toBeCloseTo(2249095 * 0.0417, 2);
        });
    });

    test("calcularValorUVT should convert net income to UVT", () => {
        // Base = (2,249,095 - 160,000) * 0.75 = 1,566,821.25
        // UVT = 1,566,821.25 / 52,374 = 29.91599...
        const result = ColaboradorService.calcularValorUVT(mockColaborador, mockConstants);
        expect(result).toBeCloseTo(29.916, 3);
    });

    test("calcularColaborador should perform full calculation", () => {
        const result = ColaboradorService.calcularColaborador(mockColaborador, 2026);

        expect(result.valorHoraOrdinaria).toBeCloseTo(8333.333, 2);
        expect(result.auxTransporte).toBeCloseTo(249095, 2);
        expect(result.devengado.totalDevengado).toBeCloseTo(2249095, 2);
        expect(result.deducido.salud).toBeCloseTo(80000, 2);
        expect(result.deducido.pension).toBeCloseTo(80000, 2);
        expect(result.totalNeto).toBeCloseTo(2249095 - 160000, 2); // 2,089,095
    });

    test("calcularTotales should aggregate multiple colaboradores", () => {
        const c1 = ColaboradorService.calcularColaborador(mockColaborador, 2026);
        const c2 = ColaboradorService.calcularColaborador({ ...mockColaborador, sueldo: 4000000 }, 2026);

        const totales = ColaboradorService.calcularTotales([c1, c2]);

        // c1: Dev=2,249,095, Ded=160,000, Net=2,089,095
        // c2: Sueldo=4M, Aux=0, Dev=4M, Ded=160,000*2 (actually 160k salud + 160k pension = 320k), Net=3,680,000
        // Totales: Dev=6,249,095, Ded=480,000, Net=5,769,095
        expect(totales.totalDevengado).toBeCloseTo(2249095 + 4000000, 0);
        expect(totales.totalDeducido).toBeCloseTo(160000 + 320000, 0);
        expect(totales.totalNeto).toBeCloseTo(2089095 + 3680000, 0);
    });
});
