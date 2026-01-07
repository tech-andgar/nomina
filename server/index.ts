import { scrapeSalaryData } from "./salaryScraper.ts";
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    const transformedData = await scrapeSalaryData();

    // Create data directory in public/nomina/server/data
    const dataDir = join(__dirname, "data");
    await mkdir(dataDir, { recursive: true });

    const year = transformedData.year;
    const fileName = `${year}.json`;
    const filePath = join(dataDir, fileName);

    await Bun.write(filePath, JSON.stringify(transformedData, null, 2));
    console.log(`Transformed data has been saved to ${filePath}`);

    // Also save as latest.json for convenience
    await Bun.write(join(dataDir, "latest.json"), JSON.stringify(transformedData, null, 2));
    console.log(`Latest data has been saved to ${join(dataDir, "latest.json")}`);
  } catch (error) {
    console.error("An error occurred during scraping:", error);
  }
  process.exit(0);
})();
