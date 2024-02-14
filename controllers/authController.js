const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const  Users =require('../models/Users');

// for get auth
const getAuthUsers = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
};

const postLoginUsers = async (req, res) => {
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

module.exports ={
    getAuthUsers,
    postLoginUsers
    
}