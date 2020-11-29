let auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.json({
      isAuth: false,
      error: true
    });
  }
};

module.exports = { auth };
