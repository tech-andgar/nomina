import { launch } from 'puppeteer';
import { writeFileSync } from 'fs';

(async () => {
  const browser = await launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.goto('https://www.salariominimocolombia.net/', { waitUntil: 'domcontentloaded' });
  } catch (error) {
    console.error('Failed to navigate to the page:', error);
    await browser.close();
    process.exit(1);
  }

  const salaryData = await page.evaluate(() => {
    const getTextContent = (selector) => {
      const element = document.querySelector(selector);
      return element ? element.textContent.trim() : null;
    };

    const getTableData = (tableElement) => {
      if (!tableElement) {
        return [];
      }
      const rows = tableElement.querySelectorAll('tbody tr');
      const data = [];
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          data.push({
            concepto: cells[0].textContent.trim(),
            valor: cells[1].textContent.trim(),
          });
        }
      });
      return data;
    };

    // Finding the card containing 'Aportes a seguridad social mínimos Año 2024'
    const aportesSeguridadSocialCard = Array.from(document.querySelectorAll('div.card.shadow-sm')).find(card => {
      const heading = card.querySelector('h3');
      return heading && heading.textContent.includes('Aportes a seguridad social mínimos Año 2024');
    });
    const aportesSeguridadSocial = aportesSeguridadSocialCard ? getTableData(aportesSeguridadSocialCard.querySelector('table.table.table-striped.table-sm')) : [];

    return {
      salarioMinimoMensual: getTextContent('div.card-body .preciodolar'),
      salarioMinimoMensualTexto: getTextContent('div.card-body small'),
      variacionAnual: getTextContent('div.card-body p:nth-of-type(2)'),
      salarioMasSubsidio: getTextContent('div.card-body p:nth-of-type(3) .valor'),
      valoresSalarioMinimo2024: getTableData(document.querySelector('div.card-body table.table.table-striped.table-sm')), // adjusted to target the correct card body with a table
      salarioMinimoEnDolares: getTextContent('body > div > div > main > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div'),
      aportesSeguridadSocial,
      salarioEmpleadoEjemplo: getTableData(document.querySelector('div.card-body:nth-of-type(9) table.table.table-striped.table-sm')),
      salarioPagadoEmpleadorEjemplo: getTableData(document.querySelector('div.card-body:nth-of-type(10) table.table.table-striped.table-sm')),
    };
  });

  writeFileSync('salaryData.json', JSON.stringify(salaryData, null, 2), 'utf-8');

  await browser.close();
})();