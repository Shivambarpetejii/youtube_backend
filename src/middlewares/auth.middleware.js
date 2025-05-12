import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler(async(req,res,next)=>{
    req.cookies?.accessToken || req.header("Authorization")?

})