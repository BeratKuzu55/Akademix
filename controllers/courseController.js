const fs = require("fs");
const path = require("path");
const Course = require('../models/course');
const Category = require('../models/category');
const User = require("../models/user");
exports.createCourse = async (req, res) => {

  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID ,
      demolink : req.body.demolink , 
  
    });

    res.redirect('/courses');
    /*res.status(201).json({
          status: "success",
          course
      }); */
  }
  catch (error) {
    console.log(error);
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
    //console.log(categories);
   


    const user_pre = await User.findOne({_id:req.session.userID}).populate("pre_registration");
   
    let kontrol = true;
    res.status(200).render('courses', {
      courses,
      categories,
      user_pre ,  
      page_name: 'courses',
    });

  } catch (error) {
    console.log(error);
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
    
    //console.log(course.user._id.toString().localeCompare(user._id.toString()) +"--------------------- " + user._id.toString());
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    fs.readdir(uploadsDir, (err, _files) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Internal server error');
      } else {
        // Ensure _files is an array of strings
        if (!Array.isArray(_files) || !_files.every(file => typeof file === 'string')) {
          console.log('Invalid _files format');
          return res.status(500).send('Internal server error');
        }

        //console.log("başarılı " + " " + course.filelink.length +" " + course.filelink);

        return res.status(200).render('course', {
          course,
          page_name: 'courses',
          user,
          categories,
          _files: JSON.stringify(_files), // Safely pass _files to the template
        });
      }
    });

    
  } catch (error) {
    console.log(error);
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

exports.onkayit = async (req , res) => {
  try {
    
    const user = await User.findById(req.session.userID);
    
    let kontrol = true;
    
    for(let i = 0; i < user.pre_registration.length; i++){
      if(user.pre_registration[i]._id == req.body.course_id){
        kontrol = false;
      }
    }


    if(kontrol){
      await user.pre_registration.push({_id : req.body.course_id});
      await Course.findByIdAndUpdate(req.body.course_id , 
        { $inc: { pre_registration_count: 1 } }, 
        { new: true, runValidators: true }
      );
    }
    
    await user.save();

    res.status(200).redirect('/courses');

  }
  catch(error) {
    console.log(error);
    res.status(400).json({
      status : 'fail' , 
      error ,
    })
  }
}


exports.onkayitsil = async (req , res) => {

  try{
    const user = await User.findById(req.session.userID);
    await user.pre_registration.pull({ _id: req.body.course_id });
    await Course.findByIdAndUpdate(req.body.course_id , 
      {
        $inc : {pre_registration_count : -1} , 
      } , 
      {
        new: true, runValidators: true
      }
    );
    await user.save();
    res.status(200).redirect('/courses');
  }catch(error){
    console.log(error);
    res.status(400).json({
      status : 400 , 
      error , 
    })
  }

}


exports.pdfyukle = async (req , res) => {

  try{

    // hangi kurs için bu pdf yüklenecek o işlemler tamamlanmalı
    const course = await Course.findOne({_id : req.body.course_id}); // 
   // Course.findByIdAndUpdate(req.body.course_id , {filelink : course.slug + "_" + file.originalname});
   // console.log(req.body.course_id);
    res.redirect('/courses');
  }catch(error){
    console.log(error);
    res.status(400).json({
      status : 400 , 
      error , 
    })
  }
  
}


exports.getpdf = async (req , res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    res.sendFile(filePath, err => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
      }
    });
  }catch(error){
    console.log(error);
    res.status(201).json({
      error,
    })
  }
}


exports.yorumyap = async (req , res) => {

  try {
    
    const course = await Course.findById(req.body.course_id);
    console.log(req.body);
    res.status(200).redirect(`/courses/${course.slug}`);

  } catch (error) {
    console.log(error);

  }
}