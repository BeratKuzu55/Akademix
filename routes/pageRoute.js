const express = require("express");
const pageController = require("../controllers/pageController");

const router = express.Router();

router.route('/').get(pageController.getIndexPage);      // https//localhost:3000
router.route('/about').get(pageController.getAboutPage); // https//localhost:3000/about
router.route('/register').get(pageController.getRegisterPage);
router.route('/login').get(pageController.getLoginPage);
module.exports = router;