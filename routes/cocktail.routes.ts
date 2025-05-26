import { Router } from "express";
import {
  getAllCocktails,
  getCocktailDetails,
  getCocktailsFiltered,
  getUserProfile,
} from "../controllers/cocktail.controller";

const router = Router();

router.get("/fetchCocktails", getAllCocktails);
router.post("/fetchCocktail", getCocktailDetails);
router.post("/filterCocktails", getCocktailsFiltered);
router.post("/profil", getUserProfile);

export default router;
