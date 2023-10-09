var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectDB } = require("../Config/db");
const Product = require("../Models/productSchema");

const getAllProduct = async (req, res) => {
  const allProducts = await Product.find();
  res.status(201).json(allProducts);
};

const getOneProduct = async (req, res) => {
  try {
  } catch {}
};
const addProduct = async (req, res) => {
  try {
    //get all data from frontend
    const { Productname, Price, Discription, Category, Img_link, Rating } =
      req.body;

    //all data should exists
    if (!(Productname && Price && Discription && Category && Img_link)) {
      res.status(400).send("All fields are compulsory");
    }

    // Create Product
    const product = await Product.create({
      Productname,
      Price,
      Discription,
      Category,
      Img_link,
      Rating,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
  }
};
const updateProduct = async (req, res) => {
  const { Productname, Price, Discription, Category, Img_link, Rating } =
    req.body;

  //all data should exists
  if (!(Productname && Price && Discription && Category)) {
    res.status(400).send("All fields are compulsory");
  } else {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.json(product);
  }
};
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  res.send("Item has been deleted");
};

module.exports = { getAllProduct, addProduct, updateProduct,deleteProduct };
