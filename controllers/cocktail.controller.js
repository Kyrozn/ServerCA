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
exports.getUserProfile = exports.getCocktailDetails = exports.getCocktailsFiltered = exports.getAllCocktails = void 0;
const db_1 = require("../config/db");
const getAllCocktails = (req, res) => {
    const query = `
            SELECT DISTINCT c.ID, c.Name, c.Description, r.Rating, c.Taste
        FROM 
            Cocktails c
        LEFT JOIN 
            Ratings r ON c.ID = r.CocktailID
        WHERE 
            c.Valid = 1
  `;
    db_1.connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, cocktails: results });
    });
};
exports.getAllCocktails = getAllCocktails;
const getCocktailsFiltered = (req, res) => {
    var query;
    switch (req.body.filter) {
        case "Taste":
            query = `
        SELECT DISTINCT c.ID, c.Name, c.Description, r.Rating, c.Taste
        FROM 
            Cocktails c
        LEFT JOIN 
            Ratings r ON c.ID = r.CocktailID
        WHERE 
            c.Valid = 1
        ORDER BY c.Taste DESC
      `;
            break;
        case "Alcohol Degrees":
            query = `
        SELECT DISTINCT c.ID, c.Name, c.Description, r.Rating, c.Taste
        FROM 
            Cocktails c
        LEFT JOIN 
            Ratings r ON c.ID = r.CocktailID
        WHERE 
            c.Valid = 1
        ORDER BY c.Alcohol
      `;
            break;
        case "Rating":
            query = `
        SELECT DISTINCT c.ID, c.Name, c.Description, r.Rating, c.Taste
        FROM 
            Cocktails c
        LEFT JOIN 
            Ratings r ON c.ID = r.CocktailID
        WHERE 
            c.Valid = 1
        GROUP BY 
            c.ID
        ORDER BY 
            r.Rating DESC;
      `;
            break;
        default:
            exports.getAllCocktails;
            return;
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
    SELECT DISTINCT Cocktails.*
    FROM Cocktails
    JOIN CocktailIngredients ON Cocktails.ID = CocktailIngredients.CocktailID
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
const getUserProfile = (req, res) => {
    const { ID } = req.body;
    if (!ID) {
        res.status(400).json({ success: false, message: "User ID is required" });
        return;
    }
    const query = "SELECT * FROM Users WHERE ID = ?";
    db_1.connection.query(query, [ID], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, profil: results });
    });
};
exports.getUserProfile = getUserProfile;
