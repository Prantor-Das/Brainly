import { Router } from "express";
import { userMiddleware } from "../middleware/user.js";
import {
  getSharedContent,
  shareContent,
} from "../controllers/brain.controllers.js";

const router = Router();

router.post("/share", userMiddleware, shareContent);

router.get("/:shareLink", userMiddleware, getSharedContent);

export const brainRouter: Router = router;
