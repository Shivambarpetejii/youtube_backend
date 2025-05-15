import passport from "passport";
import { Router } from "express";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refereshAccessToken, registerUser, requestOtpForPasswordChange } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();
//swagger file
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication routes
 */


//swagger file 
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
  
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

//swagger file 
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */

router.route("/login").post(loginUser)

//secured routes
    //swagger file
        /**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.route("/logout").post(verifyJwt,logoutUser)
  //swagger file 
  /**
 * @swagger
 * /api/v1/users/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Unauthorized
 */
router.route("/refresh-token").post(refereshAccessToken)

  //swager file
  /**
 * @swagger
 * /api/v1/users/current-user:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data fetched
 *       401:
 *         description: Unauthorized
 */

router.route("/current-user").get(verifyJwt, getCurrentUser)

//swager file 
/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     summary: Change password of current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid old password or weak new password
 *       401:
 *         description: Unauthorized
 */

router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/sendotp").post(verifyJwt,requestOtpForPasswordChange)

//googleauth 
/**
 * @swagger
 * /api/v1/users/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Auth]
 */
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]

}));

/**
 * @swagger
 * /api/v1/users/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 */
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    (req, res) => {
      try {
        if (!JWT_SECRET) {
          console.error("JWT_SECRET is not set");
          return res.status(500).send("Internal Server Error");
        }
  
        // Generate JWT token after successful authentication
        const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
          expiresIn: "1d", // Token expires in 1 day
        });
  
        // Send JWT token as a cookie or in the response
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: false,  // Make sure this is false for development, true in production
          sameSite: "strict",
        });
  
        // Redirect the user with the token as a query parameter
        res.redirect(`http://localhost:5173/auth/success?token=${token}`);
      } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Internal Server Error");
      }
    }
  );




export default router;
