const sequelize = require('../config/database');

const runMigrations = async () => {
  try {
    // Enable UUID extension
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Create tables
    await sequelize.sync({ force: true });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sequelize.close();
  }
};

runMigrations();
