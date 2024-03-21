import jwt from "jsonwebtoken";

import * as authService from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authService.signup(req.body);

  res.status(201).json({
    username: newUser.username,
    useremail: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUser({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const comparePassword = await authService.validatePassword(
    password,
    user.password
  );
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await authService.updateUser({ _id: id }, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;
  res.json({
    username,
    email,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authService.updateUser({ _id }, { token: "" });

  res.json({
    message: "Signout seccess!",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
};
