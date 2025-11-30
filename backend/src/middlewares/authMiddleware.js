import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const requireAuth = async (req, res, next) => {
  try {
    console.log(req.path);
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
      return res.status(401).json({ message: 'Không tìm thấy accessToken' });

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (error, decodedUser) => {
        if (error)
          return res
            .status(403)
            .json({ message: 'accessToken hết hạn hoặc không hợp lệ' });

        const user = await User.findById(decodedUser.userId).select(
          '-password'
        );

        if (!user)
          return res.status(404).json({ message: 'User không tồn tại' });
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log('Lỗi xác minh trong middleware: ' + error);
    return res
      .status(500)
      .json({ message: 'Lỗi xác minh trong middleware: ' + error });
  }
};

export default requireAuth;
