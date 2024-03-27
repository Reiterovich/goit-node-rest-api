import jwt from "jsonwebtoken";

import fs from "fs/promises";

import path from "path";

import * as authService from "../services/authServices.js";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

const avatarsPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const addAvatars = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const { _id } = req.user;

  await authService.exchangeAvatar(
    { _id },
    { filename },
    { avatarURL: newPath }
  );

  res.json({
    avatarURL: newPath,
  });
};

const signup = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const { email } = req.body;
  const user = await authService.findUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authService.signup(req.body);

  // const { path: oldPath, filename } = req.file;
  // const newPath = path.join(avatarsPath, filename);
  // await fs.rename(oldPath, newPath);

  res.status(201).json({
    user: {
      email: "example@example.com",
      subscription: "starter",
    },
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
    user: {
      email: "example@example.com",
      subscription: "starter",
    },
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await authService.updateUser({ _id }, { token: "" });

  res.sendStatus(204);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  addAvatars: ctrlWrapper(addAvatars),
};
