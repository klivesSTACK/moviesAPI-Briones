const express = require('express')
const userController = require("../controllers/user");

//Routing component
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;