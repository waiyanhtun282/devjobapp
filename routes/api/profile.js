const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const { getProfile, postCreateUpdateProfile, getAllProfile, getUserProfileDetail, deleteUserProfile, putExperienceProfile, deleteExperienceProfile, putEducationProfile, deleteEduationProfile, getProfileGit } = require("../../controllers/profileController");
const { validateCreateUpdateProfile, validateProfileExperience, validateProfileEducation } = require("../../middleware/validateMiddleware");

// @route     GET api/profile/me
// @desc     Get current user profile
// @acess     Private

router.get("/me", auth,getProfile );


// @route     POST api/profile
// @desc     POST Create/Update user proflile
// @acess     Private

router.post(
  "/",
  [
    auth,
   validateCreateUpdateProfile
  ],
 postCreateUpdateProfile
);

// @route     Get api/profile
// @desc     Get all profile user
// @acess     Public

router.get("/",getAllProfile);

// @route     Get api/profile/user/:user_id
// @desc     Get profile user by Id
// @acess     Public

router.get("/user/:user_id",getUserProfileDetail );

// @route     Delete api/profile
// @desc     Deltee user and Profile
// @acess     Public

router.delete("/", auth,deleteUserProfile );

// @route     PUT api/profile/experince
// @desc     Add Profile Experience;
// @acess     Private

router.put(
  "/experience",
  [
    auth,
   validateProfileExperience
  ],
  putExperienceProfile
);

// @route     Delete api/profile/experience/:exp_id
// @desc     Deltee Experience from profile
// @acess     Private

router.delete("/experience/:exp_id", auth,deleteExperienceProfile );

// @route     PUT api/profile/education
// @desc     Add Education Experience;
// @acess     Private

router.put(
  "/education",
  [
    auth,
   validateProfileEducation
  ],
 putEducationProfile
);

// @route     DELETE api/profile/education
// @desc     DELETE Education ;
// @acess     Private

router.delete("/education/:edu_id", auth,deleteEduationProfile );

// @route     GET api/profile/github/:username
// @desc     Get USer Repos  fro github
// @acess     Public
router.get('/github/:username',getProfileGit)
module.exports = router;
