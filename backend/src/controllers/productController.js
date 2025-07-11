const { Product, Category } = require('../models');
const { Op } = require('sequelize');

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

    await product.update(req.body);

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

module.exports = {
  getAllProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
