// src/modules/workflow/workflow.dto.ts
import { Difficulty } from "@prisma/client";

// Step DTO
export interface CreateStepDTO {
  title: string;
  description?: string;
}

// Workflow DTO
export interface CreateWorkflowDTO {
  title: string;
  description?: string;
  difficulty: Difficulty | string; // allow string for input, will normalize
  steps?: CreateStepDTO[];
}

export interface UpdateWorkflowDTO {
  title?: string;
  description?: string;
  difficulty?: Difficulty | string;
  steps?: CreateStepDTO[];
}
