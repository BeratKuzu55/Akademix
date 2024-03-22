const User = require('../models/user');
const bcrypt = require("bcrypt");
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
    console.log(error);
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
        res.status(200).redirect("/");
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
