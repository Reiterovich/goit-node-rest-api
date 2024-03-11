import Contact from "../models/contact.js";

export const listContacts = () => Contact.find();

export const addContact = ({ name, email, phone }) =>
  Contact.create({ name, email, phone });

export const getContactById = (id) => Contact.findById(id);

export const updateContactById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export const removeContact = (id) => Contact.findByIdAndDelete(id);
