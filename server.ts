import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/auth.routes";
import cocktailRoutes from "./routes/cocktail.routes";
const router = express.Router();
const upload = require("../middlewares/multer"); // le fichier avec multer.config
const recipeController = require("../controllers/recipe.controller");
const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

// Static files (e.g. images)
app.use("/cocktailImage", express.static(path.join(__dirname, "Image")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cocktails", cocktailRoutes);

router.post('/api/recipes', upload.single('photo'), recipeController.createRecipe);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
