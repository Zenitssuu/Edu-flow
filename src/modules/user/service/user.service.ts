import { userRepository } from "../repository/user.repository.ts";

export const userService = {
  register: async (name: string, email: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists");
    return userRepository.create({ name, email });
  },
  listUsers: () => userRepository.findAll()
};
