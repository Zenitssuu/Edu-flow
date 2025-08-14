// src/modules/workflow/workflow.service.ts
import prisma from "../../prisma/client.ts"; // your prisma instance
import {
  CreateWorkflowDTO,
  UpdateWorkflowDTO,
  CreateStepDTO,
} from "./workflow.dto";
import { Difficulty } from "@prisma/client";

function normalizeDifficulty(input: string | Difficulty): Difficulty {
  if (typeof input !== "string") return input;
  const value = input.toUpperCase();
  if (value in Difficulty) return Difficulty[value as keyof typeof Difficulty];
  throw new Error(`Invalid difficulty value: ${input}`);
}

export class WorkflowService {
  async createWorkflow(payload: CreateWorkflowDTO, userId: string) {
    console.log(payload);
    console.log(userId);

    const difficulty = normalizeDifficulty(payload.difficulty);
    const steps = payload.steps ?? [];

    return prisma.workflow.create({
      data: {
        title: payload.title,
        description: payload.description,
        difficulty,
        createdById: userId,
        steps: {
          create: steps.map((s: CreateStepDTO, index) => ({
            title: s.title,
            description: s.description,
            order: index + 1,
          })),
        },
      },
      include: {
        steps: { orderBy: { order: "asc" } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async getAllWorkflows() {
    return prisma.workflow.findMany({
      include: {
        steps: { orderBy: { order: "asc" } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async getWorkflowById(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
      include: {
        steps: { orderBy: { order: "asc" } },
        createdBy: { select: { id: true, email: true, name: true } },
      },
    });
  }

  async updateWorkflow(id: string, payload: CreateWorkflowDTO, userId: string) {
    const difficulty = normalizeDifficulty(payload.difficulty);
    const steps = payload.steps ?? [];

    return prisma.$transaction(async (tx) => {
      // Step 1: Verify workflow belongs to user
      const existing = await tx.workflow.findUnique({
        where: { id },
        select: { createdById: true },
      });

      if (!existing) {
        throw new Error("Workflow not found");
      }
      if (existing.createdById !== userId) {
        throw new Error("Unauthorized");
      }

      // Step 2: Delete all existing steps
      await tx.workflowStep.deleteMany({
        where: { workflowId: id },
      });

      // Step 3: Recreate steps
      if (steps.length > 0) {
        await tx.workflowStep.createMany({
          data: steps.map((s: CreateStepDTO, index) => ({
            title: s.title,
            description: s.description,
            order: index + 1,
            workflowId: id,
          })),
        });
      }

      // Step 4: Update workflow fields
      await tx.workflow.update({
        where: { id },
        data: {
          title: payload.title,
          description: payload.description,
          difficulty,
        },
      });

      // Step 5: Return updated workflow
      return tx.workflow.findUnique({
        where: { id },
        include: {
          steps: { orderBy: { order: "asc" } },
          createdBy: { select: { id: true, email: true, name: true } },
        },
      });
    });
  }

  async deleteWorkflow(id: string) {
    const workflow = await prisma.workflow.findUnique({ where: { id } });
    if (!workflow) {
      throw new Error("Workflow not found");
    }
    return prisma.workflow.delete({ where: { id } });
  }

  async getWorkflowsByUserId(userId: string) {
    // console.log("here 2")
    return prisma.workflow.findMany({
      where: { createdById: userId },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        createdBy: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
