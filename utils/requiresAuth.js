function requiresAuth(req, res, next) {
  if (req.isAuthenticated() && !req.user.isAdmin) {
    return next();
  }
  return res.redirect("/login");
}

module.exports = requiresAuth;
