const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

//Load Routes
const usersRoute = require("./routes/users");
const gamesRoute = require("./routes/games");

//Passport Config
require("./config/passport")(passport);

//DB Config
const db = require("./config/database");

mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error ", err));

//Handlebar Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override Middleware
app.use(methodOverride("_method"));

//Session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {});

app.use("/users", usersRoute);
app.use("/games", gamesRoute);

app.get("/", (req, res) => {
  res.render("index");
});
