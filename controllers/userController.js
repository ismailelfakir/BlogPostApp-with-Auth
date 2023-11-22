const passport = require('passport');
const User = require('../models/User');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ 'facebook.id': profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      username: profile.displayName,
      facebook: {
        id: profile.id,
        token: accessToken,
        email: profile.emails ? profile.emails[0].value : null
      }
    });

    await newUser.save();
    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
}));


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({
      username,
      email,
      userImage: req.file ? req.file.path : null,
    });

    await User.register(user, password);

    passport.authenticate('local')(req, res, () => {
      res.redirect('/home');
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

const loginUser = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/home');
      });
    }
  });
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.redirect('/');
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
