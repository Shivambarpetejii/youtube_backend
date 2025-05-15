import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request: Token is missing");
    }
    
    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // If token is valid, fetch user from DB
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiError(401, "Unauthorized request: User not found");
    }
    
    // Attach the user to the request object
    req.user = user;
    
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle JWT errors (e.g., expired token, invalid token)
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, "Token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid access token");
    } else {
      // Other unexpected errors
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  }
});
