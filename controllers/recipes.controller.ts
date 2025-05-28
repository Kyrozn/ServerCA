import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { connection } from "../config/db";

export const createRecipe = (req: any, res: any) => {
  const {
    title,
    description,
    ingredientList,
    recipe,
    taste,
    alcohol,
    authorId,
  } = req.body;
  const photo = req.file?.filename; // 🟢 Attention ici : req.file, pas req.body.photo

  if (
    !title ||
    !description ||
    !ingredientList ||
    !recipe ||
    !authorId ||
    !photo ||
    !taste ||
    !alcohol
  ) {
    return res.status(400).json({ message: "Missing fields", success: false });
  }

  const cocktailId = uuidv4();
  const CocktailQuery = `
    INSERT INTO Cocktails (ID, Name, Description, Recipe, Taste, Alcohol, Image, CreatorID, Valid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let ingredients = ingredientList;
  if (typeof ingredientList === "string") {
    try {
      ingredients = JSON.parse(ingredientList);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "ingredientList JSON malformé" });
    }
  }

  if (!Array.isArray(ingredients)) {
    return res
      .status(400)
      .json({ success: false, message: "ingredientList doit être un tableau" });
  }

  connection.query(
    CocktailQuery,
    [
      cocktailId,
      title,
      description,
      recipe,
      taste,
      alcohol,
      0,
      authorId,
      0,
    ],
    (err) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Error creating recipe",
          error: err.message,
        });

      // 🔄 Attendre la fin de toutes les insertions
      let completed = 0;
      let hasFailed = false;

      ingredients.forEach((ingredient: any) => {
        const IngredientID = uuidv4();
        const IngredientQuery = `
          INSERT INTO Ingredients (ID, Name, Categ, AlcoholContent)
          VALUES (?, ?, ?, ?)
        `;
        const LinkQuery = `
          INSERT INTO CocktailIngredients (CocktailID, IngredientID)
          VALUES (?, ?)
        `;

        connection.query(
          IngredientQuery,
          [
            IngredientID,
            ingredient.name,
            ingredient.category,
            ingredient.alcohol,
          ],
          (err) => {
            if (err && !hasFailed) {
              hasFailed = true;
              return res.status(500).json({
                success: false,
                message: "Error creating Ingredient",
                error: err.message,
              });
            }

            connection.query(
              LinkQuery,
              [cocktailId, IngredientID],
              (err) => {
                if (err && !hasFailed) {
                  hasFailed = true;
                  return res.status(500).json({
                    success: false,
                    message: "Error linking ingredient and cocktail",
                    error: err.message,
                  });
                }

                completed++;
                if (completed === ingredients.length && !hasFailed) {
                  res
                    .status(201)
                    .json({ message: "Recette créée", success: true });
                }
              }
            );
          }
        );
      });
    }
  );
};
