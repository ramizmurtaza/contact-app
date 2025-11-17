import { User } from "./user.model.js";


export const findAllUsers = async () => {
  return await User.findAll();
};

export const findUserById = async (id: number) => {
  return await User.findByPk(id);
};