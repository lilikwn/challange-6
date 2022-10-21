'use strict';

const {faker} = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    let data = [];
    let amount = 10;

    while(amount--){
      const newData = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      data.push(newData);
    }
    await queryInterface.bulkInsert('user_games', data);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

     await queryInterface.bulkDelete('user_games', null);
  }
};
