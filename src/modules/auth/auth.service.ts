import bcrypt from "bcrypt";
import prisma from "../../prisma/client";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/utils";

export class AuthService {
  static async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    });

    // console.log("user after registering", user);
    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  static async refresh(token: string) {
    try {
      const payload = verifyRefreshToken(token) as { userId: string };
      const stored = await prisma.refreshToken.findUnique({ where: { token } });
      if (!stored) throw new Error("Invalid refresh token");

      const accessToken = signAccessToken({ userId: payload.userId });
      return { accessToken };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  static async logout(token: string) {
    await prisma.refreshToken.delete({ where: { token } });
  }
}
