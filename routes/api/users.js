const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/Users");
// @route     POST api/users
// @desc      Register user
// @acess     Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include is valid email!").isEmail(),
    check("password", "Password is more than 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // see if user exit
    try {
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User alreaday exits!" }] });
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        size: "200",
        rating: "pg",
        default: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Envrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // return jsonWebToken

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include is valid email!").isEmail(),
    check("password", "Password is more than 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // see if user exit
    try {
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User alreaday exits!" }] });
      }
      // get user gravatar
      const avatar = gravatar.url(email, {
        size: "200",
        rating: "pg",
        default: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Envrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // return jsonWebToken

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json(token);
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
