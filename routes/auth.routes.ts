import { Router } from "express";
import {
  CocktailLogin,
  CocktailRegister,
  getUserProfile,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", CocktailLogin);
router.post("/register", CocktailRegister);
router.post("/profil", getUserProfile);

export default router;
