import bcrypt from "bcrypt";
import User from "../models/User.js";
import gravatar from "gravatar";

export const findUser = (filter) => User.findOne(filter);

export const signup = async (data) => {
  const email = data.email;
  const avatarURL = gravatar.url(
    email,
    { s: "250", r: "x", d: "retro" },
    false
  );
  const hashPassword = await bcrypt.hash(data.password, 10);
  return User.create({ ...data, avatarURL, password: hashPassword });
};

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
