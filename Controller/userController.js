var bcrypt = require("bcryptjs");
// const app = express();
// require("dotenv").config();
const jwt = require("jsonwebtoken");
const { connectDB } = require("../Config/db");
const { User, userSchema } = require("../Models/register");



const register=async(req,res)=>{
    try {
        //get all data from
        const { name, email, password, age, address } = req.body;
    
        //all data should exists
        if (!(name && email && password && age && address)) {
          res.status(400).send("All fields are compulsory");
        }
    
        //check if user already exists - email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          res.status(400).send("User already exists with this email");
        } else {
          // encrypt the password
          const myEncPassword = await bcrypt.hash(password, 10);
    
          //save the user in DB
          const user = await User.create({
            name,
            email,
            password: myEncPassword,
            age,
            address,
          });
    
          // generate a token for user and send it
          const token = jwt.sign(
            //payload: extracts user id
            { id: user._id, email },
            //Now provide secret
            "shhhh", //process.env.jwtsecret
            {
              expiresIn: "2h",
            }
          );
    
          user.token = token;
          user.password = undefined; //now this will not go to the frontend
          console.log(token);
    
          res.status(201).json(user);
        }
      } catch (error) {
        console.log(error);
      }
}

const login=async(req,res)=>{
    try {
        // get all data from frontend
        const { email, password } = req.body;
        //validation check
        if (!(email && password)) {
          res.status(400).send("Send all data");
        }
        // find user in DB
        const user = await User.findOne({ email });
        //Assignment: If user is not there, then what?
        // match the password
      if (user && (await bcrypt.compare(password, user.password))) {      
        const token = jwt.sign(
          {id:user._id , email:user.email},
          "shhhh", // Use process.env.jwtsecret in production
          {
            expiresIn: "30d",
          }
        );
    
          // Set the token in the response headers (or you can send it in the response body)
          res.setHeader('Authorization', `Bearer ${token}`);
    
          // Send the user data without the password and the token
          const userWithoutPasswordAndToken = { ...user.toObject() };
          delete userWithoutPasswordAndToken.password;
          delete userWithoutPasswordAndToken.token;
    
          res.status(200).json({
            user:userWithoutPasswordAndToken,
            token,
          });
      } else{
        res.status(400).send("Enter correct email and password");
      }
      } catch (error) {
        console.log(error);
      }
}


// Middleware function to verify JWT tokens
const verifyToken = (req, res, next) => {
  // Get the token from the request header, query parameter, or cookie
  const token = req.header('Authorization');
  // const token = req.header('Authorization') || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token with your secret key (replace 'yourSecretKey' with your actual secret)
    const decoded = jwt.verify(token, 'shhhh');

    // Attach the decoded user information to the request for use in protected routes
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

const protected= async (req, res) => {
  try {
   
    const userIdFromToken= req.user.id;

    // Find the user by ID using Mongoose's findById method
    const user = await User.findById(userIdFromToken);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // You can now send the user data as the response
    res.json({ message: 'User found', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports={register,login,verifyToken,protected}