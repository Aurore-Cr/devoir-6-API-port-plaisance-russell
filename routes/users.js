const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /users
router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const users = await User.find().select("-password");
    res.render("users/index", { users, error: null });
  } catch (err) {
    res.render("users/index", { users: [], error: err.message });
  }
});

// GET /users/new
router.get("/new", (req, res) => {
  if (req.session.user) {
    return res.redirect("/users");
  }
  res.render("users/new", { error: null });
});

// POST /users
router.post("/", async (req, res) => {
  try {
    await new User(req.body).save();
    res.redirect("/users");
  } catch (err) {
    res.render("users/new", { error: err.message });
  }
});

// GET /users/:email
router.get("/:email", async (req, res) => {
  try {
    const foundUser = await User.findOne({
      email: req.params.email,
    }).select("-password");
    if (!foundUser) return res.redirect("/users");
    res.render("users/show", { foundUser });
  } catch (err) {
    res.redirect("/users");
  }
});

// GET /users/:email/edit
router.get("/:email/edit", async (req, res) => {
  try {
    const foundUser = await User.findOne({
      email: req.params.email,
    }).select("-password");
    if (!foundUser) return res.redirect("/users");
    res.render("users/edit", { foundUser, error: null });
  } catch (err) {
    res.redirect("/users");
  }
});

// POST /users/:email/edit
router.post("/:email/edit", async (req, res) => {
  try {
    if (req.body.password && req.body.password.length >= 6) {
      const foundUser = await User.findOne({ email: req.params.email });
      foundUser.username = req.body.username;
      foundUser.email = req.body.email;
      foundUser.password = req.body.password;
      await foundUser.save();
    } else {
      await User.findOneAndUpdate(
        { email: req.params.email },
        { username: req.body.username, email: req.body.email },
        { new: true, runValidators: true },
      );
    }
    res.redirect("/users");
  } catch (err) {
    const foundUser = await User.findOne({
      email: req.params.email,
    }).select("-password");
    res.render("users/edit", { foundUser, error: err.message });
  }
});

// POST /users/:email/delete
router.post("/:email/delete", async (req, res) => {
  try {
    // Empêcher de supprimer son propre compte
    if (req.params.email === req.session.user.email) {
      return res.redirect("/users");
    }
    await User.findOneAndDelete({ email: req.params.email });
    res.redirect("/users");
  } catch (err) {
    res.redirect("/users");
  }
});

module.exports = router;
