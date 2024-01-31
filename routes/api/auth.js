const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const Users = require("../../models/Users");
// @route     GET api/auth
// @desc      auth route
// @acess     Public

router.get("/", auth, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
});

// @route     Post api/auth
// @desc      Authiccate User & get token
// @acess     Public
router.post(
  "/",
  [
    check("email", "Please include is valid email!").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // see if user exit
    try {
      let user = await Users.findOne({
        email,
      });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Ivalid Credentials!" }] });
      }

      // mtach password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials!" }] });
      }

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
