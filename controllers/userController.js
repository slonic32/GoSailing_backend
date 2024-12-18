import {
  geolocationService,
  loginDataService,
  logoutUserDataService,
  regenerateTokenDataService,
  registerDataService,
  safeUserCloneDataService,
  updateUserUserDataService,
} from "../services/userServices.js";

export const register = async (req, res) => {
  const { email, name, phone, password } = req.body;
  const newUser = await registerDataService(email, name, phone, password);

  res.status(200).json({
    user: { name, email, phone },
    token: newUser.token,
    refreshtoken: newUser.refreshtoken,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await loginDataService(email, password);

  res.status(200).json({
    user: { name: user.name, email: user.email, phone: user.phone },
    token: user.token,
    refreshtoken: user.refreshtoken,
  });
};

export const logout = async (req, res) => {
  await logoutUserDataService(req.user);
  res.status(204).json();
};

export const current = async (req, res) => {
  res.status(200).json(safeUserCloneDataService(req.user));
};

export const updateUser = async (req, res, next) => {
  let editedUser = {};

  editedUser = await updateUserUserDataService(req.user, req.body);

  res.status(200).json(safeUserCloneDataService(editedUser));
};

export const refreshTokens = async (req, res) => {
  const { token, refreshtoken } = await regenerateTokenDataService(req.user);
  res.status(200).json({ token, refreshtoken });
};

export const geolocation = async (req, res) => {
  var { ip } = req;
  ip = ip.split(":").pop();

  const { latitude, longitude, ip: returnedIp } = await geolocationService(ip);
  res.status(200).json({ latitude, longitude, returnedIp });
};
