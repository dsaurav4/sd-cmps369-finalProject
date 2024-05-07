const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const contacts = await req.db.getAllContacts();
  res.json({ contacts: contacts });
});

module.exports = router;
