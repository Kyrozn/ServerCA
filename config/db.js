"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.connection = mysql_1.default.createConnection({
    host: "db",
    user: "root",
    password: "password",
    database: "CocktailAppDB",
});
const connectDB = () => {
    exports.connection.connect((err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
        }
        else {
            console.log("Connected to MySQL database");
        }
    });
};
exports.connectDB = connectDB;
