const session = require("express-session");
const nodemailer = require("nodemailer");
const Course = require("../models/course");
const User = require('../models/user');

require("dotenv").config();
exports.getIndexPage = async (req, res) => {

  const courses = await Course.find().sort('-createdAt').limit(2);
  const kursSayisi = await Course.find().countDocuments();
  const toplamOgrenciSayisi = await User.countDocuments({role:"student"});
  const toplamOgretmenSayisi = await User.countDocuments({role:"teacher"});
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
    courses , 
    kursSayisi , 
    toplamOgrenciSayisi , 
    toplamOgretmenSayisi
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};


exports.getTalepFormuPage = (req, res) => {
  res.status(200).render('talep', {
    page_name: 'talepformu',
  });
};


exports.sendEmailGetContact = async (req, res) => {

  try {
    console.log(req.body);

    const messeage = `
      <h1>Mail Details </h1>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h1>Message</h1>
      <p>${req.body.messeage}</p>
    `

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "dev.berat55@gmail.com",
        pass: process.env.appPassword2,
      },
    });

    const info = await transporter.sendMail({
      from: '"berat kuzu 👻" <dev.berat55@gmail.com>', // sender address
      to: "dev.berat55@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: messeage, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    req.flash("success", "we recieved your message successfully");
    res.status(200).redirect("/contact");

  }catch(err){
    req.flash("error", `Something happened!`);
  }
}


exports.sendEmailTalepFormu = async (req, res) => {

  try {
    console.log(req.body);

    const messeage = `
      <h1>Mail Details </h1>
      <ul>
        <li>Name: ${req.body.isim}</li>
        <li>Name: ${req.body.soyisim}</li>
        <li>Email: ${req.body.mail}</li>
        <li>Email: ${req.body.telefon}</li>
      </ul>
      <h1>Message</h1>
      <p>${req.body.dersismi}</p>
      <p>${req.body.aciklama}</p>
    `

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "dev.berat55@gmail.com",
        pass: process.env.appPassword2,
      },
    });

    const info = await transporter.sendMail({
      from: '"berat kuzu 👻" <dev.berat55@gmail.com>', // sender address
      to: "dev.berat55@gmail.com", // list of receivers
      subject: "SEM DERS TALEBİ ✔", // Subject line
      text: "BTU SEM DERS TALEBİ", // plain text body
      html: messeage, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    req.flash("success", "we recieved your message successfully");
    res.status(200).redirect("/talepformu");

  }catch(err){
    req.flash("error", `Something happened!`);
  }
}


