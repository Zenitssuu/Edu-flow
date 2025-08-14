// src/modules/workflow/workflow.routes.ts
import { Router } from "express";
import { WorkflowController } from "./workflow.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

// ---- SPECIFIC (static) routes first ----
router.get("/myFlows", authenticate, WorkflowController.getByUser);

// ---- General list route ----
router.get("/", authenticate, WorkflowController.getAll);

// ---- Dynamic (param-based) routes last ----
router.get("/:id", authenticate, WorkflowController.getById);
router.post("/", authenticate, WorkflowController.create);
router.put("/:id", authenticate, WorkflowController.update);
router.delete("/:id", authenticate, WorkflowController.delete);

export default router;
