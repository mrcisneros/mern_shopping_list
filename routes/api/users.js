/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
//User Model
const User = require("../../models/User");

//@route POST api/users
//@desc Register New user
//@access Public
router.post("/", (req, res) => {
  //res.send("register");
  const { name, email, password } = req.body;
  //Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }
  //Check for existing user
  User.findOne({ email: email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists." });

    const newUser = new User({
      name,
      email,
      password
    });
    //Create salt & hash Creates a password hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          //1.- Sign the token, and pass the payload we want:
          jwt.sign(
            { id: user.id, email: user.email },
            /*Next parameter is going to be the secret */
            config.get("jwtSecret"),
            /*The third parameter is optional and indicates if expired, We will set 1 hour */
            { expiresIn: 3600 },
            /*Finally it takes a call back that returns an error if there is one and the token */
            (err, token) => {
              if (err) throw err;
              /*Return the token with the user */
              res.json({
                token: token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
