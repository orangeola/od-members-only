var express = require('express');
var router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");

const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult, isEmail, check } = require("express-validator");



router.get('/', function(req, res, next) {
  Message.find()
  .populate("author")
  .then((messages)=>{
    console.log(messages);
    res.render('index', { title: 'Express', messages: messages});
  }).catch((err)=>{
    return next(err);
  })
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

router.get("/membership-admin", (req, res, next) => {
  if(!res.locals.currentUser){
    res.redirect("/");
  }
  res.render('membership-admin', { title: 'Membership/Admin Page'});
});

router.post("/admin-login", [

  body("adminpass", "Guess something...")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {
    let errors = validationResult(req);
    let user = res.locals.currentUser;

    if (!errors.isEmpty()) {
      res.render("membership-admin", {
        title: "Membership/Admin Page",
        admin_errors: errors.array(),
      });
    } else {

    if(req.body.adminpass === "pentapenguin"){
      user.admin = true;
      User.findByIdAndUpdate(user._id, user, {}).catch((err)=>{
        if (err) {
          return next(err);
        }
      })
    }
    res.redirect("/");
    }
}]);

router.post("/member-login", [

  body("memberpass", "Guess something...")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {
    let errors = validationResult(req);
    let user = res.locals.currentUser;

    if (!errors.isEmpty()) {
      res.render("membership-admin", {
        title: "Membership/Admin Page",
        member_errors: errors.array(),
      });
    } else {
      if(req.body.memberpass === "orangepuffle"){
      user.membership = true;
      User.findByIdAndUpdate(user._id, user, {}).catch((err)=>{
        if (err) {
          return next(err);
        }
      })}
      res.redirect("/");
  }
}]);

router.get("/new-message", (req, res, next) => {
  if(!res.locals.currentUser){
    res.redirect("/");
  }
  res.render('new_message', { title: 'New Message'});
});

router.post("/new-message", [
  body("title", "Needs a title mate")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("message", "Why did you even come here?")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {
    let errors = validationResult(req);
    let user = res.locals.currentUser;

    const message = new Message({ 
      title: req.body.title, 
      text: req.body.message,
      time_stamp: new Date(),
      author: user._id,
    });

    if (!errors.isEmpty()) {
      res.render("new_message", {
        title: "New Message",
        errors: errors.array(),
      });
    } else {
      message.save().then(() => {
        res.redirect("/");
      }).catch((err)=>{
        return next(err);
      })
  }
}]);

module.exports = router;
