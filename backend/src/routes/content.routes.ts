import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import { addContent, deleteContent, getContent } from "../controllers/content.controllers.js";

const router = Router();

router.post("/", userMiddleware, addContent);

router.get("/", userMiddleware, getContent);

router.delete("/delete", userMiddleware, deleteContent);

export const contentRouter: Router = router;