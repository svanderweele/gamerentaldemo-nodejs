const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

require("../models/Game");
const GameModel = mongoose.model("games");

router.get("/", ensureAuthenticated, (req, res) => {
  GameModel.find({ user_id: req.user.id }).then(games => {
    console.log(req.user.id);
    res.render("games/list", { games });
  });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("games/add");
});

router.post("/add", ensureAuthenticated, (req, res) => {
  if (req.body.name === "") {
    req.flash("error_msg", "Please enter a name for the game!");
    res.render("games/add", { name: req.body.name });
  } else {
    const game = new GameModel({
      name: req.body.name,
      user_id: req.user.id
    });
    req.flash("success_msg", "Game created");
    game.save();
    res.redirect("/games");
  }
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  GameModel.findOne(
    { _id: req.params.id, user_id: req.user.id },
    (err, game) => {
      if (game == null) {
        req.flash("error_msg", "Game not found");
        res.redirect("/games");
      } else {
        res.render("games/edit", { game });
      }
    }
  );
});

router.put("/edit/:id", ensureAuthenticated, (req, res) => {
  if (req.body.name === "") {
    req.flash("error_msg", "Please enter a name");
    res.render(`/games/edit/${req.params.id}`, { name: req.body.name });
  } else {
    GameModel.findOne(
      { _id: req.params.id, user_id: req.user.id },
      (err, game) => {
        if (game == null) {
          req.flash("error_msg", "Game not found");
          res.redirect("/games");
        } else {
          game.name = req.body.name;
          game.save();
          req.flash('success_msg', 'Game updated!');
          res.redirect('/games');
        }
      }
    );
  }
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  GameModel.findOne(
    { _id: req.params.id, user_id: req.user.id },
    (err, game) => {
      if (err) throw err;
      if (game === null) {
        req.flash("error_msg", "Game not found!");
        res.redirect("/games");
      } else {
        game.delete();
        req.flash("success_msg", "Game deleted");
        res.redirect("/games");
      }
    }
  );
});

module.exports = router;
