const { WishlistItem, Product } = require('../models');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'name',
            'slug',
            'price',
            'sale_price',
            'images',
            'sizes',
            'colors',
            'stock',
          ],
        },
      ],
    });

    res.json({
      success: true,
      data: wishlistItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    console.log('Add to wishlist - req.body:', req.body);
    console.log('Add to wishlist - req.user:', req.user?.id);

    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'product_id is required',
      });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Sản phẩm không tồn tại',
      });
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      where: {
        user_id: req.user.id,
        product_id,
      },
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Sản phẩm đã có trong danh sách yêu thích',
      });
    }

    // Add to wishlist
    const wishlistItem = await WishlistItem.create({
      user_id: req.user.id,
      product_id,
    });

    // Get item with product details
    const fullItem = await WishlistItem.findByPk(wishlistItem.id, {
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'name',
            'slug',
            'price',
            'sale_price',
            'images',
            'sizes',
            'colors',
            'stock',
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: fullItem,
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { product_id } = req.params; // Lấy product_id từ params thay vì id

    const wishlistItem = await WishlistItem.findOne({
      where: {
        product_id: product_id,
        user_id: req.user.id,
      },
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm trong danh sách yêu thích',
      });
    }

    await wishlistItem.destroy();

    res.json({
      success: true,
      data: { product_id },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    await WishlistItem.destroy({
      where: { user_id: req.user.id },
    });

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
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
