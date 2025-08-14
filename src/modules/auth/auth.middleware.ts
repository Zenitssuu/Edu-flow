import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepository } from "../user/repository/user.repository";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);

    const { userEmail } = payload;
    try {
      // console.log(payload)
      const userDetails = await userRepository.findByEmail(userEmail);
      if (!userDetails) {
        return res.status(404).json({ message: "Unauthorized" });
      }
    } catch (error) {
      throw new error();
    }

    (req as any).user = payload;
    next();
  } catch (error){
    console.log("error",error.message)
    return res.status(401).json({ error: "Invalid token" });
  }
};
