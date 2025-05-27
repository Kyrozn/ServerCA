import { Request, Response } from "express";
import { connection } from "../config/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const fs = require("fs");
const path = require("path");
const mutler = require("multer");

export const getAllCocktails = (req: Request, res: Response): void => {
  const query = `
            SELECT DISTINCT c.ID, c.Name, c.Description, r.Rating, c.Taste
        FROM 
            Cocktails c
        LEFT JOIN 
            Ratings r ON c.ID = r.CocktailID
        WHERE 
            c.Valid = 1
  `;
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, cocktails: results });
  });
};
export const getCocktailsFiltered = (req: Request, res: Response): void => {
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
      getAllCocktails;
      return;
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
