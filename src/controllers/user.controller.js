import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


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
        const {fullName, username, email, password}=req.body
    
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
    if(!username || !email)
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
    

})

export {
    registerUser,
    loginUser,

};