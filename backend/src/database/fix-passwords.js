const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const fixPasswords = async () => {
  try {
    await sequelize.authenticate();
    console.log('Kết nối database thành công.');

    // Tìm các user có mật khẩu chưa được mã hóa (không bắt đầu bằng $2)
    const [users] = await sequelize.query(`
      SELECT id, email, password 
      FROM users 
      WHERE password NOT LIKE '$2%'
    `);

    console.log(`Tìm thấy ${users.length} user có mật khẩu chưa mã hóa.`);

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await sequelize.query(
        `
        UPDATE users 
        SET password = :hashedPassword 
        WHERE id = :userId
      `,
        {
          replacements: {
            hashedPassword,
            userId: user.id,
          },
        }
      );

      console.log(`Đã mã hóa mật khẩu cho user: ${user.email}`);
    }

    console.log('Hoàn thành mã hóa mật khẩu!');
  } catch (error) {
    console.error('Lỗi khi mã hóa mật khẩu:', error);
  } finally {
    await sequelize.close();
  }
};

fixPasswords();
