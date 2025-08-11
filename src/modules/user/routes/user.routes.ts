import { Router } from "express";
import { userController } from "../controller/user.controller";

const router = Router();

router.post("/", userController.register);
router.get("/", userController.list);

export default router;
