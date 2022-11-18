const mongoose = require("mongoose");
const Profile = require("../models/Profile");

// Models
const profileModel = require("../models/Profile");
const userModel = require("../models/User");

// Current user profile
const currentUser = async (req, res) => {
  const errors = {};

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json(error);
  }
};

// Create or update user profile
const createProfile = async (req, res) => {
    const erros = {};
  // Get profile
  const profileFields = {};

  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.comapny = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.github) profileFields.github = req.body.github;

  //Skills
  if (typeof req.body.skills !== "undefine") {
    profileFields.skills = req.body.skills.split(",");
  }

  // Social link
  profileFields.social = {};

  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.handle) profileFields.handle = req.body.handle;

  let profile;
  try {
    profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      res.status(200).json(profile)
    } else {
      // Create

      // Check if handle exist
      profile = await Profile.findOne({ handle: profileFields.handle})
      if(profile){
        erros.handle = 'That handle already exists';
        res.status(400).json(erros)
      }

      // Save profile
      new Profile(profileFields).save()
      .then(profile => res.status(200).json(profile));
    }
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.currentUser = currentUser;
exports.createProfile = createProfile;
