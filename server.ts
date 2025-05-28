import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import authRoutes from "./routes/auth.routes";
import cocktailRoutes from "./routes/cocktail.routes";
import adminRoutes from "./routes/admin.routes"
const router = express.Router();
import upload from "./middlewares/multer";
import { createRecipe } from "./controllers/recipes.controller";
const app = express();
const PORT = 5050;

app.use(cors());
app.use(bodyParser.json());

// Static files (e.g. images)
app.use("/cocktailImage", express.static(path.join(__dirname, "Image")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cocktails", cocktailRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/recipes", upload.single("photo"), createRecipe);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
