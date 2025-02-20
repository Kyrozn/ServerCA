import express, { Request, Response } from "express";
import mysql, { Connection, MysqlError } from "mysql";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import path from "path";
const app = express();
const port = 5050;

app.use(express.json(), cors())

const connection: Connection = mysql.createConnection({
  host: "db",
  user: "root",
  password: "password",
  database: "CocktailAppDB",
});
connection.connect((err: MysqlError | null) => {
  if (err) {
    console.error("Erreur de connexion: " + err.message);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});


app.get("/", (req: Request, res: Response): void => {
  console.log("Hello there");
  res.send("Hello there");
});

app.post("/login", (req: Request, res: Response): void => {
  const { email, password }: { email?: string; password?: string } = req.body;

  // Vérifier que l'email et le mot de passe sont fournis
  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
    return;
  }

  // Vérifier les informations d'identification
  const query = "SELECT * FROM Users WHERE Email = ?";
  connection.query(query, [email], (error: MysqlError | null, results: any[]) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error checking user credentials",
        error: error.message,
      });
      return;
    }

    if (results.length === 0) {
      // Aucun utilisateur trouvé avec cet email
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      const user = results[0];

      // Vérifier si le mot de passe correspond
      if (user.Password !== password) {
        res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      } else {
        // Connexion réussie
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: user.ID,
            email: user.Email,
            first_name: user.First_name,
            last_name: user.Last_name,
            role: user.Role,
          },
        });
      }
    }
  });
});


app.post("/register", (req: Request, res: Response): void => {
  const { email, first_name, last_name, password, role }: { 
    email?: string; 
    first_name?: string; 
    last_name?: string; 
    password?: string; 
    role?: string 
  } = req.body;

  // Vérifier que tous les champs requis sont présents
  if (!email || !first_name || !last_name || !password || !role) {
    res.status(400).json({
      success: false,
      message: "All fields (email, first_name, last_name, password, role) are required",
    });
    return;
  }

  // Vérifier si l'utilisateur existe déjà
  const query = "SELECT * FROM Users WHERE Email = ?";
  connection.query(query, [email], (error: MysqlError | null, results: any[]) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error checking user existence",
        error: error.message,
      });
      return;
    }

    if (results.length > 0) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });
    } else {
      // Insérer un nouvel utilisateur
      const insertQuery = `
        INSERT INTO Users (ID, Email, First_name, Last_name, Password, Role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      connection.query(
        insertQuery,
        [uuidv4(), email, first_name, last_name, password, role],
        (err: MysqlError | null) => {
          if (err) {
            res.status(500).json({
              success: false,
              message: "Error registering user",
              error: err.message,
            });
            return;
          }

          // Récupérer l'ID de l'utilisateur inséré
          const getIDQuery = "SELECT ID FROM Users WHERE Email = ?";
          connection.query(getIDQuery, [email], (err: MysqlError | null, result: any[]) => {
            if (err) {
              res.status(500).json({
                success: false,
                message: "Error retrieving user ID",
                error: err.message,
              });
              return;
            }

            // Succès
            res.status(201).json({
              success: true,
              message: "User registered successfully",
              id: result[0]?.ID,
            });
          });
        }
      );
    }
  });
});

app.use("/cocktailImage", express.static(path.join(__dirname, "Image")));

app.get("/fetchCocktails", (req: Request, res: Response): void => {
  const query = `
    SELECT DISTINCT Cocktails.ID AS CocktailID,
        Cocktails.Name AS CocktailName,
        Cocktails.Taste,
        Cocktails.Image,
        Cocktails.CreatorID,
        Ingredients.ID AS IngredientID,
        Ingredients.Name AS IngredientName,
        Ingredients.Categ
    FROM Cocktails
    JOIN CocktailIngredients ON Cocktails.ID = CocktailIngredients.CocktailID
    JOIN Ingredients ON CocktailIngredients.IngredientID = Ingredients.ID
    WHERE Cocktails.Valid = 1
    GROUP BY Cocktails.ID;
`;
  connection.query(query, (error: MysqlError | null, results: any[]) => {
    if (error) {
      res.status(500).json({ success: false, message: error.message });
      return;
    }
    res.json({ success: true, cocktails: results });
    console.log(results);
  });
});

app.get("/fetchCocktail", (req, res) => {
  const query = `
  SELECT DISTINCT Cocktails.*, Ingredients.*
  FROM Cocktails
  JOIN CocktailIngredients ON Cocktails.ID = CocktailIngredients.CocktailID
  JOIN Ingredients ON CocktailIngredients.IngredientID = Ingredients.ID
  WHERE Cocktails.Valid = 1 AND Cocktails.ID = ?;
`;
  connection.query(query, req.body.id, (error, results) => {
    if (error) {
      res.status(500).json({ success: false, message: error.message });
      return;
    }
    res.json({ success: true, cocktails: results });
    console.log(results);
  });
});

app.post("/profil", (req: Request, res: Response): void => {
    // const { email, first_name, last_name, password, role }: { 
    //     email?: string; 
    //     first_name?: string; 
    //     last_name?: string; 
    //     password?: string; 
    //     role?: string 
    //   } = req.body;
    const {
    ID,
    selectedGender,
    Name,
    Surname,
    Pseudo,
    Age,
    City,
  }: {
    ID?: number;
    selectedGender?: string;
    Name?: string;
    Surname?: string;
    Pseudo?: string;
    Age?: number;
    City?: string;
  } = req.body;

  if (!ID || !selectedGender || !Name || !Surname || !Pseudo || !Age || !City) {
    res
      .status(400)
      .json({ success: false, message: "All fields are required" });
    return;
  }

  const query = "SELECT * FROM Users WHERE ID = ?";
  connection.query(query, [ID], (error: MysqlError | null, results: any[]) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error updating profile",
        error: error.message,
      });
      return;
    }

    if (results.length > 0) {
      const updateQuery = `
                UPDATE Users
                SET Genre           = ?,
                    Nom             = ?,
                    Prenom          = ?,
                    Nom_utilisateur = ?,
                    Age             = ?,
                    loc             = ?
                WHERE ID = ?
            `;
      connection.query(
        updateQuery,
        [selectedGender, Name, Surname, Pseudo, Age, City, ID],
        (err: MysqlError | null) => {
          if (err) {
            res.status(500).json({ success: false, message: err.message });
            return;
          }
          res.json({
            success: true,
            message: "Profile updated successfully",
          });
        }
      );
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});

