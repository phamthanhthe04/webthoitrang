const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 [AUTH] Checking authentication...');
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔐 [AUTH] Token received:', token ? 'Yes' : 'No');

    if (!token) {
      console.log('❌ [AUTH] No token provided');
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 [AUTH] Token decoded, user ID:', decoded.id);

    const user = await User.findByPk(decoded.id);
    console.log(
      '🔐 [AUTH] User found:',
      user ? `${user.name} (${user.role})` : 'No'
    );

    if (!user || user.status !== 'active') {
      console.log('❌ [AUTH] User not found or inactive');
      throw new Error();
    }

    req.token = token;
    req.user = user;
    console.log('✅ [AUTH] Authentication successful');
    next();
  } catch (error) {
    console.log('❌ [AUTH] Authentication failed:', error.message);
    res.status(401).json({
      success: false,
      error: 'Please authenticate',
    });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Admin only.',
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Please authenticate',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

module.exports = {
  auth,
  authenticateToken: auth, // Alias for backward compatibility
  isAdmin,
  requireRole,
};
