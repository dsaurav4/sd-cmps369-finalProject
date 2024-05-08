const express = require("express");
const router = express.Router();
const geo = require("node-geocoder");
const geocoder = geo({ provider: "openstreetmap" });

router.get("/", async (req, res) => {
  const heading = "New Contact";
  res.render("createnew", { heading });
});

router.post("/", async (req, res) => {
  const heading = "New Contact";
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
      await req.db.addNewContact(contact);
      res.redirect("/");
    } catch (error) {
      console.error("Failed to add new contact:", error);
      res.render("createnew", {
        error: "Failed to add new contact. Please try again.",
      });
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
    };
    res.render("createnew", {
      error: "Invalid address provided. Please enter a valid address.",
      contact,
      heading,
    });
    return;
  }
});

module.exports = router;
