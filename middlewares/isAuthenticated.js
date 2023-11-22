
module.exports = function isAuthenticated(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = req.isAuthenticated() ? req.user : null;
      return next();
    }
    res.redirect('/auth');
  };
  