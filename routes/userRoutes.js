const express = require("express");
const router = express.Router();

const auth = require("../auth");

const { verify } = auth;

const userControllers = require("../controllers/userControllers");

//view all users
router.get("/viewAll", userControllers.viewAll);

// view individual user
router.post("/viewUser", userControllers.viewUser)

// view individual user (if logged in)
router.get("/viewUser", verify, userControllers.viewUser)

//login user
router.post("/login", userControllers.login);

//update user
router.put("/update", verify, userControllers.updateUser);


module.exports = router;