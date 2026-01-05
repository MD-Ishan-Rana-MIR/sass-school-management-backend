const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token;

    // 1️⃣ From cookie (BEST)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2️⃣ From header (fallback)
    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.SUPER_ADMIN_KEY);

    // 4️⃣ Attach user
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
