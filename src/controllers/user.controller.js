import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

         user.refreshToken = refreshToken
         await user.save({validateBeforeSave:false})
         return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating referesh and access token")
        
    }

}

const registerUser = asyncHandler(async(req, res)=>{
    //problem no 01 register user 
    
    // get user details from frontend (with model)
        const {fullName, username, email, password,role}=req.body
    
    //validation -- not empty 
   
    
        if([fullName,email,username,password].some((field)=>field?.trim()===""))
        {
            throw new ApiError('400',"All fields are required")

        }
       
    // check if user already exixt(email)(username)(both)
        const existedUser = await User.findOne({
            $or:[{username}, {email}]
        })
        if(existedUser)
        {
            throw new ApiError(409, "User with email or usernaem is alredy exist")
        }

    
        
    //check for images , check for cloudinary// get url(URL)
    console.log(req.files);
    
       const avatarLocalPath = req.files?.avatar[0]?.path
      // const coverImageLocalPath = req.files?.coverImage[0]?.path
      let coverImageLocalPath;
      if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
      }

     

     //check avtar uplode in cloudinary
       if(!avatarLocalPath)
       {
        throw new ApiError(400, "Avatar file is required")
       }
    // upload in cloudinary in this 

        const avatar = await uploadOnCloudinary(avatarLocalPath) 
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);  
       

    //check avtar is 
        if(!avatar)
        {
            throw new ApiError(400,"avatar filed is required !! ")
        }
    //create user object {}------create entry in DB

      const user =  await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        role,
        username:username.toLowerCase()
       })


    //create respone , and password is not show 
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)
    {
        throw new ApiError(500, "Somthing went wrong form registering the user")
    }

      
    // check response------retun response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User register uscessfully ")
    )



             
        

    
 
    
   
  




})


const loginUser = asyncHandler(async(req,res)=>{

    //req body -> data
    const {email, username, password}=req.body;
    if(!(username || email))
    {
        throw new ApiError(400,"username or password is required for login ")
    }
    //username or email

    // find the user
    const user = await User.findOne({$or:[{username},{email}]})
    if(!user)
    {
        throw new ApiError(404, "user does not exist")
    }
    //password check 
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid)
        {
            throw new ApiError(401, "Invalid user credentials")
        }
    //acsses and refresh token 

   const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user._id);

    // send cookois

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,

    }
    //login

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200,{
        user:loggedInUser,
        accessToken,refreshToken
    }, "User logged in Successfuly!!"))

})



const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken : undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly : true,
        secure : true,

    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"))
    

})


const refereshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
     const user = await User.findById(decodedToken?._id)
     if(!user)
     {
         throw new ApiError(401, "invalid refresh Token")
     }
 
  
     
     
     if(incomingRefreshToken !== user?.refreshToken)
     {
         throw new ApiError(401, "refresh Token is expired or used")
     }
 
 
 
     const options={
         httpOnly:true,
         secure : true
     }
     
    const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(
     200,
     {accessToken, refreshToken:newRefreshToken},
     "Access token refreshed"
    ))
 
   } catch (error) {
    
    throw new ApiError(401, error?.message || "invalid refresh token")
    
   }



})


const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
      new ApiResponse(200, req.user, "Current user fetched successfully")
    );
  });



export {
    registerUser,
    loginUser,
    logoutUser,
    refereshAccessToken,
    getCurrentUser,

};