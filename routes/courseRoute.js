const express = require("express");
const multer  = require('multer');
const path = require("path");
const courseController = require("../controllers/courseController");
const roleMiddleware = require('../middlewares/roleMiddleware');
const Course = require("../models/course");

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "uploads");
    } , 
    filename: async (req, file, cb) => {
        try {
            console.log(req.body.course_id);
            const course = await Course.findOne({ _id: req.body.course_id });
            
            if (course) {
                course.filelink.push(course.slug + "_" + file.originalname);
                await course.save(); // Save the updated course document

                console.log(file);
                cb(null, course.slug + "_" + file.originalname);
            } else {
                cb(new Error("Course not found"), null);
            }
        } catch (err) {
            console.error(err);
            cb(err, null);
        }
    }
});

const upload = multer({storage : storage});

const router = express.Router();

router.route('/').post(roleMiddleware(["teacher" , "admin"]) , courseController.createCourse); // https//localhost:3000/courses
router.route('/').get(courseController.getAllCourses);
router.route('/:slug').get(courseController.getCourse);
router.route('/:slug').delete(courseController.deleteCourse);
router.route('/:slug').put(courseController.updateCourse);
router.route('/enroll').post(courseController.enrollCourse);
router.route('/release').post(courseController.releaseCourse);
router.route('/onkayit/onkayityap').post(courseController.onkayit);
router.route('/onkayit/onkayitsil').post(courseController.onkayitsil);
router.route('/pdfyukle').post(upload.single('image') , courseController.pdfyukle);
router.route('/uploads/:filename').get(courseController.getpdf); // anlamı: uploadstan sonra gelen bir parametre var adı da filename
router.route('/yorumyap').post(courseController.yorumyap);
module.exports = router;