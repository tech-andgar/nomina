import { scrapeSalaryData } from "./salaryScraper.ts";
import { expect, test } from "bun:test";

test("Salary Data Scraper", async () => {
  const data = await scrapeSalaryData();

  expect(data.salarioMinimoMensual).toBe("1750905");
  expect(data.salarioMinimoMensualTexto).toBe("Un Millón Setecientos Cincuenta Mil Novecientos Cinco Pesos");
  expect(data.variacionAnual).toEqual({
    porcentaje: "23",
    valor: "327405",
  });
  expect(data.salarioMasSubsidio).toBe("2000000");

  // Test 'valoresSalarioMinimo' length
  expect(data.valoresSalarioMinimo2024.length > 0).toBe(true);

  // Test 'salarioMinimoEnDolares'
  expect(data.salarioMinimoEnDolares).toEqual({
    "TRM 1 dólar - pesos colombianos": "3770.03",
    "Salario Mínimo en Dólares": "464.43 USD",
  });

  // Test 'aportesSeguridadSocial'
  expect(data.aportesSeguridadSocial).toEqual([
    {
      concepto: "Salud",
      empleado: "4%",
      "empleado-concepto-slmv": "70036.20",
      empleador: "8.5%",
      "empleador-concepto-slmv": "148826.93",
      independiente: "12.5%",
      "independiente-concepto-slmv": "218863.13",
    },
    {
      concepto: "Pensión",
      empleado: "4%",
      "empleado-concepto-slmv": "70036.20",
      empleador: "12%",
      "empleador-concepto-slmv": "210108.60",
      independiente: "16%",
      "independiente-concepto-slmv": "280144.80",
    },
  ]);

  expect(data.salarioRecibidoEmpleadoEjemplo).toEqual({
    "Salario Mensual": "1750905",
    "Subsidio de transporte": "249095",
    "Aporte Seguridad Social - Salud": "-70036",
    "Aporte Seguridad Social - Pensión": "-70036",
    "Total Salario Recibido": "1859928",
    "Cesantías": "166667",
    "Intereses sobre cesantías": "20000",
    "Total Aportes Cesantías": "186667"
  });

  expect(data.salarioPagadoEmpleadorEjemplo).toEqual({
    "Salario Mensual": "1750905",
    "Subsidio de transporte": "249095",
    "Prima (1 salario anual + transporte)": "166667",
    "Cesantías (1 salario anual)": "166667",
    "Intereses sobre cesantías (12% cesantías año anterior)": "20000",
    "Aporte Seguridad Social - Salud (8.5%)": "148827",
    "Aporte Seguridad Social - Pensión (12%)": "210109",
    "Aporte Seguridad Social - ARL (Riesgo V - 6.96%)": "121863",
    "Parafiscales - Caja de compensación (4%)": "70036",
    "Parafiscales - ICBF (3%)": "52527",
    "Parafiscales - Sena (2%)": "35018",
    "Total Pagado": "2991713"
  });
});
