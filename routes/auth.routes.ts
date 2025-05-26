import { Router } from "express";
import {
  CocktailLogin,
  CocktailRegister,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", CocktailLogin);
router.post("/register", CocktailRegister);

export default router;
