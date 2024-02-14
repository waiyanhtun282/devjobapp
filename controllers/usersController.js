const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const  User =require('../models/Users');

 exports.postRegisterUsers =async (req, res) => {
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

