const jwt = require('jsonwebtoken');
const dbHelper = require('../utils/dbHelper');

module.exports = {
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required. No token provided.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key');
      
      const user = await dbHelper.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists.' });
      }

      if (user.isBanned) {
        return res.status(403).json({ message: 'This user account has been suspended by an administrator.' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Authentication error:', err);
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  },

  adminOnly(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    }
    next();
  }
};
