const mongoose=require("mongoose");

// creating Product schema
const productSchema=new mongoose.Schema({
    Productname:{
        type: String,
        required: true,
    },
    Price: {
        type: String,
        required:true,
    },
    Discription: {
        type: String,
        required: true,
    },
    Category :{
        type: String,
        required: true,
    },
    Img_link: String,
    Rating: Number,
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    }    
})

// Create a Message model based on the schema
const Product=mongoose.model("product", productSchema);

// Export the Message model and the messageSchema
module.exports= Product;