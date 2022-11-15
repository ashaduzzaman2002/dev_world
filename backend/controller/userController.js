const { findOne } = require('../models/User');
const User = require('../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const jtw = require('jsonwebtoken');

const register = async (req, res) => {
    const { name, email, password, avatar } = req.body
    let userExist;

    try {
        userExist = await User.findOne({email: email})
    } catch (error) {
        console.log(error);
    }

    if(userExist){
        return res.status(400).json({msg: 'User already exist. Please go to Login'})
    }else{
        const userAvatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            default: 'mm'
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if(err) console.log(err);
                const hashedPassword = hash;
                const user = new User({
                    name,
                    email,
                    password: hashedPassword,
                    avatar: userAvatar
                })

                try {
                    await user.save()
                    return res.status(200).json({msg: 'User register successfully'})
                } catch (error) {
                    console.log(error);
                }
            })
        })
    }   

}


// Login

const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({email: email})
        if(!user){
            res.status(404).json({msg: "User doesn't found. Please go to register."})
        }
        
        const isMatch = bcrypt.compareSync(password, user.password)
        if(isMatch){
            res.json({msg: 'Success'})
        }else{
            res.status(400).json({msg: 'Invalid credential'});
        }
        
    } catch (error) {
        console.log(error);
    }
}


exports.register = register;
exports.login = login;