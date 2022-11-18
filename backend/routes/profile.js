const express = require('express');
const router = express.Router();
const passport = require('passport');

const profileController = require('../controller/profileController');


// Routes
router.get('/', passport.authenticate('jwt', { session: false}), profileController.currentUser);

router.post('/create', passport.authenticate('jwt', { session: false}, profileController.createProfile));


module.exports = router