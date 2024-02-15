const Profile =require('../models/Profile');
const User = require('../models/Users');
const {  validationResult } = require("express-validator");
const request =require('request');
const config =require('config');

const getProfile =async (req, res) => {
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
};

const postCreateUpdateProfile = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile Objects
    let profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // console.log(profileFields.skills);
    //   res.send("Hello");

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create
      profile = await new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error!");
    }
  }

  const getAllProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error!");
  }
} 

const getUserProfileDetail =async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is not profile for this user!" });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res
        .status(400)
        .json({ msg: "There is not profile for this user!" });
    }
    return res.status(500).send("Server Error!");
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    // for remove profile

    await Profile.findOneAndDelete({ user: req.user.id });

    //  for remoe user

    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
}

const putExperienceProfile =async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error!");
    }
  }

  const deleteExperienceProfile =async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error!");
  }
}

const putEducationProfile = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    // for add education
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  };

  const deleteEduationProfile =async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // removeIndex
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    res.json({ msg: "Education is Deleted!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

const getProfileGit =(req,res)=>{
  try {
    const options = {
      url:`https://api.github.com/users/${
         req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method:'GET',
      headers:{'user-agent':'node.js'}
    }
    request(options,(error,response,body) =>{
      if(error) console.error(error);
      if(response.statusCode !==200){
        return res.status(404).json({msg:'No Github profile found'})
      }

      res.json(JSON.parse(body))
    })
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error')

  }
};


module.exports ={
    getProfile,
    postCreateUpdateProfile,
    getAllProfile,
    getUserProfileDetail,
    deleteUserProfile,
    putExperienceProfile,
    deleteExperienceProfile,
    putEducationProfile,
    deleteEduationProfile,
    getProfileGit
}