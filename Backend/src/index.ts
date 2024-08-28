
import app from "./app";
import { AppDataSource } from "./db";
const PORT: number = 3000

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("DB connect");
    app.listen(PORT | 3000);
    console.log("Server on port", PORT);
  } catch (error) {
    console.error(error);
  }
}

main();