import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsService.listContacts({ owner }, { skip, limit });
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, `Contacts with ${id} not found :(`);
  }

  res.json(result);
};

const createContact = async (req, res) => {
  console.log(req);
  const { _id: owner } = req.user;
  const result = await contactsService.addContact({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateContactById(id, req.body);
  if (!result) {
    throw HttpError(404, `Contacts with ${id} not found  :(`);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, `Contacts with ${id} not found :(`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.updateStatusContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
