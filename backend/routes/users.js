const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const passport = require("passport");


// Registration

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/current',passport.authenticate('jwt', { session: false }), userController.currentUser);





module.exports = router