import db from "./knex";

export const connectDB = async () => {
  try {
    const result = await db.migrate.latest();
    console.log("Knex migrations ran successfully");
    console.log("Connection successful:", result);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
