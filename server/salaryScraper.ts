import { launch } from "jsr:@astral/astral";

interface SalaryData {
  concepto: string;
  duracion: string;
  valor: string;
}

interface AporteSeguridadSocial {
  concepto: string;
  empleado: string;
  "empleado-concepto-slmv": string;
  empleador: string;
  "empleador-concepto-slmv": string;
  independiente: string;
  "independiente-concepto-slmv": string;
}

interface SalarioEjemplo {
  [key: string]: string;
}

export const scrapeSalaryData = async () => {
  const browser = await launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.salariominimocolombia.net/", { waitUntil: "load" });
  } catch (error) {
    console.error("Failed to navigate to the page:", error);
    await browser.close();
    throw error;
  }

  const salaryData = await page.evaluate(() => {
    const getTextContent = (selector: string) => {
      const element = document.querySelector(selector);
      return element ? element.textContent!.trim() : null;
    };

    const getTableData = (tableElement: HTMLTableElement | null) => {
      if (!tableElement) {
        return [];
      }
      const rows = tableElement.querySelectorAll("tbody tr");
      const data: SalaryData[] = [];
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          const conceptoCell = cells[0];
          const valorCell = cells[1];
          const conceptoText = conceptoCell.querySelector("h5")
            ? conceptoCell.querySelector("h5")!.textContent!.trim()
            : "";
          const duracionText = conceptoCell.querySelector("small")
            ? conceptoCell.querySelector("small")!.textContent!.trim()
            : "";
          const concepto = duracionText ? `${conceptoText}\n${duracionText}` : conceptoText;

          data.push({
            concepto,
            duracion: duracionText,
            valor: valorCell.textContent!.trim(),
          });
        }
      });
      return data;
    };

    // Extract 'Aportes a seguridad social mínimos Año 2024' table
    const aportesSeguridadSocialCard = Array.from(
      document.querySelectorAll("div.card.shadow-sm"),
    ).find((card) => {
      const heading = card.querySelector("h3");
      return heading &&
        heading.textContent!.includes(
          "Aportes a seguridad social mínimos Año 2024",
        );
    });

    const aportesSeguridadSocialTable = aportesSeguridadSocialCard
      ? aportesSeguridadSocialCard.querySelector(
        "table.table.table-striped.table-sm",
      )
      : null;

    let aportesSeguridadSocial: AporteSeguridadSocial[] = [];

    if (aportesSeguridadSocialTable) {
      const thead = aportesSeguridadSocialTable.querySelector("thead tr");
      const ths = thead!.querySelectorAll("th");
      const conceptos = Array.from(ths).map((th) => th.textContent!.trim());
      const rows = aportesSeguridadSocialTable.querySelectorAll("tbody tr");

      // Initialize an object for each concepto (e.g., 'Salud', 'Pensión')
      const aportesObj: { [key: string]: AporteSeguridadSocial } = {};
      conceptos.forEach((concepto) => {
        aportesObj[concepto] = {
          concepto,
          empleado: "",
          "empleado-concepto-slmv": "",
          empleador: "",
          "empleador-concepto-slmv": "",
          independiente: "",
          "independiente-concepto-slmv": "",
        };
      });

      rows.forEach((row) => {
        const tds = row.querySelectorAll("td");
        tds.forEach((td, index) => {
          const conceptoName = conceptos[index];
          const conceptoData = aportesObj[conceptoName];
          const h5 = td.querySelector("h5");
          const conceptoTipo = h5 ? h5.textContent!.trim() : "";
          const valorText = td.childNodes[1] ? td.childNodes[1].textContent!.trim() : "";
          const valor = valorText.replace(/[^\d.,-]/g, "").replace(",", "");
          const small = td.querySelector("small");
          const duracionText = small ? small.textContent!.trim() : "";
          const porcentajeMatch = duracionText.match(
            /equivalente al ([\d.,%]+)/,
          );
          const porcentaje = porcentajeMatch ? porcentajeMatch[1].replace(",", ".") : "";

          if (conceptoTipo === "Empleado") {
            conceptoData.empleado = porcentaje;
            conceptoData["empleado-concepto-slmv"] = valor;
          } else if (conceptoTipo === "Empleador") {
            conceptoData.empleador = porcentaje;
            conceptoData["empleador-concepto-slmv"] = valor;
          } else if (conceptoTipo === "Independiente") {
            conceptoData.independiente = porcentaje;
            conceptoData["independiente-concepto-slmv"] = valor;
          }
        });
      });
      aportesSeguridadSocial = Object.values(aportesObj);
    }

    // Extract 'Salario Mínimo 2024 Colombia en Dólares'
    const salarioEnDolaresCard = Array.from(
      document.querySelectorAll("div.card.shadow-sm"),
    ).find((card) => {
      return card.textContent!.includes(
        "Salario Mínimo 2024 Colombia en Dólares",
      );
    });
    const salarioEnDolaresText = salarioEnDolaresCard ? salarioEnDolaresCard.textContent!.trim() : "";

    // Extract 'Salario mínimo mensual ejemplo recibido por empleado' table
    const salarioEmpleadoCard = Array.from(
      document.querySelectorAll("div.card.shadow-sm"),
    ).find((card) => {
      const heading = card.querySelector("h2");
      return heading &&
        heading.textContent!.includes(
          "Salario mínimo mensual ejemplo recibido por empleado",
        );
    });

    const salarioEmpleadoTable = salarioEmpleadoCard
      ? salarioEmpleadoCard.querySelector("table.table.table-striped.table-sm")
      : null;
    const salarioRecibidoEmpleadoEjemplo: SalarioEjemplo = {};
    if (salarioEmpleadoTable) {
      const rows = salarioEmpleadoTable.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          const concepto = cells[0].textContent!.trim();
          const valor = cells[1].textContent!.trim().replace(/[^\d.,-]/g, "")
            .replace(",", "");
          salarioRecibidoEmpleadoEjemplo[concepto] = valor;
        }
      });
    }

    // Extract 'Salario mínimo mensual ejemplo pagado por empleador' table
    const salarioEmpleadorCard = Array.from(
      document.querySelectorAll("div.card.shadow-sm"),
    ).find((card) => {
      const heading = card.querySelector("h2");
      return heading &&
        heading.textContent!.includes(
          "Salario mínimo mensual ejemplo pagado por empleador",
        );
    });

    const salarioEmpleadorTable = salarioEmpleadorCard
      ? salarioEmpleadorCard.querySelector("table.table.table-striped.table-sm")
      : null;
    const salarioPagadoEmpleadorEjemplo: SalarioEjemplo = {};
    if (salarioEmpleadorTable) {
      const rows = salarioEmpleadorTable.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          const concepto = cells[0].textContent!.trim();
          const valor = cells[1].textContent!.trim().replace(/[^\d.,-]/g, "")
            .replace(",", "");
          salarioPagadoEmpleadorEjemplo[concepto] = valor;
        }
      });
    }

    return {
      salarioMinimoMensual: getTextContent("div.card-body .preciodolar"),
      salarioMinimoMensualTexto: getTextContent("div.card-body small"),
      variacionAnual: getTextContent("div.card-body p:nth-of-type(2)"),
      salarioMasSubsidio: getTextContent(
        "div.card-body p:nth-of-type(3) .valor",
      ),
      valoresSalarioMinimo2024: getTableData(
        document.querySelector(
          "div.card-body table.table.table-striped.table-sm",
        ),
      ),
      salarioMinimoEnDolares: salarioEnDolaresText,
      aportesSeguridadSocial,
      salarioRecibidoEmpleadoEjemplo,
      salarioPagadoEmpleadorEjemplo,
    };
  });

  await browser.close();

  const extractNumeric = (str: string) => {
    if (!str) return "0";
    let numStr = str.replace(/[^0-9.,-]+/g, "").replace(/,/g, "");
    // Remove decimal part if it's '.00'
    if (numStr.endsWith(".00")) {
      numStr = numStr.slice(0, -3);
    }
    return numStr;
  };

  const transformedData = {
    salarioMinimoMensual: extractNumeric(salaryData.salarioMinimoMensual!),
    salarioMinimoMensualTexto: salaryData.salarioMinimoMensualTexto,
    variacionAnual: {
      porcentaje: extractNumeric(salaryData.variacionAnual!.split("%")[0]),
      valor: extractNumeric(salaryData.variacionAnual!.split("$")[1]),
    },
    salarioMasSubsidio: extractNumeric(salaryData.salarioMasSubsidio!),
    valoresSalarioMinimo2024: salaryData.valoresSalarioMinimo2024.map(
      (item) => {
        return {
          concepto: item.concepto,
          duración: item.duracion,
          valor: extractNumeric(item.valor),
        };
      },
    ),
    salarioMinimoEnDolares: (() => {
      const lines = salaryData.salarioMinimoEnDolares.split("\n").map((line) => line.trim()).filter((line) => line);
      let trmMatch: RegExpMatchArray | null = null;
      let salarioMinimoDolaresMatch: RegExpMatchArray | null = null;

      lines.forEach((line) => {
        if (!trmMatch) {
          trmMatch = line.match(/1 dólar = \$ ([0-9.,]+)/);
        }
        if (!salarioMinimoDolaresMatch) {
          salarioMinimoDolaresMatch = line.match(
            /Salario Mínimo 2024 Colombia en Dólares: \$ ([0-9.,]+) USD/,
          );
        }
      });

      return {
        "2024-10-13 TRM 1 dólar - pesos colombianos": trmMatch ? extractNumeric(trmMatch[1]) : "0",
        "Salario Mínimo 2024 Colombia en Dólares": salarioMinimoDolaresMatch
          ? `${extractNumeric(salarioMinimoDolaresMatch[1])} USD`
          : "0 USD",
      };
    })(),
    aportesSeguridadSocial: salaryData.aportesSeguridadSocial.map((item) => {
      const aporteItem = item as {
        concepto: string;
        empleado: string;
        "empleado-concepto-slmv": string;
        empleador: string;
        "empleador-concepto-slmv": string;
        independiente: string;
        "independiente-concepto-slmv": string;
      };

      return {
        concepto: aporteItem.concepto,
        empleado: aporteItem.empleado,
        "empleado-concepto-slmv": extractNumeric(
          item["empleado-concepto-slmv"],
        ),
        empleador: aporteItem.empleador,
        "empleador-concepto-slmv": extractNumeric(
          item["empleador-concepto-slmv"],
        ),
        independiente: aporteItem.independiente,
        "independiente-concepto-slmv": extractNumeric(
          item["independiente-concepto-slmv"],
        ),
      };
    }),
    salarioRecibidoEmpleadoEjemplo: Object.fromEntries(
      Object.entries(salaryData.salarioRecibidoEmpleadoEjemplo).map((
        [key, value],
      ) => [key, extractNumeric(value)]),
    ),
    salarioPagadoEmpleadorEjemplo: Object.fromEntries(
      Object.entries(salaryData.salarioPagadoEmpleadorEjemplo).map((
        [key, value],
      ) => [key, extractNumeric(value)]),
    ),
  };

  return transformedData;
};
