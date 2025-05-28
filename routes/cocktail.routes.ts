import { Router } from "express";
import {
  getAllCocktails,
  getCocktailDetails,
  getCocktailsFiltered,
  searchCocktail
} from "../controllers/cocktail.controller";

const router = Router();

router.get("/fetchCocktails", getAllCocktails);
router.post("/fetchCocktail", getCocktailDetails);
router.post("/filterCocktails", getCocktailsFiltered);
router.post("/searchCocktail", searchCocktail);

export default router;
