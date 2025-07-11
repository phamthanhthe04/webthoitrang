const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists first
    const tableDescription = await queryInterface.describeTable('products');

    if (!tableDescription.category) {
      await queryInterface.addColumn('products', 'category', {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Uncategorized',
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'category');
  },
};
