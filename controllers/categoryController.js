const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    
    try {
    const category = await Category.create(req.body);    
        res.status(201).json({
            status: "success",
            category ,
        });
    }
    catch(error) {
        res.status(400).json({
            status: "fail",
            error
        })
    }

}


  