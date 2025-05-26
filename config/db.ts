import mysql from "mysql";

export const connection = mysql.createConnection({
  host: "db",
  user: "root",
  password: "password",
  database: "CocktailAppDB",
});

export const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("Connected to MySQL database");
    }
  });
};
