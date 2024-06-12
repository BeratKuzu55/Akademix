const User = require('../models/user');
const Categories = require('../models/category');
const Course = require('../models/course');
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
    /*
    res.status(201).json({
      status: 'success',
      user,
    });*/
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors.array()[0].msg);
    req.flash("error" , `${errors.array()[0].msg}`);

    for(let i = 0; i < errors.array().length; i++){
      req.flash("error" , `${errors.array()[i].msg}`);
    }
    res.status(400).redirect("/register");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const same = await bcrypt.compare(password, user.password);
      
      if (same) {
        // Kullanıcı oturumu
        req.session.userID = user._id;
        res.status(200).redirect("/users/dashboard");
      } else {
        res.status(401).send('Parola yanlış');
      }
    } else {
      res.status(404).send('Kullanıcı bulunamadı');
    }
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
    console.log(error);
  }
};


exports.logOutUser = (req , res) => {
    req.session.destroy(() => {
      res.redirect("/");
    })
}

exports.getDashboardPage = async (req, res) => {

  const user = await User.findOne({_id:req.session.userID}).populate("courses");
  const categories = await Categories.find();
  const courses = await Course.find();
  const users = await User.find();

  let pre_registration_count = 0;

  for(let i = 0; i < users.length; i++){
    pre_registration_count += users[i].pre_registration.length  
  }
  

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories, 
    courses ,
    users, 
    pre_registration_count , 

  });
};


exports.deleteUser = async (req, res) => {
  try {    

    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({user:req.params.id})

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};