import express from "express";
import dotenv from "dotenv";
import userRoutes from "./modules/user/routes/user.routes.ts";
import authRoutes from "./modules/auth/auth.routes.ts";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;
