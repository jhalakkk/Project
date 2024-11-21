const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  
  // Check for token in the header
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      if (token) {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user from the decoded id
        const user = await User.findById(decoded?.id);

        if (!user) {
          res.status(401);
          throw new Error("User not found, please login again.");
        }

        req.user = user;  // Attach user to request object
        next();
      } else {
        res.status(401);
        throw new Error("Token not provided.");
      }
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized, token expired or invalid, please login again.");
    }
  } else {
    res.status(401);
    throw new Error("There is no token attached to header.");
  }
});

// Admin role check middleware
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;

  // Find user by email and check if they are an admin
  const adminUser = await User.findOne({ email });

  if (!adminUser || adminUser.role !== "admin") {
    res.status(403); // Forbidden status code
    throw new Error("You are not authorized as an admin.");
  }

  next(); // Proceed to next middleware if admin
});

module.exports = { authMiddleware, isAdmin };
