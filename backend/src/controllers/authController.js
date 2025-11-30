import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '../services/authServices.js';

export const register = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(409).json({
      success: false,
      message: 'Không thể thiếu username, email, password',
    });
  }

  const registerResult = await registerService(email, password, username);

  if (!registerResult.success) {
    return res.status(registerResult.status).json(registerResult);
  }

  return res.status(registerResult.status).json(registerResult);
};

export const logIn = async (req, res) => {
  const { username, password } = req.body;

  if (!password || !username) {
    return res.status(409).json({
      success: false,
      message: 'Không thể thiếu username, password',
    });
  }

  const loginResult = await loginService(username, password);

  if (!loginResult.success) {
    return res.status(loginResult.status).json(loginResult);
  }

  res.cookie('refreshToken', loginResult.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: loginResult.REFRESH_TOKEN_TTL,
  });
  const { message, accessToken } = loginResult;
  return res.status(loginResult.status).json({ message, accessToken });
};

export const logOut = async (req, res) => {
  const logoutResult = await logoutService(req, res);

  if (!logoutResult.success) {
    return res.status(logoutResult.status).json(logoutResult);
  }

  return res.status(logoutResult.status).json(logoutResult);
};

export const refreshToken = (req, res) => {
  refreshTokenService(req, res);
};
