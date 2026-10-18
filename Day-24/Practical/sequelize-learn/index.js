const sequelize = require("./db");

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Connected to Postgres.");
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await sequelize.close();
  }
}

main();