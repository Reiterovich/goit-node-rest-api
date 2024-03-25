import express from "express";
import contactsController from "../controllers/contactsControllers.js";

import isValidId from "../middlewares/isValidId.js";

import validateBody from "../decorators/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import verifyContactOwner from "../middlewares/verifyContactOwner.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get(
  "/:id",
  verifyContactOwner,
  isValidId,
  contactsController.getOneContact
);

contactsRouter.delete(
  "/:id",
  verifyContactOwner,
  isValidId,
  contactsController.deleteContact
);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsController.createContact
);

contactsRouter.put(
  "/:id",
  verifyContactOwner,
  isValidId,
  validateBody(updateContactSchema),
  contactsController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  verifyContactOwner,
  isValidId,
  validateBody(updateFavoriteSchema),
  contactsController.updateStatusContact
);

export default contactsRouter;
