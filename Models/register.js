const mongoose=require("mongoose");

// creating register schema
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    age : Number,
    address: String,
    
})

// Create a Message model based on the schema
const User=mongoose.model("user", userSchema);

// Export the Message model and the messageSchema
module.exports={
    User,
    userSchema,
}