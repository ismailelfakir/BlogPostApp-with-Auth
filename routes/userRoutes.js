const router = require('express').Router();
const multer = require('../config/multer');
const userController = require('../controllers/userController');
const passport = require('passport');

router.post('/auth/register', multer.single('userImage'), userController.registerUser);

router.post('/auth/login', userController.loginUser);

router.get('/auth/logout', userController.logoutUser);

// Facebook Authentication
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/home', failureRedirect: '/' })
);

module.exports = router;