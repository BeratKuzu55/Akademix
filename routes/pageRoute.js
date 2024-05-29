const express = require("express");
const pageController = require("../controllers/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

const router = express.Router();

router.route('/').get(pageController.getIndexPage);      // https//localhost:3000
router.route('/about').get(pageController.getAboutPage); // https//localhost:3000/about
router.route('/register').get(redirectMiddleware ,  pageController.getRegisterPage);
router.route('/login').get(redirectMiddleware, pageController.getLoginPage);
router.route('/contact').get(pageController.getContactPage);
router.route('/contact').post(pageController.sendEmail);
module.exports = router;