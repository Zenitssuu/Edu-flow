import { Request, Response } from "express";
import { userService } from "../service/user.service.ts";

export const userController = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, email } = req.body;
      const user = await userService.register(name, email);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
  list: async (req: Request, res: Response) => {
    const users = await userService.listUsers();
    res.json(users);
  },
};
