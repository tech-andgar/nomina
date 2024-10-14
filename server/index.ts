import { scrapeSalaryData } from "./salaryScraper.ts";
import process from "node:process";

(async () => {
  try {
    const transformedData = await scrapeSalaryData();
    await Deno.writeTextFile("salaryData.json", JSON.stringify(transformedData, null, 2));
    console.log("Transformed data has been saved to salaryData.json");
  } catch (error) {
    console.error("An error occurred:", error);
  }
  process.exit(0);
})();
