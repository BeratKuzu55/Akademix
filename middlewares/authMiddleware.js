const User = require('../models/user');

module.exports = async (req , res , next) => {

    const foundedUser = await User.findById(req.session.userID);
    //console.log(foundedUser);
    if(foundedUser) {
        next();
    }
    else{
        return res.redirect('/login');
    }
    
}