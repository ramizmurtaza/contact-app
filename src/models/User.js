// src/models/User.js
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {

    static generateUuid(firstName, lastName) {

        const rand = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
        const firstTwo = (firstName || "").substring(0, 2).toUpperCase();
        const lastTwo = (lastName || "").substring(0, 2).toUpperCase();
        const nano = process.hrtime.bigint().toString(); // nanosecond timestamp
        
        return `${rand}${firstTwo}${lastTwo}${nano}`;

      }
}

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
      type: DataTypes.ENUM("admin", "user", "developer"),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",

    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    paranoid: true,
    deletedAt: "deleted_at",

    hooks: {
        beforeCreate: (user) => {
          user.uuid = User.generateUuid(user.first_name, user.last_name);
        },
      },

    defaultScope: {
        attributes: {
          exclude: ["password", "deleted_at"]
        }
      }
      
  }
);
