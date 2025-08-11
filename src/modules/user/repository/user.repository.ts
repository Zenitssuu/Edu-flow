import prisma from "../../../prisma/client.ts";

export const userRepository = {
  create: (data: { name: string; email: string }) => {
    return prisma.user.create({ data });
  },
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
  findAll: () => {
    return prisma.user.findMany();
  },
};
