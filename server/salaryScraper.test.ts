import { scrapeSalaryData } from "./salaryScraper.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test(
  "Salary Data Scraper",
  async () => {
    const data = await scrapeSalaryData();

    assertEquals(data.salarioMinimoMensual, "1300000");
    assertEquals(data.salarioMinimoMensualTexto, "Un Millón Trescientos Mil Pesos");
    assertEquals(data.variacionAnual, {
      porcentaje: "12.07",
      valor: "140000",
    });
    assertEquals(data.salarioMasSubsidio, "1462000");

    // Test 'valoresSalarioMinimo2024' length
    assertEquals(data.valoresSalarioMinimo2024.length > 0, true);

    // Test 'salarioMinimoEnDolares'
    assertEquals(data.salarioMinimoEnDolares, {
      "2024-10-13 TRM 1 dólar - pesos colombianos": "4192.56",
      "Salario Mínimo 2024 Colombia en Dólares": "310.07 USD",
    });

    // Test 'aportesSeguridadSocial'
    assertEquals(data.aportesSeguridadSocial, [
      {
        concepto: "Salud",
        empleado: "4%",
        "empleado-concepto-slmv": "52000",
        empleador: "8.5%",
        "empleador-concepto-slmv": "110500",
        independiente: "12.5%",
        "independiente-concepto-slmv": "162500",
      },
      {
        concepto: "Pensión",
        empleado: "4%",
        "empleado-concepto-slmv": "52000",
        empleador: "12%",
        "empleador-concepto-slmv": "156000",
        independiente: "16%",
        "independiente-concepto-slmv": "208000",
      },
    ]);

    // Test 'salarioRecibidoEmpleadoEjemplo'
    assertEquals(data.salarioRecibidoEmpleadoEjemplo, {
      "Salario Mensual": "1300000",
      "Subsidio de transporte": "162000",
      "Aporte Seguridad Social - Salud": "-52000",
      "Aporte Seguridad Social - Pensión": "-52000",
      "Total Salario Recibido": "1358000",
      "Cesantías": "121833",
      "Intereses sobre cesantías": "14620",
      "Total Aportes Cesantías": "136453",
    });

    // Test 'salarioPagadoEmpleadorEjemplo'
    assertEquals(data.salarioPagadoEmpleadorEjemplo, {
      "Salario Mensual": "1300000",
      "Subsidio de transporte": "162000",
      "Prima (1 salario anual + transporte)": "121833",
      "Cesantías (1 salario anual)": "121833",
      "Intereses sobre cesantías (12% cesantías año anterior)": "14620",
      "Aporte Seguridad Social - Salud (8.5%)": "110500",
      "Aporte Seguridad Social - Pensión (12%)": "156000",
      "Aporte Seguridad Social - ARL (Riesgo V - 6.96%)": "90480",
      "Parafiscales - Caja de compensación (4%)": "52000",
      "Parafiscales - ICBF (3%)": "39000",
      "Parafiscales - Sena (2%)": "26000",
      "Total Pagado": "2194267",
    });
  },
);
