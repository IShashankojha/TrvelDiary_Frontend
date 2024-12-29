require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path =require("path");
const {authenticateToken} =require("./utilities");
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");


// Establish MongoDB connection
mongoose.connect(config.connectionString)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    console.log('Received data:', { fullName, email, password });

    // Check for missing fields
    if (!fullName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "Please fill all fields.",
        });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    try {
        // Check if user already exists (case insensitive)
        const isUser = await User.findOne({ email: normalizedEmail });
        if (isUser) {
            return res.status(400).json({
                error: true,
                message: "User already exists.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
        });

        await user.save();
        console.log("User saved:", user);

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" } // Token expires in 72 hours
        );

        // Return success response
        return res.status(201).json({
            error: false,
            user: { fullName: user.fullName, email: user.email },
            accessToken,
            message: "Registration successful.",
        });
    } catch (err) {
        console.error("Error during user creation:", err.message);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error. Please try again later.",
        });
    }
});


//Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate an access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        // Send the success response
        return res.status(200).json({
            error: false,
            user: { fullName: user.fullName, email: user.email },
            accessToken,
            message: "Login Successful",
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//Get User
app.get("/get-user",authenticateToken,async (req,res) =>{
        const{ userId }=req.user
    
        const isUser = await User.findOne({_id: userId});

        if(!isUser) {
            return res.sendStatus(401);
        }
        return res.json({
            user:isUser,
            message:"",
            });
 });

 //Routes to handle the image upload
app.post("/image-upload",upload.single("image"),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true,message:"No file uploaded"});
        }
        const imageUrl= `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    }   catch(error){
        res.status(500).json({error:true, message:error.message});
    }
})
//Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "ImageUrl parameter is required" });
    }

    try {
        // Extract the filename from imageUrl
        const filename = path.basename(imageUrl);

        // Define the file path
        const filePath = path.join(__dirname, 'uploads', filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Delete the file from the uploads folder
            fs.unlinkSync(filePath);
            return res.status(200).json({ message: "Image deleted successfully" });
        } else {
            return res.status(404).json({ error: true, message: "Image not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});


//Serve static files from the uploads and assets directory 
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));

 //Add Travel story 
 app.post("/add-TravelStory",authenticateToken,async(req,res)=>{
    const{title,story,visitedLocation,imageUrl,visitedDate}=req.body;
    const{userId}=req.user

    //Validate requrired fields
    if(!title||!story||!visitedLocation||!imageUrl ||!visitedDate){
        return res.status(400).json({error:true, message:"All fields are required"});
    }
    //Conver VistitedDate from the millisecond to date object
    const parsedVisitedDate= new Date(parseInt(visitedDate));

    try{
        const travelStory=new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate:parsedVisitedDate,   
        });

        await travelStory.save();
        res.status(201).json({story:travelStory,message:"Added Successfully"});
        } catch(error){
            res.status(400).json({error:true,message:error.message});
        }    
 })

//get All Travel stories 
app.get("/get-all-TravelStories",authenticateToken,async(req,res)=>{
    const{userId}=req.user;
    try{
        const travelStories=await TravelStory.find({userId:userId}).sort({isFavourite:-1,
        });
        res.status(200).json({stories:travelStories});
        } catch(error){
            res.status(500).json({error:true,message:error.message});
        }      
});
 
//Edit Travel story 
app.put("/edit-Story/:id",authenticateToken,async(req,res)=>{
    const {id}= req.params;
    const { title, story , visitedLocation , imageUrl, visitedDate} =req.body;
    const { userId }=req.user;

     //Validate requrired fields
     if(!title|| !story || !visitedLocation || !visitedDate ){
        return res.status(400).json({error:true, message:"All fields are required"});
    }
    //Convert VistitedDate from the millisecond to date object
    const parsedVisitedDate= new Date(parseInt(visitedDate));

    try {
        //Find the travel story by ID and ensure it belongs to the authentication user
            const travelStory = await TravelStory.findOne({ _id:id, userId: userId });
            if(!travelStory){
                return res.status(404).json({error:true,message: "travel story not found "});
            }
            const placeholderImgUrl=`http://localhost:8000/assets/placeholder.jpeg`;
                travelStory.title=title;
                travelStory.story=story;
                travelStory.visitedLocation=visitedLocation;
                travelStory.imageUrl=imageUrl || placeholderImgUrl;
                travelStory.visitedDate=parsedVisitedDate;

                await travelStory.save();
                res.status(200).json({story:travelStory,message:'Updated Successfully'});
        } catch(error){
            res.status(500).json({error:true, message:error.message})
        
        }
    })      
//Delete a travel story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const {id} = req.params;
    const {userId}= req.user;

    try {
        //Find the travel story by ID and ensure it belongs to the authentication user
            const travelStory = await TravelStory.findOne({ _id:id, userId: userId });
            if(!travelStory){
                return res.status(404).json({error:true,message: "travel story not found "});
            }
            //delete the story from the database
            await travelStory.deleteOne({ _id:id, userId: userId });

            //Extract the filename from the imageUrl
            const imageUrl = travelStory.imageUrl;
            const filename = path.basename(imageUrl);
            
            //Define the file path 
            const filePath = path.join(__dirname,'uploads',filename);

            //Delete the image file from the uploads folder
            fs.unlink(filePath,(err) => {
                if (err){
                    console.error("Failed to delete image file:", err);
                    //Optionally, you could still respond with a success status here
                    //if you don't wan to treat this as a critical error
                }
            });
               res.status(200).json({ message:"Travel story deleted successfully"});
        }
        catch(error){
            res.status(500).json({error:true, message: error.message});
        }
})
//update isFavourite 
app.put("/update-is-favourite/:id",authenticateToken,async(req,res)=>{
    const {id}=req.params;
    const {isFavourite}=req.body;
    const {userId}=req.user;

    try {
        const travelStory =await TravelStory.findOne({_id:id, userId: userId});
        if(!travelStory){
            return res.status(404).json({error:true,message:"Travel story not found"});
        }
            travelStory.isFavourite = isFavourite;
            await travelStory.save();
            res.status(200).json({story:travelStory,message:'Update Successful'});
        } catch(error){
            res.status(500).json({error: true, message: error.message});

        }
})

//Search Travel Stories
app.get("/search", authenticateToken, async(req , res)=>{
    const {query}=req.query;
    const {userId}=req.user;
    if(!query){
        return res.status(404).json({error:true,message:"query is required"});    
    } try{
        const searchResults =await TravelStory.find({
            userId:userId,
            $or:[
                { title: {$regex:query, $options:"i"}},
                { story: {$regex:query, $options:"i"}},
                { visitedLocation: {$regex:query, $options:"i" }},
            ],
        }).sort({isFavourite:-1});
        res.status(200).json({stories:searchResults});
    } catch(error){
        res.status(500).json({error: true, message: error.message});

    }
})
//Filter travel stories by date range
app.get("/travel-stories/filter",authenticateToken,async(req,res)=>{
    const{startDate,endDate}=req.query;
    const{ userId }=req.user;
    try{
        //convert startDate and endDate from miliseconds to Date objects
        const start=new Date(parseInt(startDate));
        const end =new Date(parseInt(endDate));

        //Find travel story that belong to the authenticated user and fall within the date range
        const filteredStories =await TravelStory.find({
            userId:userId,
            visitedDate:{ $gte:start, $lte:end},
        }).sort({isFavourite:-1 });

        res.status(200).json({stories:filteredStories});
    } catch(error){
        res.status(500).json({error: true, message: error.message});

    }
})

app.listen(8000, () => {
    console.log("Server running on port 8000");
});
module.exports = app;
