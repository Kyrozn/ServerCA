"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.rejectCocktail = exports.getAllUsers = exports.approveCocktail = exports.getUnvalidCocktails = void 0;
const db_1 = require("../config/db");
const getUnvalidCocktails = (req, res) => {
    const query = `SELECT c.ID, c.Name, c.Description, AVG(r.Rating) AS Rating, c.Taste
                  FROM Cocktails c
                  LEFT JOIN Ratings r ON c.ID = r.CocktailID
                  WHERE c.Valid = 0
                  GROUP BY c.ID, c.Name, c.Description, c.Taste;`;
    db_1.connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, cocktails: results });
    });
};
exports.getUnvalidCocktails = getUnvalidCocktails;
const approveCocktail = (req, res) => {
    const query = `UPDATE Cocktails SET Valid = 1 WHERE ID = ?`;
    const { cocktailId } = req.body;
    if (!cocktailId) {
        res.json({ success: false, message: 'no id given' });
    }
    db_1.connection.query(query, [cocktailId], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: 'Cocktail upadted' });
    });
};
exports.approveCocktail = approveCocktail;
const getAllUsers = (req, res) => {
    const query = `SELECT ID, Email, First_name, Last_name, Role
                  FROM Users`;
    db_1.connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, users: results });
    });
};
exports.getAllUsers = getAllUsers;
const rejectCocktail = (req, res) => {
    const { cocktailId } = req.body;
    if (!cocktailId) {
        res.json({ success: false, message: "no id given" });
        return;
    }
    const QueryGetALLIngredient = `SELECT IngredientID FROM CocktailIngredients WHERE CocktailID = ?`;
    db_1.connection.query(QueryGetALLIngredient, [cocktailId], (error, ingredientResults) => {
        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
        const ALLIngredient = ingredientResults.map((row) => row.IngredientID);
        const QueryDeleteLink = `DELETE FROM CocktailIngredients WHERE CocktailID = ?`;
        db_1.connection.query(QueryDeleteLink, [cocktailId], (error) => {
            if (error) {
                return res
                    .status(500)
                    .json({ success: false, message: error.message });
            }
            const QueryDeleteIngredients = `DELETE FROM Ingredients WHERE ID = ?`;
            let deletionCount = 0;
            if (ALLIngredient.length === 0) {
                deleteCocktail();
            }
            ALLIngredient.forEach((ingredientId) => {
                db_1.connection.query(QueryDeleteIngredients, [ingredientId], (error) => {
                    if (error) {
                        return res
                            .status(500)
                            .json({ success: false, message: error.message });
                    }
                    deletionCount++;
                    if (deletionCount === ALLIngredient.length) {
                        deleteCocktail(); // Une fois que tous les ingrédients sont supprimés
                    }
                });
            });
            function deleteCocktail() {
                const QueryDeleteCocktail = `DELETE FROM Cocktails WHERE ID = ?`;
                db_1.connection.query(QueryDeleteCocktail, [cocktailId], (error) => {
                    if (error) {
                        res
                            .status(500)
                            .json({ success: false, message: error.message });
                    }
                    res.json({ success: true, message: "rejected" });
                });
            }
        });
    });
};
exports.rejectCocktail = rejectCocktail;
const deleteUser = (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.json({ success: false, message: "no id given" });
        return;
    }
    const QueryDeleteCocktail = `DELETE FROM Users WHERE ID = ?`;
    db_1.connection.query(QueryDeleteCocktail, [userId], (error) => {
        if (error) {
            res.status(500).json({ success: false, message: error.message });
        }
        res.json({ success: true, message: "rejected" });
    });
};
exports.deleteUser = deleteUser;
