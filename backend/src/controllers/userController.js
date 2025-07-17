const { User, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');

// Quản lý Người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Role filter
    if (role && role !== 'all') {
      whereClause.role = role;
    }

    // Status filter
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Sorting
    const allowedSortFields = ['name', 'email', 'role', 'status', 'created_at'];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'role',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    const totalPages = Math.ceil(count / limit);

    const result = {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    res.json(result);
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi lấy người dùng:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'address',
        'role',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Thống kê đơn hàng của user
    const orderStats = await Order.findAll({
      where: { user_id: id },
      attributes: [
        'order_status',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count'],
        [User.sequelize.fn('SUM', User.sequelize.col('total_amount')), 'total'],
      ],
      group: ['order_status'],
      raw: true,
    });

    const result = {
      ...user.toJSON(),
      orderStats,
    };

    res.json(result);
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi lấy thông tin người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'banned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await user.update({ status });

    console.log(
      `✅ [USERS] Đã cập nhật trạng thái người dùng: ${id} -> ${status}`
    );
    res.json({
      message: 'Cập nhật trạng thái người dùng thành công',
      user: {
        id: user.id,
        name: user.name,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi cập nhật trạng thái người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Quyền không hợp lệ' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await user.update({ role });

    console.log(`✅ [USERS] Đã cập nhật quyền người dùng: ${id} -> ${role}`);
    res.json({
      message: 'Cập nhật quyền người dùng thành công',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi cập nhật quyền người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
    }

    await user.destroy();

    console.log(`✅ [USERS] Đã xóa người dùng: ${id}`);
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi xóa người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, action, value } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Danh sách ID người dùng không hợp lệ' });
    }

    let updateData = {};

    if (action === 'status') {
      const validStatuses = ['active', 'inactive', 'banned'];
      if (!validStatuses.includes(value)) {
        return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
      }
      updateData.status = value;
    } else if (action === 'role') {
      const validRoles = ['user', 'moderator', 'admin'];
      if (!validRoles.includes(value)) {
        return res.status(400).json({ message: 'Quyền không hợp lệ' });
      }
      updateData.role = value;
    } else {
      return res.status(400).json({ message: 'Hành động không hợp lệ' });
    }

    const [updatedCount] = await User.update(updateData, {
      where: {
        id: userIds,
        role: { [Op.ne]: 'admin' }, // Không cho phép cập nhật admin
      },
    });

    console.log(`✅ [USERS] Đã cập nhật hàng loạt ${updatedCount} người dùng`);
    res.json({
      message: `Cập nhật thành công ${updatedCount} người dùng`,
      updatedCount,
    });
  } catch (error) {
    console.error('❌ [USERS] Lỗi khi cập nhật hàng loạt người dùng:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
