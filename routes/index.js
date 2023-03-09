var express = require('express');
var router = express.Router();

const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    } else if(user.validateSync()){
      res.render("sign_up", {
        title: "Sign-up!",
        errors: [{msg: "Please enter a properly formatted email (example@gmail.com)"}],
      });
    } else {
      User.findOne({ username: req.body.username }).then((found_user) => {
        if (found_user) {
          res.render("sign_up", {
            title: "Sign-up!",
            errors: [{msg: "Username already exists."}],
          });
        } else {
          user.save().then(() => {
          res.redirect("/");
          }).catch((err) => {
            return next(err);
          });
        }
      }).catch((err) => {
        return next(err);
      });
    }


  }


]);


module.exports = router;
