const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❗ Check if header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ❗ Check format: Bearer <token>
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }
    // console.log("AUTH HEADER:", req.headers.authorization);
    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.user = decoded; 

    next();
  } catch (error) {
    console.log("Auth Error:", error.message); // 👈 ADD THIS
    return res.status(401).json({ message: "Unauthorized" });
  }
};