import { Router } from "express";
import { signin, signout, signup } from "../controllers/user.controllers.js";

const router = Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.post("/logout", signout);

export const userRouter: Router = router;