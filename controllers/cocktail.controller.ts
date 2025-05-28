import { Request, Response } from "express";
import { connection } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { start } from "repl";
const fs = require("fs");
const path = require("path");
const mutler = require("multer");

export const getAllCocktails = (req: Request, res: Response): void => {
  const query = `SELECT c.ID, c.Name, c.Description, AVG(r.Rating) AS Rating, c.Taste
                FROM Cocktails c
                LEFT JOIN Ratings r ON c.ID = r.CocktailID
                WHERE c.Valid = 1
                GROUP BY c.ID, c.Name, c.Description, c.Taste;`;
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, cocktails: results });
  });
};
export const getCocktailsFiltered = (req: Request, res: Response): void => {
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
    getAllCocktails;
    return;
  }
  if (!isNaN(req.body.limit) && req.body.limit != 0) {
    query += `\nLimit ` + req.body.limit.toString();
  }
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, cocktails: results });
  });
};

export const getCocktailDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const [cocktailResults, ingredientsResults] = await Promise.all([
      new Promise((resolve, reject) =>
        connection.query(cocktailQuery, [cocktailId], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(ingredientsQuery, [cocktailId], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
    ]);

    res.json({
      success: true,
      cocktail: cocktailResults,
      ingredients: ingredientsResults,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchCocktail = (req: Request, res: Response): void => {
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
    return
  }

  const searchParam = [`${startWord}%`];

  connection.query(query, searchParam, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, cocktails: results });
  });

};