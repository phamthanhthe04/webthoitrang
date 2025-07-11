const sequelize = require('../config/database');

const fixUsersTable = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối cơ sở dữ liệu thành công.');

    // Kiểm tra xem cột username có tồn tại không
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'username';
    `);

    if (results.length === 0) {
      console.log('Đang thêm cột username vào bảng users...');

      await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN username VARCHAR(255) UNIQUE;
      `);

      console.log('Đã thêm cột username thành công!');

      // Cập nhật username cho các user hiện có
      console.log('Đang cập nhật username cho các user hiện có...');
      await sequelize.query(`
        UPDATE users 
        SET username = CONCAT(SPLIT_PART(email, '@', 1), '_', EXTRACT(EPOCH FROM NOW())::INTEGER % 10000)
        WHERE username IS NULL;
      `);

      console.log('Đã cập nhật username cho tất cả user!');
    } else {
      console.log('Cột username đã tồn tại.');
    }

    // Kiểm tra và thêm các cột khác nếu cần
    const requiredColumns = [
      { name: 'phone', type: 'VARCHAR(255)', default: 'DEFAULT NULL' },
      { name: 'address', type: 'TEXT', default: 'DEFAULT NULL' },
      { name: 'role', type: "VARCHAR(20) NOT NULL DEFAULT 'user'" },
      { name: 'status', type: "VARCHAR(20) NOT NULL DEFAULT 'active'" },
    ];

    for (const column of requiredColumns) {
      const [columnExists] = await sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = '${column.name}';
      `);

      if (columnExists.length === 0) {
        console.log(`Đang thêm cột ${column.name} vào bảng users...`);
        await sequelize.query(`
          ALTER TABLE users 
          ADD COLUMN ${column.name} ${column.type} ${column.default};
        `);
        console.log(`Đã thêm cột ${column.name} thành công!`);
      }
    }

    console.log('Hoàn tất kiểm tra và sửa chữa bảng users!');
  } catch (error) {
    console.error('Lỗi khi sửa chữa bảng users:', error);
  } finally {
    await sequelize.close();
  }
};

fixUsersTable();
