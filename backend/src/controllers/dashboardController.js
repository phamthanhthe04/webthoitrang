const { Product, User, Order, OrderItem, Category } = require('../models');
const { Op } = require('sequelize');

// Thống kê Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories,
      recentOrders,
      lowStockProducts,
      topSellingProducts,
      monthlyRevenue,
    ] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count(),
      Category.count(),

      // Recent orders
      Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ['name', 'image_url'],
              },
            ],
          },
        ],
      }),

      // Low stock products
      Product.findAll({
        where: {
          stock: {
            [Op.lte]: 5,
          },
        },
        order: [['stock', 'ASC']],
        limit: 10,
      }),

      // Top selling products
      OrderItem.findAll({
        attributes: [
          'product_id',
          [
            OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')),
            'total_sold',
          ],
        ],
        include: [
          {
            model: Product,
            attributes: ['name', 'image_url', 'price'],
          },
        ],
        group: ['product_id', 'Product.id'],
        order: [
          [
            OrderItem.sequelize.fn('SUM', OrderItem.sequelize.col('quantity')),
            'DESC',
          ],
        ],
        limit: 5,
      }),

      // Monthly revenue for the last 12 months
      Order.findAll({
        attributes: [
          [
            Order.sequelize.fn(
              'DATE_TRUNC',
              'month',
              Order.sequelize.col('created_at')
            ),
            'month',
          ],
          [
            Order.sequelize.fn('SUM', Order.sequelize.col('total_amount')),
            'revenue',
          ],
          [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'orders'],
        ],
        where: {
          order_status: 'delivered',
          created_at: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12)),
          },
        },
        group: [
          Order.sequelize.fn(
            'DATE_TRUNC',
            'month',
            Order.sequelize.col('created_at')
          ),
        ],
        order: [
          [
            Order.sequelize.fn(
              'DATE_TRUNC',
              'month',
              Order.sequelize.col('created_at')
            ),
            'ASC',
          ],
        ],
        raw: true,
      }),
    ]);

    // Tính tổng doanh thu
    const totalRevenue =
      (await Order.sum('total_amount', {
        where: {
          order_status: 'delivered',
        },
      })) || 0;

    // Tính doanh thu tháng này
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const thisMonthRevenue =
      (await Order.sum('total_amount', {
        where: {
          order_status: 'delivered',
          created_at: {
            [Op.gte]: thisMonth,
          },
        },
      })) || 0;

    // Tính doanh thu tháng trước
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    const lastMonthEnd = new Date(thisMonth);
    lastMonthEnd.setDate(0);

    const lastMonthRevenue =
      (await Order.sum('total_amount', {
        where: {
          order_status: 'delivered',
          created_at: {
            [Op.gte]: lastMonth,
            [Op.lt]: thisMonth,
          },
        },
      })) || 0;

    // Tính tỷ lệ tăng trưởng
    const revenueGrowth =
      lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    // Order status distribution
    const orderStatusStats = await Order.findAll({
      attributes: [
        'order_status',
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count'],
      ],
      group: ['order_status'],
      raw: true,
    });

    const stats = {
      overview: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalCategories,
        totalRevenue,
        thisMonthRevenue,
        lastMonthRevenue,
        revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      },

      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: order.User?.name || 'Unknown',
        email: order.User?.email || '',
        total: order.total_amount,
        status: order.order_status,
        created_at: order.created_at,
        itemCount: order.OrderItems?.length || 0,
      })),

      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
        image_url: product.image_url,
        price: product.price,
      })),

      topSellingProducts: topSellingProducts.map((item) => ({
        id: item.product_id,
        name: item.Product?.name || 'Unknown',
        image_url: item.Product?.image_url,
        price: item.Product?.price || 0,
        total_sold: parseInt(item.get('total_sold')) || 0,
      })),

      monthlyRevenue: monthlyRevenue.map((item) => ({
        month: item.month,
        revenue: parseFloat(item.revenue) || 0,
        orders: parseInt(item.orders) || 0,
      })),

      orderStatusStats: orderStatusStats.reduce((acc, item) => {
        acc[item.order_status] = parseInt(item.count);
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ [DASHBOARD] Lỗi khi lấy thống kê:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Thống kê theo khoảng thời gian
exports.getRevenueStats = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let dateFormat;
    switch (groupBy) {
      case 'hour':
        dateFormat = 'hour';
        break;
      case 'day':
        dateFormat = 'day';
        break;
      case 'week':
        dateFormat = 'week';
        break;
      case 'month':
        dateFormat = 'month';
        break;
      default:
        dateFormat = 'day';
    }

    const whereClause = {
      order_status: 'delivered',
    };

    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const revenueStats = await Order.findAll({
      attributes: [
        [
          Order.sequelize.fn(
            'DATE_TRUNC',
            dateFormat,
            Order.sequelize.col('created_at')
          ),
          'period',
        ],
        [
          Order.sequelize.fn('SUM', Order.sequelize.col('total_amount')),
          'revenue',
        ],
        [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'orders'],
      ],
      where: whereClause,
      group: [
        Order.sequelize.fn(
          'DATE_TRUNC',
          dateFormat,
          Order.sequelize.col('created_at')
        ),
      ],
      order: [
        [
          Order.sequelize.fn(
            'DATE_TRUNC',
            dateFormat,
            Order.sequelize.col('created_at')
          ),
          'ASC',
        ],
      ],
      raw: true,
    });

    const result = revenueStats.map((item) => ({
      period: item.period,
      revenue: parseFloat(item.revenue) || 0,
      orders: parseInt(item.orders) || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error('❌ [DASHBOARD] Lỗi khi lấy thống kê doanh thu:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// Thống kê sản phẩm
exports.getProductStats = async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      outOfStockProducts,
      productsByCategory,
    ] = await Promise.all([
      Product.count(),
      Product.count({ where: { status: 'active' } }),
      Product.count({ where: { status: 'inactive' } }),
      Product.count({ where: { status: 'out_of_stock' } }),

      Product.findAll({
        attributes: [
          'category_id',
          [
            Product.sequelize.fn('COUNT', Product.sequelize.col('Product.id')),
            'count',
          ],
        ],
        include: [
          {
            model: Category,
            attributes: ['name'],
          },
        ],
        group: ['category_id', 'Category.id'],
        order: [
          [
            Product.sequelize.fn('COUNT', Product.sequelize.col('Product.id')),
            'DESC',
          ],
        ],
        raw: true,
      }),
    ]);

    const stats = {
      total: totalProducts,
      active: activeProducts,
      inactive: inactiveProducts,
      outOfStock: outOfStockProducts,
      byCategory: productsByCategory.map((item) => ({
        category_id: item.category_id,
        category_name: item['Category.name'] || 'Unknown',
        count: parseInt(item.count),
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ [DASHBOARD] Lỗi khi lấy thống kê sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
