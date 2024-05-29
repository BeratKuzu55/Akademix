const express = require("express");
const expressSession = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override")
const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require('./routes/userRoute');

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/smartEdu-db')
  .then(() => console.log('Connected!'));
app.set("view engine" , "ejs");

//global variable 
global.userIn = null;
//middlewares
app.use(express.static("public"));
app.use(express.json());   
app.use(express.urlencoded({extended : true}));  // req.body ile bilgileri alabilmek için kullandığımız express middleware'i
app.use(expressSession({
  secret :"my_keyboard cat" ,
  resave : false , 
  saveUninitialized: true ,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/smartEdu-db' }),
}));
app.use(flash());
app.use((req, res, next)=> {
  res.locals.flashMessages = req.flash();
  next();
})
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);
//routing
app.use("*" , (req , res , next) => {
  userIn = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories' , categoryRoute);
app.use('/users' , userRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});