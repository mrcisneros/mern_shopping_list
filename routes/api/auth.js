/** @format */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
//User Model
const User = require("../../models/User");

//@route POST api/auth
//@desc Authenticate an user
//@access Public
router.post("/", (req, res) => {
  //res.send("register");
  const { email, password } = req.body;
  //Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }
  //Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ msg: "User does not exists." });
    //1.- Validating password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({ msg: "Invalid credentials." });
      //If marches is a correct user so we are going to send the token and the user
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
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

/*Create route that gets the current user data by using the token. We do this because jwt is stateless,
we don't use sessions, it just sends the token, decodes, and sends us the response. So, we need a way to
constantly validate the user that is logedin in out front end. For that we need a route that takes the token
and returns the user data.
1.- Bring in the auth middleware */

//@route GET api/auth/user
//@desc Get user data
//@access Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});
module.exports = router;
