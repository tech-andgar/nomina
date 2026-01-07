import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scrapeSalaryData } from "./salaryScraper.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  console.log("Starting scraper...");
  const data = await scrapeSalaryData();
  const year = data.year;

  // 1. History: Save full object to server folder
  const dataDir = path.join(__dirname, "data");
  await mkdir(dataDir, { recursive: true });
  const yearFile = path.join(dataDir, `${year}.json`);
  await Bun.write(yearFile, JSON.stringify(data, null, 2));

  // 2. State: Save/Update consolidated collection in assets
  const assetsDataDir = path.join(__dirname, "..", "assets", "data");
  await mkdir(assetsDataDir, { recursive: true });
  const assetsDataFile = path.join(assetsDataDir, "yearly_data.json");

  // Load existing collection from assets
  let existingData: Record<string, any> = {};
  const assetsFileObj = Bun.file(assetsDataFile);
  if (await assetsFileObj.exists()) {
    existingData = await assetsFileObj.json();
  }

  // Update with the full object
  existingData[year] = data;

  await Bun.write(assetsDataFile, JSON.stringify(existingData, null, 2));

  console.log(`Successfully consolidated data for year ${year} in assets/data/yearly_data.json`);
} catch (error) {
  console.error("Scraper failed:", error);
  process.exit(1);
}
