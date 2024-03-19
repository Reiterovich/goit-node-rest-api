import express from "express";

import authControllers from "../controllers/authControllers.js";

import validateBody from "../decorators/validateBody.js";

import { userSignupSchema, userSigninSchema } from "../schemas/userSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSignupSchema),
  authControllers.signup
);

authRouter.post(
  "/signin",
  validateBody(userSigninSchema),
  authControllers.signin
);

export default authRouter;
