import Contact from "../models/contact.js";

const verifyContactOwner = async (req, res, next) => {
  const contactId = req.params.id;
  const userId = req.user._id;

  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (String(contact.owner) !== String(userId)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this contact" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyContactOwner;
