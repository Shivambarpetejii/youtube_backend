// require('dotenv').config({path:'./env'})//this is not good
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({path:"./.env"})
connectDB().then(()=>{
    app.on("error", (error)=>{
        console.log("ERROR : ",error)
        throw error;
    })
    app.listen(process.env.PORT || 6000,()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
        
    })
}).catch((err)=>{
    console.log("mongo DB connection failed !!! ",err);
    
})








































// import mongooes from 'mongoess'
// import { DB_NAME } from './constants';
// import express from "express"


// const app = express();


// ;( async()=>{
//     try{
//        await mongooes.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error)=>{
//         console.log("ERROR:-"+error);
//         throw error
        
//        })

//             app.listen(process.env.PORT,()=>{
//                 console.log("Your server is connect"+process.env.PORT);
                
//             })



//     }catch(error){
//         console.error('ERROR',error)
//         throw err
//     }

// })()









