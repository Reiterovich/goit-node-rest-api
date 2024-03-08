import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

export async function getContactById(id) {
  const contact = await listContacts();
  const result = contact.find((item) => item.id === id);

  return result || null;
}

export async function addContact({ name, email, phone }) {
  const contact = await listContacts();
  const id = nanoid();

  const newContact = {
    id: id,
    name: name,
    email: email,
    phone: phone,
  };

  contact.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  const contactAdd = await getContactById(id);
  return contactAdd;
}

export async function removeContact(contactId) {
  const contact = await listContacts();
  const index = contact.findIndex((item) => item.id === contactId);

  if (index === -1) {
    return null;
  }
  const [result] = contact.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  return result;
}

export const updateContactById = async (id, data) => {
  const contact = await listContacts();
  const index = contact.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contact[index] = { ...contact[index], ...data };
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));

  return contact[index];
};
