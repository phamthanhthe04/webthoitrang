const { CartItem, Product } = require('../models');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'sale_price', 'images', 'stock'],
        },
      ],
    });

    res.json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1, size, color } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Sản phẩm không tồn tại',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Số lượng sản phẩm trong kho không đủ',
      });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        user_id: req.user.id,
        product_id,
        size,
        color,
      },
    });

    if (cartItem) {
      // Update quantity if item exists
      await cartItem.update({
        quantity: cartItem.quantity + quantity,
      });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        user_id: req.user.id,
        product_id,
        quantity,
        size,
        color,
      });
    }

    // Get updated cart item with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'sale_price', 'images', 'stock'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: updatedCartItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'sale_price', 'images', 'stock'],
        },
      ],
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm trong giỏ hàng',
      });
    }

    if (cartItem.Product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Số lượng sản phẩm trong kho không đủ',
      });
    }

    await cartItem.update({ quantity });

    res.json({
      success: true,
      data: cartItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy sản phẩm trong giỏ hàng',
      });
    }

    await cartItem.destroy();

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

// Clear cart
const clearCart = async (req, res) => {
  try {
    await CartItem.destroy({
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
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
