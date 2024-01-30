const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

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

module.exports = router;
