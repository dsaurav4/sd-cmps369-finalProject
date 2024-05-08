const express = require("express");
const router = express.Router();
const geo = require("node-geocoder");
const geocoder = geo({ provider: "openstreetmap" });

const logged_in = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.render("noaccess", {});
  }
};

router.get("/", async (req, res) => {
  try {
    const heading = "Contact List";
    const contacts = await req.db.getAllContacts();
    isUser = req.session.user ? true : false;
    res.render("contactlist", { contacts, heading, isUser, homePage: true });
  } catch (error) {
    res.status(500).send("Failed to retrieve contacts.");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    const heading = contact.First_Name + " " + contact.Last_Name;
    res.render("contactinfo", { contact, heading });
  } catch (error) {
    res.status(500).send("Failed to retrieve contact.");
  }
});

router.get("/:id/delete", logged_in, async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    const heading = "Delete" + " " + contact.First_Name;
    res.render("delete", { contact, heading });
  } catch (error) {
    res.status(500).send("Failed to retrieve contacts.");
  }
});

router.post("/:id/delete", logged_in, async (req, res) => {
  try {
    await req.db.deleteContact(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Failed to retrieve contacts.");
  }
});

router.get("/:id/edit", logged_in, async (req, res) => {
  try {
    const contact = await req.db.findContactById(req.params.id);
    const heading = "Edit" + " " + contact.First_Name;
    res.render("edit", { contact, heading });
  } catch (error) {
    res.status(500).send("Error editing contact");
  }
});

router.post("/:id/edit", logged_in, async (req, res) => {
  const address = req.body.address;

  const results = await geocoder.geocode(address);

  if (results.length > 0) {
    const { formattedAddress, latitude, longitude } = results[0];

    const contact = {
      title: req.body.title,
      firstName: req.body.first,
      lastName: req.body.last,
      phoneNumber: req.body.phone,
      emailAddress: req.body.email,
      address: formattedAddress,
      contactByEmail: req.body.contact_by_email === "on" ? 1 : 0,
      contactByPhone: req.body.contact_by_phone === "on" ? 1 : 0,
      contactByMail: req.body.contact_by_mail === "on" ? 1 : 0,
      latitude: latitude,
      longitude: longitude,
    };

    try {
      await req.db.updateContact(contact, req.params.id);
      res.redirect(`/${req.params.id}`);
    } catch (error) {
      res.render("edit", {error: "Error editing contact"});
    }
  } else {
    const contact = {
      title: req.body.title,
      firstName: req.body.first,
      lastName: req.body.last,
      phoneNumber: req.body.phone,
      emailAddress: req.body.email,
      contactByEmail: req.body.contact_by_email === "on" ? 1 : 0,
      contactByPhone: req.body.contact_by_phone === "on" ? 1 : 0,
      contactByMail: req.body.contact_by_mail === "on" ? 1 : 0,
    }
    const heading = "Invalid Address"
    res.render("edit", {
      contact,
      heading,
      error:
        "Invalid address provided. Please enter a valid address.",
    });
    return;
  }
});

module.exports = router;
