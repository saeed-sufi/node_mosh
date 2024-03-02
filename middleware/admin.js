function Admin(req, res, next) {
  // 401 Unauthorized: user tries to access a protected resource but they don't provide a valid jwt.

  // 403: Forbidden: is the user sends a vaild jwt but they're not still allowed to access the resource.

  // 400: Bad request: something is missing from the request.
  if (!req.user.isAdmin) return res.status(403).send("Access denied. You're not an admin.")

  next()
}

module.exports = Admin
