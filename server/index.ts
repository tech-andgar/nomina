import process from "node:process";
import { scrapeSalaryData } from "./salaryScraper.ts";

(async () => {
  try {
    const transformedData = await scrapeSalaryData();
    await Bun.write("server/salaryData.json", JSON.stringify(transformedData, null, 2));
    console.log("Transformed data has been saved to salaryData.json");
  } catch (error) {
    console.error("An error occurred:", error);
  }
  process.exit(0);
})();
