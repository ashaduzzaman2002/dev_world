const User = require("../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jtw = require("jsonwebtoken");

// Load Input validation

const validateRegisterInput = require('../validation/register')

// Register

const register = async (req, res) => {
  const { name, email, password, avatar } = req.body;
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid){
    res.status(400).json({errors})
  }else{
    
  let userExist;

  try {
    userExist = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (userExist) {
    return res
      .status(400)
      .json({ msg: "User already exist. Please go to Login" });
  } else {
    const userAvatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      default: "mm",
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) console.log(err);
        const hashedPassword = hash;
        const user = new User({
          name,
          email,
          password: hashedPassword,
          avatar: userAvatar,
        });

        try {
          await user.save();
          return res.status(200).json({ msg: "User register successfully" });
        } catch (error) {
          console.log(error);
        }
      });
    });
  }
  }
};

// Login

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(404)
        .json({ msg: "User doesn't found. Please go to register." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      // User match
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      // Sign the token
      jtw.sign(
        payload,
        process.env.SECRET_KEY,
        { expiresIn: "2 days" },
        (err, token) => {
          res.status(200).json({
            success: true,
            token: "Bearer " + token,
          });
        }
      );
    } else {
      res.status(400).json({ msg: "Invalid credential" });
    }
  } catch (error) {
    console.log(error);
  }
};

const currentUser =  (req, res) => {
    res.status(200).json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
    })
}

exports.register = register;
exports.login = login;
exports.currentUser = currentUser;
