import { Sequelize } from 'sequelize';
import { initUserModel } from '../modules/users/user.model.js';



export const registerModels = (sequelize: Sequelize) => {
  const User = initUserModel(sequelize);
  // Add other models here
  // e.g const Role = initRoleModel(sequelize);
  return { User, /*Role*/ };
};