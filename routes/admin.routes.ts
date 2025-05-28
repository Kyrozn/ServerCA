import { Router } from "express";
import {
  getUnvalidCocktails,
  approveCocktail,
  getAllUsers,
  rejectCocktail,
  deleteUser,
} from "../controllers/admin.controller";

const router = Router();

router.get("/getAllUsers", getAllUsers);
router.get("/getUnvalidCocktails", getUnvalidCocktails);
router.post("/approveCocktail", approveCocktail);
router.post("/rejectCocktail", rejectCocktail);
router.post("/deleteUser", deleteUser);

export default router;
