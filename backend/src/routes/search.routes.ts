import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import { searchContent } from "../controllers/search.controllers.js";

const router = Router();

router.get("/", userMiddleware, searchContent);

export const searchRouter: Router = router;
