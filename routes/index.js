var express = require('express');
var router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult, isEmail, check } = require("express-validator");



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/sign-up', function(req, res, next) {
  res.render('sign_up', { title: 'Sign-up!' });
});

router.post('/sign-up', [

  body("username", "Username required")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("email", "Email required")
  .trim()
  .isLength({ min: 3 })
  .escape(),
  body("password", "Password required")
  .trim()
  .isLength({ min: 3 })
  .escape(),
  body("confirmpassword", "Confirm Password required")
  .trim()
  .isLength({ min: 3 })
  .escape(),
  body("confirmpassword", "Confirm Password not the same as Password")
  .custom((value, { req }) => value === req.body.password),
  body('email', 'Please enter a properly formatted email address (example@gmail.com)')
  .isEmail(),

  (req, res, next) => {
    let errors = validationResult(req);

    const user = new User({ 
      username: req.body.username, 
      password: req.body.password,
      email: req.body.email,
      membership: false,
      admin: false 
    });
    
    if (!errors.isEmpty()) {
      res.render("sign_up", {
        title: "Sign-up!",
        errors: errors.array(),
      });
    } else {
      User.findOne({ username: req.body.username }).then((found_user) => {
        if (found_user) {
          res.render("sign_up", {
            title: "Sign-up!",
            errors: [{msg: "Username already exists."}],
          });
        } else {
          bcrypt.hash(user.password, 10).then((hashedPassword) => {
            user.password = hashedPassword;
          }).then(()=>{
            user.save().then(() => {
              res.redirect("/");
              })
          })
        }
      }).catch((err) => {
        return next(err);
      });
    }
  }
]);

router.get('/log-in', function(req, res, next) {
  res.render('log_in', { title: 'Log in!' });
});

router.post('/log-in', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
}));

router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
