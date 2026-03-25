const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mobtick-fallback-secret-change-me";

// Generate a JWT token for a user
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// Middleware: verify JWT from Authorization header
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, msg: "Access denied. No token provided." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, msg: "Invalid or expired token." });
  }
};

module.exports = { generateToken, verifyToken };
