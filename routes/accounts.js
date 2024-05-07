const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.get("/logout", async (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

router.get("/login", async (req, res) => {
  const title = "Sign In";
  res.render("login", { hide_login: true, title });
});

router.post("/login", async (req, res) => {
  const username = req.body.username.trim();
  const p1 = req.body.password.trim();

  const user = await req.db.findUserByUsername(username);

  if (user && bcrypt.compareSync(p1, user.Password)) {
    req.session.user = user;
    res.redirect("/");
    return;
  } else {
    res.render("login", {
      hide_login: true,
      message: "Sorry, couldn't sign you in...",
    });
    return;
  }
});

router.get("/signup", async (req, res) => {
  const title = "Sign Up";
  res.render("signup", { hide_login: true, title });
});

router.post("/signup", async (req, res) => {
  try {
    const firstName = req.body.first.trim();
    const lastName = req.body.last.trim();
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();

    if (p1 != p2) {
      res.render("signup", {
        hide_login: true,
        message: "Password do not match!",
      });
      return;
    }
    const user = await req.db.findUserByUsername(username);
    if (user) {
      res.render("signup", {
        hide_login: true,
        message: "This username already exists!",
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(p1, salt);

    const id = await req.db.createUser(firstName, lastName, username, hash);
    req.session.user = await req.db.findUserById(id);

    res.redirect("/");
  } catch (error) {
    res.status(500).send(`Error Signing Up! ${error}`);
  }
});

module.exports = router;
