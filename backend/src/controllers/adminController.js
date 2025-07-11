const { Product, User, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/images/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Helper function to safely delete image files
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  try {
    const fullPath = path.join(__dirname, '../../public', imagePath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Error deleting image file:', imagePath, err);
      } else if (!err) {
        console.log('✅ [FILE] Successfully deleted:', imagePath);
      }
    });
  } catch (error) {
    console.error('Error processing image deletion:', imagePath, error);
  }
};

// Helper function to delete multiple image files
const deleteImageFiles = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return;

  imagePaths.forEach((imagePath) => {
    deleteImageFile(imagePath);
  });
};

// Export upload middleware for use in routes
exports.uploadProductImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 },
]);

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.count(),
      Order.count(),
      User.count(),
      Order.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      }),
      Product.findAll({
        where: {
          stock: {
            [Op.lte]: 5,
          },
        },
        order: [['stock', 'ASC']],
        limit: 10,
      }),
    ]);

    // Calculate total revenue (sử dụng tên trường đúng với DB)
    const totalRevenue =
      (await Order.sum('total_amount', {
        where: {
          order_status: 'delivered', // Sử dụng order_status thay vì status
        },
      })) || 0;

    const stats = {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customer: order.User?.name || 'Unknown',
        total: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      })),
      lowStockProducts: lowStockProducts.map((product) => ({
        id: product.id,
        name: product.name,
        stock: product.stock,
      })),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Product Management
exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'DESC',
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      whereClause.category = category;
    }

    // Add status filter
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Validate sort fields
    const allowedSortFields = [
      'name',
      'price',
      'stock',
      'created_at',
      'updated_at',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: [[validSortBy, validSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id',
        'name',
        'description',
        'category',
        'price',
        'sale_price',
        'stock',
        'image_url',
        'images',
        'status',
        'tags',
        'sizes',
        'colors',
        'sku',
        'slug',
        'created_at',
        'updated_at',
      ],
    });

    const totalPages = Math.ceil(count / limit);

    const result = {
      products,
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
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Product CRUD operations
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      sale_price,
      stock,
      status,
      tags,
      sizes,
      colors,
      sku,
      slug,
    } = req.body;

    // Validate required fields
    if (!name || !category || !price || !stock) {
      return res.status(400).json({
        message:
          'Vui lòng điền đầy đủ thông tin bắt buộc (tên, danh mục, giá, tồn kho)',
      });
    }

    // Process uploaded images
    let image_url = null;
    let images = [];

    if (req.files) {
      // Main image
      if (req.files.mainImage && req.files.mainImage[0]) {
        image_url = `/images/products/${req.files.mainImage[0].filename}`;
      }

      // Additional images
      if (req.files.additionalImages) {
        images = req.files.additionalImages.map(
          (file) => `/images/products/${file.filename}`
        );
      }
    }

    // Generate slug if not provided
    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price: parseFloat(price),
      sale_price: sale_price ? parseFloat(sale_price) : null,
      stock: parseInt(stock),
      image_url,
      images: images, // Direct array, not JSON string
      status: status || 'active',
      tags: tags || null, // Keep as string for now
      sizes: sizes ? sizes.split(',').map((size) => size.trim()) : [], // Array
      colors: colors ? colors.split(',').map((color) => color.trim()) : [], // Array
      sku: sku || `SKU-${Date.now()}`,
      slug: productSlug,
    });

    console.log('✅ [ADMIN] Product created successfully:', product.id);
    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product,
    });
  } catch (error) {
    console.error('❌ [ADMIN] Error creating product:', error);

    // Clean up uploaded files if product creation fails
    if (req.files) {
      const filesToDelete = [];
      if (req.files.mainImage) {
        filesToDelete.push(...req.files.mainImage);
      }
      if (req.files.additionalImages) {
        filesToDelete.push(...req.files.additionalImages);
      }

      filesToDelete.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting uploaded file:', file.filename, err);
          } else if (!err) {
            console.log('✅ [CLEANUP] Deleted uploaded file:', file.filename);
          }
        });
      });
    }

    res.status(500).json({
      message: 'Lỗi tạo sản phẩm',
      error: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: [
        'id',
        'name',
        'description',
        'category',
        'price',
        'sale_price',
        'stock',
        'image_url',
        'images',
        'status',
        'tags',
        'sizes',
        'colors',
        'sku',
        'slug',
        'created_at',
        'updated_at',
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Return product data directly (no JSON parsing needed for arrays)
    res.json(product);
  } catch (error) {
    console.error('❌ [ADMIN] Error getting product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      category,
      price,
      sale_price,
      stock,
      status,
      tags,
      sizes,
      colors,
      sku,
      slug,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Process uploaded images
    let updateData = {
      name: name || product.name,
      description: description || product.description,
      category: category || product.category,
      price: price ? parseFloat(price) : product.price,
      sale_price: sale_price ? parseFloat(sale_price) : product.sale_price,
      stock: stock ? parseInt(stock) : product.stock,
      status: status || product.status,
      tags: tags
        ? JSON.stringify(tags.split(',').map((tag) => tag.trim()))
        : product.tags,
      sizes: sizes
        ? JSON.stringify(sizes.split(',').map((size) => size.trim()))
        : product.sizes,
      colors: colors
        ? JSON.stringify(colors.split(',').map((color) => color.trim()))
        : product.colors,
      sku: sku || product.sku,
      slug: slug || product.slug,
    };

    // Handle image updates
    if (req.files) {
      // Update main image
      if (req.files.mainImage && req.files.mainImage[0]) {
        // Delete old main image only if not keeping it
        if (product.image_url && !req.body.keepOldMainImage) {
          deleteImageFile(product.image_url);
        }
        updateData.image_url = `/images/products/${req.files.mainImage[0].filename}`;
      }

      // Update additional images
      if (req.files.additionalImages) {
        // Handle keeping old additional images
        let newAdditionalImages = req.files.additionalImages.map(
          (file) => `/images/products/${file.filename}`
        );

        // If keeping some old images, merge them
        if (req.body.keepOldAdditionalImages) {
          const keepFlags = JSON.parse(
            req.body.keepOldAdditionalImages || '[]'
          );
          const oldImages = product.images || [];

          const keptOldImages = oldImages.filter(
            (img, index) => keepFlags[index]
          );
          const deletedOldImages = oldImages.filter(
            (img, index) => !keepFlags[index]
          );

          // Delete images that are not being kept
          if (deletedOldImages.length > 0) {
            deleteImageFiles(deletedOldImages);
          }

          // Merge kept old images with new images
          updateData.images = [...keptOldImages, ...newAdditionalImages];
        } else {
          // Delete all old additional images if not keeping any
          if (product.images && product.images.length > 0) {
            deleteImageFiles(product.images);
          }
          updateData.images = newAdditionalImages;
        }
      }
    }

    await product.update(updateData);

    console.log('✅ [ADMIN] Product updated successfully:', product.id);
    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product,
    });
  } catch (error) {
    console.error('❌ [ADMIN] Error updating product:', error);

    // Clean up uploaded files if update fails
    if (req.files) {
      const filesToDelete = [];
      if (req.files.mainImage) {
        filesToDelete.push(...req.files.mainImage);
      }
      if (req.files.additionalImages) {
        filesToDelete.push(...req.files.additionalImages);
      }

      filesToDelete.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error('Error deleting uploaded file:', file.filename, err);
          } else if (!err) {
            console.log('✅ [CLEANUP] Deleted uploaded file:', file.filename);
          }
        });
      });
    }

    res.status(500).json({
      message: 'Lỗi cập nhật sản phẩm',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Delete product images
    if (product.image_url) {
      deleteImageFile(product.image_url);
    }

    if (product.images && product.images.length > 0) {
      deleteImageFiles(product.images);
    }

    await product.destroy();

    console.log('✅ [ADMIN] Product deleted successfully:', id);
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('❌ [ADMIN] Error deleting product:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'Danh sách ID sản phẩm không hợp lệ' });
    }

    // Get products to delete their images
    const products = await Product.findAll({
      where: { id: productIds },
    });

    // Delete images
    products.forEach((product) => {
      if (product.image_url) {
        deleteImageFile(product.image_url);
      }

      if (product.images && product.images.length > 0) {
        deleteImageFiles(product.images);
      }
    });

    // Delete products
    const deletedCount = await Product.destroy({
      where: { id: productIds },
    });

    console.log(`✅ [ADMIN] Bulk deleted ${deletedCount} products`);
    res.json({
      message: `Xóa thành công ${deletedCount} sản phẩm`,
      deletedCount,
    });
  } catch (error) {
    console.error('❌ [ADMIN] Error bulk deleting products:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'out_of_stock'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    await product.update({ status });
    console.log(`✅ [ADMIN] Product status updated: ${id} -> ${status}`);
    res.json({ message: 'Cập nhật trạng thái sản phẩm thành công' });
  } catch (error) {
    console.error('❌ [ADMIN] Error updating product status:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Order Management
exports.getAllOrders = async (req, res) => {
  try {
    console.log('🛒 [ORDERS] Getting all orders...');
    const orders = await Order.findAll({
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
      order: [['created_at', 'DESC']],
    });

    console.log(`🛒 [ORDERS] Found ${orders.length} orders`);

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      customer_name: order.User?.name || 'Unknown',
      customer_email: order.User?.email || '',
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      items:
        order.OrderItems?.map((item) => ({
          product_name: item.Product?.name || 'Unknown',
          quantity: item.quantity,
          price: item.price,
        })) || [],
    }));

    console.log(
      '🛒 [ORDERS] Sample orders:',
      formattedOrders.slice(0, 2).map((o) => ({
        id: o.id,
        customer: o.customer_name,
        total: o.total_amount,
      }))
    );

    res.json(formattedOrders);
  } catch (error) {
    console.error('❌ [ORDERS] Error fetching orders:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      'pending',
      'confirmed',
      'shipping',
      'completed',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    await order.update({ status });
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    console.log('👥 [USERS] Getting all users...');

    // Test query đơn giản nhất
    const users = await User.findAll({
      raw: true, // Trả về plain object
      attributes: [
        'id',
        'name',
        'email',
        'phone',
        'role',
        'status',
        'created_at',
      ],
    });

    res.json(users);
  } catch (error) {
    console.error('❌ [USERS] Error fetching users:', error.message);
    console.error('❌ [USERS] Error details:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
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
    res.json({ message: 'Cập nhật trạng thái người dùng thành công' });
  } catch (error) {
    console.error('Error updating user status:', error);
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
    res.json({ message: 'Cập nhật quyền người dùng thành công' });
  } catch (error) {
    console.error('Error updating user role:', error);
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
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
