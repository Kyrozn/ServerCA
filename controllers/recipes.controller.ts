import { connection } from "../config/db";

// backend/recipes.controller.js ou équivalent
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Dossier de destination
const imageDir = path.join(__dirname, "..", "Image");
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Configuration de multer
const storage = multer.diskStorage({
  destination: (cb: any) => {
    cb(null, imageDir);
  },
  filename: (file: any, cb: any) => {
    const ext = path.extname(file.originalname) || ".png";
    const imageName = `${uuidv4()}${ext}`;
    cb(null, imageName);
  },
});

const upload = multer({ storage });

module.exports = upload;

exports.createRecipe = (req: any, res: any) => {
  const { title, description, ingredientList, recipe, authorId } = req.body;
  const photo = req.file; // multer stocke le fichier ici

  if (
    !title ||
    !description ||
    !ingredientList ||
    !recipe ||
    !authorId ||
    !photo
  ) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newRecipe = {
    title,
    description,
    ingredientList: JSON.parse(ingredientList),
    recipe,
    authorId,
    imagePath: photo.filename,
  };
  const cocktailId = uuidv4();
  const insertQuery = `
  INSERT INTO Cocktails (ID, Name, Description, Recipe, Taste, Volume, Alcohol, Image, CreatorID, Valid)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  connection.query(
    insertQuery,
    [cocktailId, title, description, recipe, null, null, null, 0, authorId, 0],
    (err) => {
      if (err)
        return res.status(500).json({
          success: false,
          message: "Error registering user",
          error: err.message,
        });

        res.status(201).json({ message: "Recette créée", recipe: newRecipe });
    }
  );
};