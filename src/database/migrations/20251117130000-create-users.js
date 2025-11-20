"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: { type: Sequelize.STRING(100), allowNull: true },

      first_name: { type: Sequelize.STRING(100), allowNull: true },
      last_name: { type: Sequelize.STRING(100), allowNull: true },

      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
        unique: true,
      },

      password: { type: Sequelize.STRING(255), allowNull: true },

      contact_code: { type: Sequelize.STRING(10), allowNull: true },
      contact_no: { type: Sequelize.STRING(20), allowNull: true },

      first_time_login: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },

      is_active: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      is_blocked: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      is_primum_user: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },

      role: {
        type: Sequelize.ENUM("admin", "user", "developer"),
        allowNull: true,
        defaultValue: null,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface /*, Sequelize*/) {
    await queryInterface.dropTable("users");
  },
};