const sequelize = require('../config/database');

const addCategoryColumn = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if category column exists
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'category';
    `);

    if (results.length === 0) {
      console.log('Adding category column to products table...');

      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT 'Uncategorized';
      `);

      console.log('Category column added successfully!');
    } else {
      console.log('Category column already exists.');
    }

    // Also check and add other potentially missing columns
    const requiredColumns = [
      { name: 'tags', type: 'VARCHAR(255)', default: 'DEFAULT NULL' },
      { name: 'status', type: "VARCHAR(20) NOT NULL DEFAULT 'active'" },
      { name: 'sale_price', type: 'DECIMAL(10,2)', default: 'DEFAULT NULL' },
      { name: 'image_url', type: 'VARCHAR(255)', default: 'DEFAULT NULL' },
    ];

    for (const column of requiredColumns) {
      const [columnExists] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = '${column.name}';
      `);

      if (columnExists.length === 0) {
        console.log(`Adding ${column.name} column to products table...`);
        await sequelize.query(`
          ALTER TABLE products 
          ADD COLUMN ${column.name} ${column.type} ${column.default};
        `);
        console.log(`${column.name} column added successfully!`);
      }
    }
  } catch (error) {
    console.error('Error adding category column:', error);
  } finally {
    await sequelize.close();
  }
};

addCategoryColumn();
