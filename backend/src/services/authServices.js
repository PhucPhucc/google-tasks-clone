import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import User from '../models/User.js';
import Session from '../models/Session.js';
import TaskList from '../models/TaskList.js';

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const registerService = async (email, password, username) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return {
        success: false,
        status: 400,
        message: 'Email hoặc username đã tồn tại',
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    await TaskList.create({
      title: 'Việc cần làm của tôi',
      ownerId: user._id,
      is_default: true,
      member: [],
    });

    return { success: true, status: 201, message: 'Tạo tài khoản thành công' };
  } catch (error) {
    console.log('Lỗi khi gọi register: ' + error);

    return {
      success: false,
      status: 500,
      message: 'Lỗi khi gọi register: ' + error,
    };
  }
};

export const loginService = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user)
      return {
        success: false,
        status: 401,
        message: 'Username hoặc password không chính xác',
      };

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect)
      return {
        success: false,
        status: 401,
        message: 'Username hoặc password không chính xác',
      };

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    const updateSession = await Session.updateOne(
      { userId: user._id },
      {
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      }
    );
    if (!updateSession) {
      await Session.create({
        userId: user._id,
        refreshToken,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
      });
    }
    return {
      success: true,
      status: 200,
      refreshToken,
      REFRESH_TOKEN_TTL,
      accessToken,
      message: `user ${user.username} đăng nhập thành công`,
    };
  } catch (error) {
    console.log('Lỗi khi gọi login: ' + error);
    return {
      success: false,
      status: 500,
      message: 'Lỗi khi gọi login: ' + error,
    };
  }
};

export const logoutService = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });

      res.clearCookie('refreshToken');
    }

    return { success: true, message: 'Đã đăng xuất thành công', status: 204 };
  } catch (error) {
    console.log('Lỗi khi gọi logout: ' + error);
    return {
      success: false,
      status: 500,
      message: 'Lỗi khi gọi logout: ' + error,
    };
  }
};

export const refreshTokenService = async (req, res) => {
  try {
    const token = req.cookie?.refreshToken;

    if (!token) return res.status(401).json({ message: 'token không tồn lại' });

    const session = await Session.findOne({ refreshToken: token });

    if (!session)
      return res
        .status(403)
        .json({ message: 'token không hợp lệ hoặc không tồn tại' });

    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: 'token hết hạn' });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    return res.json({ accessToken });
  } catch (error) {
    console.log('Lỗi khi gọi refreshToken: ' + error);
    return {
      success: false,
      status: 500,
      message: 'Lỗi khi gọi refreshToken: ' + error,
    };
  }
};
