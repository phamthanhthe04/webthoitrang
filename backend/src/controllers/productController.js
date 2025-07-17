const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình Multer để tải lên hình ảnh
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../public/images/products');
    // Đảm bảo thư mục tải lên tồn tại
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Kiểm tra loại tệp
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
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

// Hàm hỗ trợ xóa tệp hình ảnh một cách an toàn
const deleteImageFile = (imagePath) => {
  if (!imagePath) return;

  try {
    const fullPath = path.join(__dirname, '../../public', imagePath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Lỗi khi xóa tệp hình ảnh:', imagePath, err);
      } else if (!err) {
        console.log('✅ [FILE] Đã xóa thành công:', imagePath);
      }
    });
  } catch (error) {
    console.error('Lỗi khi xử lý xóa hình ảnh:', imagePath, error);
  }
};

// Hàm hỗ trợ xóa nhiều tệp hình ảnh
const deleteImageFiles = (imagePaths) => {
  if (!imagePaths || !Array.isArray(imagePaths)) return;

  imagePaths.forEach((imagePath) => {
    deleteImageFile(imagePath);
  });
};

// Xuất middleware upload để sử dụng trong routes
exports.uploadProductImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 },
]);

// Get all products with filters
const getAllProducts = async (req, res) => {
  try {
    const {
      category_id,
      search,
      min_price,
      max_price,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter conditions
    const where = {};
    if (category_id) where.category_id = category_id;
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    // Build sort conditions
    let order;
    switch (sort) {
      case 'price-asc':
        order = [['price', 'ASC']];
        break;
      case 'price-desc':
        order = [['price', 'DESC']];
        break;
      case 'oldest':
        order = [['created_at', 'ASC']];
        break;
      default: // newest
        order = [['created_at', 'DESC']];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get product by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);

    // Process images data
    let productData = { ...req.body };

    // Generate slug from name if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens

      // Add timestamp to ensure uniqueness
      productData.slug += `-${Date.now()}`;
    }

    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000);
      productData.sku = `SKU-${timestamp}-${randomNum}`;
    }

    // If images array is provided, ensure it's properly formatted
    if (productData.images && Array.isArray(productData.images)) {
      // Keep the images array as is
      productData.images = productData.images.filter((img) => img); // Remove empty strings
    } else if (productData.image_url) {
      // If only single image_url provided, create images array
      productData.images = [productData.image_url];
    }

    // Ensure image_url is set for backward compatibility
    if (
      !productData.image_url &&
      productData.images &&
      productData.images.length > 0
    ) {
      productData.image_url = productData.images[0];
    }

    // Process sizes and colors
    if (productData.sizes && Array.isArray(productData.sizes)) {
      productData.sizes = productData.sizes.filter((size) => size);
    } else {
      productData.sizes = [];
    }

    if (productData.colors && Array.isArray(productData.colors)) {
      productData.colors = productData.colors.filter((color) => color);
    } else {
      productData.colors = [];
    }

    console.log('Final product data:', productData);

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    // Xử lý file upload nếu có
    let updateData = { ...req.body };
    if (req.files) {
      // Main image
      if (req.files.mainImage && req.files.mainImage.length > 0) {
        const mainImageFile = req.files.mainImage[0];
        updateData.image_url = `/images/products/${mainImageFile.filename}`;
      }
      // Additional images
      if (req.files.additionalImages && req.files.additionalImages.length > 0) {
        const additionalImagePaths = req.files.additionalImages.map(
          (file) => `/images/products/${file.filename}`
        );
        updateData.images = additionalImagePaths;
      }
    }

    // Nếu giữ ảnh cũ, không ghi đè
    if (
      updateData.keepOldMainImage === 'true' ||
      updateData.keepOldMainImage === true
    ) {
      delete updateData.image_url;
    }
    if (updateData.keepOldAdditionalImages) {
      // Nếu là chuỗi JSON, parse ra mảng
      let keepArr = updateData.keepOldAdditionalImages;
      if (typeof keepArr === 'string') {
        try {
          keepArr = JSON.parse(keepArr);
        } catch {}
      }
      // Nếu có giữ ảnh cũ, kết hợp ảnh cũ và mới
      if (
        Array.isArray(keepArr) &&
        product.images &&
        product.images.length > 0
      ) {
        const keptImages = product.images.filter((img, idx) => keepArr[idx]);
        if (updateData.images && Array.isArray(updateData.images)) {
          updateData.images = [...keptImages, ...updateData.images];
        } else {
          updateData.images = keptImages;
        }
      }
      delete updateData.keepOldAdditionalImages;
    }

    await product.update(updateData);

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    await product.destroy();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Bulk delete products
const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Danh sách ID sản phẩm không hợp lệ',
      });
    }

    const products = await Product.findAll({
      where: { id: productIds },
    });

    products.forEach((product) => {
      if (product.image_url) {
        deleteImageFile(product.image_url);
      }
      if (product.images && product.images.length > 0) {
        deleteImageFiles(product.images);
      }
    });

    const deletedCount = await Product.destroy({
      where: { id: productIds },
    });

    console.log(`✅ [ADMIN] Đã xóa hàng loạt ${deletedCount} sản phẩm`);
    res.json({
      success: true,
      message: `Xóa thành công ${deletedCount} sản phẩm`,
      data: { deletedCount },
    });
  } catch (error) {
    console.error('❌ [ADMIN] Lỗi khi xóa hàng loạt sản phẩm:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    });
  }
};

// Update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'out_of_stock'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Trạng thái không hợp lệ',
      });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm',
      });
    }

    await product.update({ status });
    console.log(
      `✅ [ADMIN] Đã cập nhật trạng thái sản phẩm: ${id} -> ${status}`
    );

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('❌ [ADMIN] Lỗi khi cập nhật trạng thái sản phẩm:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server',
    });
  }
};

// Xuất middleware upload để sử dụng trong routes
const uploadProductImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 },
]);

module.exports = {
  getAllProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
  updateProductStatus,
  uploadProductImages,
};
