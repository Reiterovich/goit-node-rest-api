import Contact from "../models/contact.js";

export const listContacts = (filter = {}, query = {}) =>
  Contact.find(filter, null, query);

export const addContact = ({ name, email, phone, owner }) =>
  Contact.create({ name, email, phone, owner });

export const getContactById = (id) => Contact.findById(id);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const removeContact = (id) => Contact.findByIdAndDelete(id);

export const updateStatusContact = (id, body) =>
  Contact.findByIdAndUpdate(id, body);
