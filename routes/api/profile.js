const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");
const User = require("../../models/Users");

// @route     GET api/profile/me
// @desc     Get current user profile
// @acess     Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this users!" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error!");
  }
  res.send("Profile Route");
});

module.exports = router;
