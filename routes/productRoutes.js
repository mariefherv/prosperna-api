const express = require("express");
const router = express.Router();

const auth = require("../auth");

const { verify } = auth;

const productControllers = require("../controllers/productControllers");

//view all products
router.get("/", productControllers.viewAll);

// view individual products
router.get("/view/:product_id", productControllers.viewProduct);

// update products (logged in user only)
router.put("/update/:product_id", verify, productControllers.updateProductDetails);

// delete product
router.delete("/delete/:product_id", verify, productControllers.delete)

module.exports = router;