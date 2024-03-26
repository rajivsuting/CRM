const express = require("express");
const router = new express.Router();
const { registerUser, signin } = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/signin", signin);

module.exports = router;
