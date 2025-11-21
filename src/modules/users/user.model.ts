// 🔹 Core Sequelize imports
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

// 🔹 TypeScript interface for User attributes (DB columns)
export interface UserAttributes {
  id: number;
  uuid: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  contact_code: string | null;
  contact_no: string | null;
  first_time_login: boolean | null;
  is_active: boolean | null;
  is_blocked: boolean | null;
  is_primum_user: boolean | null;
  role: 'admin' | 'user' | 'developer' | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 🔹 Attributes allowed when creating a new User (auto fields are optional)
export type UserCreationAttributes = Optional<
  UserAttributes,
  'id' | 'uuid' | 'created_at' | 'updated_at' | 'deleted_at'
>;

// 🔹 User model class definition
export class User extends Model<UserAttributes, UserCreationAttributes> {
  uuid!: string | null;
  first_name!: string | null;
  last_name!: string | null;

  // Generate custom UUID based on random number + name + high-res time
  static generateUuid(firstName?: string | null, lastName?: string | null): string {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const firstTwo = (firstName || '').substring(0, 2).toUpperCase();
    const lastTwo = (lastName || '').substring(0, 2).toUpperCase();
    const nano = process.hrtime.bigint().toString();

    return `${rand}${firstTwo}${lastTwo}${nano}`;
  }
}

// 🔹 Model initializer (called from your DB setup file)
export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      contact_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      contact_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      first_time_login: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_blocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_primum_user: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'developer'),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
      hooks: {
        beforeCreate: (user: User) => {
          user.uuid = User.generateUuid(user.first_name, user.last_name);
        },
      },
      defaultScope: {
        attributes: { exclude: ['password', 'deleted_at'] },
      },
    }
  );

  return User;
};
