const jwt = require("jsonwebtoken")
const config = require("config")
const express = require('express')
/**
 * 
 * @param {express.Request} req - The request sent by the client
 * @param {express.Response} res - The response sent to the client
 * @param {express.NextFunction} next - The next middleware called by the app
 * @returns {object}
 */
function auth(req, res, next) {
  const token = req.header("x-auth-token")
  if (!token) return res.status(401).send("Access denied. No token provided.")

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"))
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send("Invalid token.")
  }
}

module.exports = auth