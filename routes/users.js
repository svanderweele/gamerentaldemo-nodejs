const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const { ensureAuthenticated } = require("../helpers/auth");

require("../models/User");
const User = mongoose.model("users");

router.get("/", (req, res) => {
  User.find()
    .then(users => {
      users.map(user => {
        if (user.lastLogin)
          user.lastLoginString = user.lastLogin.toDateString();
      });
      res.render("users/list", { users });
    })
    .catch(err => console.log("Error getting users ", err));
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/games",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: "Passwords do not match!" });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: "Password not long enough. Must be 4 characters minimum"
    });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors,
      password: req.body.password,
      password2: req.body.password2,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    User.findOne({ email: req.body.email }, user => {
      if (user != null) {
        req.flash("error_msg", "User with that email already exists!");
        res.redirect("/users/register");
      } else {
        let newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save();
            res.redirect("/users/login");
          });
        });
      }
    });
  }
});

router.post("/", (req, res) => {
  let userData = {
    occupation: req.body.occupation,
    name: req.body.name,
    age: req.body.age
  };

  new User(userData).save();

  res.redirect("/users");
});

router.put("/:id", (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    user.name = req.body.name;
    user.age = req.body.age;
    user.occupation = req.body.occupation;

    user
      .save()
      .then(user => {
        req.flash("success_msg", "Updated user successfully!");
        res.redirect("/users");
      })
      .catch(err => console.log("failed to update user ", err));
  });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {

  //Check if user is editing own profile
  if (req.user.id != req.params.id) {
    req.flash("error_msg", "Unauthorized Access");
    res.redirect("/");
    return;
  }

  User.findOne({ _id: req.params.id })
    .then(user => res.render("users/edit", { user }))
    .catch(err => console.log("Failed to get user ", err));

});

router.put("/edit/:id", ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.params.id }).then(user => {
    if (req.body.currentPassword === "") {
      const userDataEntered = user;
      userDataEntered.name = req.body.name;
      userDataEntered.email = req.body.email;
      userDataEntered.newPassword = req.body.newPassword;
      res.render("users/edit", {
        user: userDataEntered,
        error_msg : "Please enter your current password to update the user",
      });
    } else {
      user.name = req.body.name;
      user.email = req.body.email;

      if (req.body.newPassword) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            saveUser();
          });
        });
      } else {
        saveUser();
      }
    }

    function saveUser() {
      user
        .save()
        .then(user => {
          req.flash("success_msg", "Updated user successfully!");
          res.redirect("/users");
        })
        .catch(err => console.log("failed to update user ", err));
    }
  });
});

router.delete("/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Deleted user successfully!");
      res.redirect("/users");
    })
    .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out");
  res.redirect("/users/login");
});

module.exports = router;
