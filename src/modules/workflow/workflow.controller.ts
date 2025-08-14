// src/modules/workflow/workflow.controller.ts
import { Request, Response } from "express";
import { WorkflowService } from "./workflow.service";

const workflowService = new WorkflowService();

export class WorkflowController {
  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; // assuming auth middleware adds req.user
      const workflow = await workflowService.createWorkflow(req.body, userId);
      res.status(201).json(workflow);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const workflows = await workflowService.getAllWorkflows();
    res.json(workflows);
  }

  static async getById(req: Request, res: Response) {
    try {
      const workflow = await workflowService.getWorkflowById(req.params.id);
      if (!workflow)
        return res.status(404).json({ error: "Workflow not found" });
      res.json(workflow);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Server Error");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId; // assuming auth middleware sets req.user
      const workflowId = req.params.id;
      const payload = req.body;

      const updated = await workflowService.updateWorkflow(
        workflowId,
        payload,
        userId
      );
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await workflowService.deleteWorkflow(req.params.id);
      res.status(204).json({ message: "Successfully deleted" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getByUser(req: Request, res: Response) {
    // console.log("here")
    try {
      const userId = (req as any).user.userId;
      console.log(userId)
      const workflows = await workflowService.getWorkflowsByUserId(userId);
      res.json(workflows);
    } catch (err: any) {
      console.log(err)
      res.status(400).json({ error: err.message });
    }
  }
}
