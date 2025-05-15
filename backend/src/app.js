import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

import swaggerDocs from "./swagger/swaggerConfig.js"




import swaggerDocs from "./swagger/swaggerConfig.js"

const app = express();
app.use(
  cors({
    origin:'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(passport.initialize());

// routes import 
import userRouter from "./routes/user.routes.js"




//routes declaration
app.use("/api/v1/users",userRouter);

swaggerDocs(app);



export { app };
