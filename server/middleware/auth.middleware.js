import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Защита маршрутов — проверка аутентификации
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Не авторизован, токен не действителен' });
    }
  }

  return res.status(401).json({ message: 'Не авторизован, токен не предоставлен' });
};

// Проверка прав администратора
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Доступ запрещен, требуются права администратора' });
  }
};