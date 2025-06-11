import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import transporter from '../mailer.js';

// Генерация JWT токена
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Регистрация пользователя
export const register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
    }

    const user = await User.create({ name, lastName, email, password });

    if (user) {
      const token = generateToken(user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(400).json({ message: 'Ошибка при создании пользователя' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error });
  }
};

// Авторизация пользователя
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Базовая валидация входных данных
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = generateToken(user._id);
    

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    console.error('Login error:', error);

    // Более детальные ошибки
    if (error.name === 'MongoError') {
      return res.status(503).json({ message: 'Ошибка базы данных' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ message: 'Ошибка генерации токена' });
    }

    res.status(500).json({ 
      message: 'Ошибка сервера',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

// Получение данных текущего пользователя
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Ошибка сервеа ', error });
  }
};

// Обновление профиля пользователя
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};