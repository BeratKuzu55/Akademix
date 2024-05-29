const Course = require('../models/course');
const Category = require('../models/category');
const User = require("../models/user");
exports.createCourse = async (req, res) => {

  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID
    });

    res.redirect('/courses');
    /*res.status(201).json({
          status: "success",
          course
      }); */
  }
  catch (error) {
    res.status(400).json({
      status: "fail",
      error
    })
  }

}

exports.getAllCourses = async (req, res) => {
  try {

    const categorySlug = req.query.categories;
    const query = req.query.search;
    const category = await Category.findOne({ slug: categorySlug })

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id }
    }

    if (query) {
      filter = {
        name: query
      }
    }

    if (!query && !categorySlug) {
      filter.name = "",
        filter.category = null
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category }
      ]
    }).sort('-createdAt').populate('user');

    //const courses = (await Course.find(filter)).reverse();;
    const categories = await Category.find();
    //console.log(courses);
    console.log(categories);
    // postman
    /*
    res.status(201).json({
      status : "success" ,
      courses , 

    }) */

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};


exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate('user'); // url'den gelen id yi yakalamamızı sağlar.
    const categories = await Category.find();
    res.status(200).render('course', {
      course,
      page_name: 'courses',
      user,
      categories,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {

    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {

    const course = await Course.findOneAndDelete({ slug: req.params.slug })

    req.flash("error", `${course.name} has been removed successfully`);

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {    

    const course = await Course.findOne({slug:req.params.slug});
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};