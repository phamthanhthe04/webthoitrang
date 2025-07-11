const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột updated_at vào bảng wishlist_items
    await queryInterface.addColumn('wishlist_items', 'updated_at', {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    // Cập nhật trigger để tự động update updated_at
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_wishlist_items_updated_at 
      BEFORE UPDATE ON wishlist_items 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa trigger
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS update_wishlist_items_updated_at ON wishlist_items;
    `);

    // Xóa cột updated_at
    await queryInterface.removeColumn('wishlist_items', 'updated_at');
  },
};
