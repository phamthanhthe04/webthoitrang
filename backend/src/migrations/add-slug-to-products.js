const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'slug', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: '',
    });

    // Create unique index for slug
    await queryInterface.addIndex('products', ['slug'], {
      unique: true,
      name: 'products_slug_unique_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('products', 'products_slug_unique_idx');
    await queryInterface.removeColumn('products', 'slug');
  },
};
