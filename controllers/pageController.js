const session = require("express-session");
const nodemailer = require("nodemailer");
require("dotenv").config();
exports.getIndexPage = (req, res) => {
  console.log(req.session.userID);
  res.status(200).render('index', {
    page_name: 'index',
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

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

exports.sendEmail = async (req, res) => {

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


