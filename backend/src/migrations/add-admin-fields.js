module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add username field to users table
      await queryInterface.addColumn('users', 'username', {
        type: Sequelize.STRING,
        allowNull: true, // Set to true initially to avoid constraint issues
        unique: true,
      });

      // Update existing users to have username based on email
      await queryInterface.sequelize.query(`
        UPDATE users SET username = SPLIT_PART(email, '@', 1) WHERE username IS NULL
      `);

      // Now make username not null
      await queryInterface.changeColumn('users', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });

      // Update user role enum to include moderator
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_users_role" ADD VALUE 'moderator'
      `);

      // Update user status enum to include banned
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_users_status" ADD VALUE 'banned'
      `);

      // Add new fields to products table
      await queryInterface.addColumn('products', 'category', {
        type: Sequelize.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn('products', 'sale_price', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      });

      await queryInterface.addColumn('products', 'image_url', {
        type: Sequelize.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn('products', 'tags', {
        type: Sequelize.STRING,
        allowNull: true,
      });

      // Update product status enum to include draft
      await queryInterface.sequelize.query(`
        ALTER TYPE "enum_products_status" ADD VALUE 'draft'
      `);

      // Update existing products to have category from categoryId (if you have categories table)
      // This is a simple mapping - you might need to adjust based on your data
      await queryInterface.sequelize.query(`
        UPDATE products SET category = 'Áo sơ mi' WHERE category IS NULL
      `);

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove added columns
      await queryInterface.removeColumn('users', 'username');
      await queryInterface.removeColumn('products', 'category');
      await queryInterface.removeColumn('products', 'sale_price');
      await queryInterface.removeColumn('products', 'image_url');
      await queryInterface.removeColumn('products', 'tags');

      console.log('Migration rollback completed successfully');
    } catch (error) {
      console.error('Migration rollback error:', error);
      throw error;
    }
  },
};
