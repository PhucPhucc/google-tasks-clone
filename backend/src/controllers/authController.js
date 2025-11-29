import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '../services/authServices.js';

export const register = async (req, res) => {
  const { email, password, fullName } = req.body;
  const registerResult = await registerService(email, password, fullName);

  if (!registerResult.success) {
    return res.status(400).json(registerResult.error);
  }

  return res.status(201).json(registerResult);
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;
  const loginResult = await loginService(email, password);

  if (!loginResult.success) {
    return res.status(401).json(loginResult.error);
  }

  return res.status(200).json(loginResult);
};

export const logOut = async (req, res) => {
  const { access_token } = req.body; // client gửi access_token hiện tại

  const resutl = await logoutService();



  if (!resutl.success) {
    return res.status(400).json(resutl.error);
  }

  return res.status(200).json(resutl);
};

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;

  const resutl = await refreshTokenService(refresh_token);

  if (!resutl.success) {
    return res.status(400).json(resutl.error);
  }

  return res.status(200).json(resutl);

};
