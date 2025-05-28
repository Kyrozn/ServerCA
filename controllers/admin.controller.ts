import { Request, Response } from "express";
import { connection } from "../config/db";

export const getUnvalidCocktails = (req: Request, res: Response): void => {
  const query = `SELECT c.ID, c.Name, c.Description, AVG(r.Rating) AS Rating, c.Taste
                  FROM Cocktails c
                  LEFT JOIN Ratings r ON c.ID = r.CocktailID
                  WHERE c.Valid = 0
                  GROUP BY c.ID, c.Name, c.Description, c.Taste;`;
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, cocktails: results });
  });
};

export const approveCocktail = (req: Request, res: Response): void => {
  const query = `UPDATE Cocktails SET Valid = 1 WHERE ID = ?`;
  const { cocktailId } = req.body;
  if (!cocktailId) {
    res.json({success: false, message: 'no id given'})
    
  }
  connection.query(query, [cocktailId],(error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, message: 'Cocktail upadted' });
  });
};
export const getAllUsers = (req: Request, res: Response): void => {
  const query = `SELECT ID, Email, First_name, Last_name, Role
                  FROM Users`;
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, users: results });
  });
};

export const rejectCocktail = (req: Request, res: Response): void => {
  const { cocktailId } = req.body;
  if (!cocktailId) {
    res.json({ success: false, message: "no id given" });
    return; 
  }

  const QueryGetALLIngredient = `SELECT IngredientID FROM CocktailIngredients WHERE CocktailID = ?`;
  connection.query(
    QueryGetALLIngredient,
    [cocktailId],
    (error, ingredientResults) => {
      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const ALLIngredient = ingredientResults.map(
        (row: any) => row.IngredientID
      );

      const QueryDeleteLink = `DELETE FROM CocktailIngredients WHERE CocktailID = ?`;
      connection.query(QueryDeleteLink, [cocktailId], (error) => {
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

        ALLIngredient.forEach((ingredientId: string) => {
          connection.query(QueryDeleteIngredients, [ingredientId], (error) => {
            if (error) {
              return  res
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
          connection.query(QueryDeleteCocktail, [cocktailId], (error) => {
            if (error) {
              res
                .status(500)
                .json({ success: false, message: error.message });
            }
            res.json({ success: true, message: "rejected" });
          });
        }
      });
    }
  );
};
export const deleteUser = (req: Request, res: Response): void => {
  const { userId } = req.body;
  if (!userId) {
    res.json({ success: false, message: "no id given" });
    return;
  }
  const QueryDeleteCocktail = `DELETE FROM Users WHERE ID = ?`;
  connection.query(QueryDeleteCocktail, [userId], (error) => {
    if (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    res.json({ success: true, message: "rejected" });
  });
};
