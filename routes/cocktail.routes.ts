import { Router } from "express";
import {
  getAllCocktails,
  getCocktailDetails,
  getCocktailsFiltered,
  registerCocktail,
} from "../controllers/cocktail.controller";

const router = Router();

router.get("/fetchCocktails", getAllCocktails);
router.post("/fetchCocktail", getCocktailDetails);
router.post("/filterCocktails", getCocktailsFiltered);
router.post("/registerCocktail", registerCocktail);

export default router;
