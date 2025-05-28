"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.CocktailRegister = exports.CocktailLogin = void 0;
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_jwt_secret";
const CocktailLogin = (req, res) => {
    const { email, password } = req.body;
    db_1.connection.query("SELECT * FROM Users WHERE Email = ?", [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).json({ success: false, error: err.message });
        const user = results[0];
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        const isMatch = password === user.Password;
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.ID, role: user.Role }, JWT_SECRET, {
            expiresIn: "1d",
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.ID,
                email: user.Email,
                first_name: user.First_name,
                last_name: user.Last_name,
                role: user.Role,
            },
        });
    }));
};
exports.CocktailLogin = CocktailLogin;
const CocktailRegister = (req, res) => {
    const { email, name, Sname, password } = req.body;
    db_1.connection.query("SELECT * FROM Users WHERE Email = ?", [email], (err, results) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0)
            return res
                .status(409)
                .json({ success: false, message: "User already exists" });
        const userId = (0, uuid_1.v4)();
        const insertQuery = `
      INSERT INTO Users (ID, Email, First_name, Last_name, Password, Role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        db_1.connection.query(insertQuery, [userId, email, name, Sname, password, "user"], (err) => {
            if (err)
                return res.status(500).json({
                    success: false,
                    message: "Error registering user",
                    error: err.message,
                });
            res
                .status(201)
                .json({ success: true, message: "User registered", id: userId });
        });
    }));
};
exports.CocktailRegister = CocktailRegister;
const getUserProfile = (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ success: false, message: "User ID is required" });
        return;
    }
    const query = "SELECT ID,	Email, First_name,	Last_name, Role FROM Users WHERE ID = ?";
    db_1.connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, profil: results });
    });
};
exports.getUserProfile = getUserProfile;
