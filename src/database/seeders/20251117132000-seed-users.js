"use strict";

module.exports = {
  async up(queryInterface) {
    const { faker } = await import("@faker-js/faker");
    const roles = ["admin", "user", "developer"];
    const now = new Date();
    const users = Array.from({ length: 25 }).map(() => {
      const first = faker.person.firstName();
      const last = faker.person.lastName();
      return {
        uuid: faker.string.uuid(),
        first_name: first,
        last_name: last,
        email: faker.internet.email({ firstName: first, lastName: last }).toLowerCase(),
        password: faker.internet.password({ length: 12 }),
        contact_code: `+${faker.string.numeric(2)}`,
        contact_no: faker.string.numeric(10),
        first_time_login: false,
        is_active: true,
        is_blocked: false,
        is_primum_user: false,
        role: faker.helpers.arrayElement(roles),
        created_at: now,
        updated_at: now,
        deleted_at: null,
      };
    });
    await queryInterface.bulkInsert("users", users, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("users", null, {});
  },
};