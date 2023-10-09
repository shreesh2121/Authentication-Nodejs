const express = require("express");
const { getAllProduct, addProduct, updateProduct, deleteProduct } = require("../Controller/productController");
const router = express.Router();

router.get("/getallproduct", getAllProduct);
router.post("/addproduct", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;