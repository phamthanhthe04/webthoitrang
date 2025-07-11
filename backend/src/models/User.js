const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

class User extends Model {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Tên người dùng',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      comment: 'Email đăng nhập',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Mật khẩu đã mã hóa',
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Số điện thoại',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Địa chỉ',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      comment: 'Vai trò: user, admin',
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      comment: 'Trạng thái: active, inactive',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true, // Sử dụng snake_case cho columns
  }
);

// Mã hóa mật khẩu trước khi lưu
User.beforeCreate(async (user) => {
  user.password = await User.hashPassword(user.password);
});

module.exports = User;
