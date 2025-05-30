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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCocktail = exports.getCocktailDetails = exports.getCocktailsFiltered = exports.getAllCocktails = void 0;
const db_1 = require("../config/db");
const fs = require("fs");
const path = require("path");
const mutler = require("multer");
const getAllCocktails = (req, res) => {
    const query = `SELECT c.ID, c.Name, c.Description, AVG(r.Rating) AS Rating, c.Taste
                FROM Cocktails c
                LEFT JOIN Ratings r ON c.ID = r.CocktailID
                WHERE c.Valid = 1
                GROUP BY c.ID, c.Name, c.Description, c.Taste;`;
    db_1.connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, cocktails: results });
    });
};
exports.getAllCocktails = getAllCocktails;
const getCocktailsFiltered = (req, res) => {
    var query = `
  SELECT DISTINCT 
    c.ID, 
    c.Name, 
    c.Description, 
    AVG(r.Rating) AS Rating, 
    c.Taste, 
    c.Alcohol
  FROM Cocktails c
  LEFT JOIN Ratings r ON c.ID = r.CocktailID
  WHERE c.Valid = 1
  GROUP BY c.ID, c.Name, c.Description, c.Taste, c.Alcohol
`;
    switch (req.body.filter) {
        case "Taste":
            query += ` ORDER BY c.Taste DESC`;
            break;
        case "Alcohol Degrees":
            query += ` ORDER BY c.Alcohol`;
            break;
        case "Rating":
            query += ` ORDER BY Rating DESC`;
            break;
        default:
            exports.getAllCocktails;
            return;
    }
    if (!isNaN(req.body.limit) && req.body.limit != 0) {
        query += `\nLimit ` + req.body.limit.toString();
    }
    db_1.connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, cocktails: results });
    });
};
exports.getCocktailsFiltered = getCocktailsFiltered;
const getCocktailDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cocktailId = req.body.id;
    if (!cocktailId) {
        res
            .status(400)
            .json({ success: false, message: "Cocktail ID is required" });
        return;
    }
    const cocktailQuery = `
    SELECT DISTINCT Cocktails.*, AVG(Ratings.Rating) as Rating
    FROM Cocktails
    JOIN CocktailIngredients ON Cocktails.ID = CocktailIngredients.CocktailID
    LEFT JOIN Ratings ON Cocktails.ID = Ratings.CocktailID
    WHERE Cocktails.Valid = 1 AND Cocktails.ID = ?;
  `;
    const ingredientsQuery = `
    SELECT DISTINCT Ingredients.*
    FROM Ingredients
    Join CocktailIngredients on Ingredients.ID = CocktailIngredients.IngredientID
    Where CocktailIngredients.CocktailID = ?;
  `;
    try {
        const [cocktailResults, ingredientsResults] = yield Promise.all([
            new Promise((resolve, reject) => db_1.connection.query(cocktailQuery, [cocktailId], (err, results) => err ? reject(err) : resolve(results))),
            new Promise((resolve, reject) => db_1.connection.query(ingredientsQuery, [cocktailId], (err, results) => err ? reject(err) : resolve(results))),
        ]);
        res.json({
            success: true,
            cocktail: cocktailResults,
            ingredients: ingredientsResults,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getCocktailDetails = getCocktailDetails;
const searchCocktail = (req, res) => {
    const query = `
  SELECT c.ID, c.Name, c.Description, AVG(r.Rating) AS Rating, c.Taste
  FROM Cocktails c
  LEFT JOIN Ratings r ON c.ID = r.CocktailID
  WHERE c.Name COLLATE utf8mb4_general_ci LIKE ?
  GROUP BY c.ID, c.Name, c.Description, c.Taste
`;
    const startWord = req.body.sentence;
    if (!startWord) {
        res.json({ success: false, message: "Need a search value" });
        return;
    }
    const searchParam = [`${startWord}%`];
    db_1.connection.query(query, searchParam, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, cocktails: results });
    });
};
exports.searchCocktail = searchCocktail;
