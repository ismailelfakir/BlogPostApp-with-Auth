// Assuming you have a UserModel to fetch user information
const UserModel = require('./path/to/userModel');

const authenticate = async (req, res, next) => {
  try {
    // Check if there's a user ID in the session
    if (!req.session.userId) {
      return next(); // No user ID, move on to the next middleware
    }

    // Fetch the user based on the stored user ID
    const user = await UserModel.findById(req.session.userId);

    // If user not found, or some other error, move on without setting req.user
    if (!user) {
      return next();
    }

    // Set the user in req.user
    req.user = user;

    // Move on to the next middleware
    return next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    return res.status(500).send('Error authenticating user.');
  }
};

module.exports = authenticate;
