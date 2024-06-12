const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name : {
        type : String , 
        unique : true , 
        required : true
    } , 
    description : {
        type : String , 
        required : true , 
    } , 
    createdAt : {
        type : Date , 
        default : Date.now
    } , 
    slug : {
        type : String , 
        unique : true ,
    } , 
    category : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Category'
    } ,
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      } , 
    
    pre_registration_count : {
        type : Number , 
        default: 0,
        min: 0,
    },

    demolink : {
        type : String , 
        default : "" , 
    } , 

    filelink : [{
        type : String , 
        default : ""
    }] , 

    comments : [
        {
            type : mongoose.Schema.Types.ObjectId , 
            ref: 'Comment'
        }
    ]
    
});


CourseSchema.pre('validate', function(next){
    this.slug = slugify(this.name, {
      lower:true,
      strict:true
    })
    next(); // bir sonraki middleware a geçmek için
  });
const Course = mongoose.model("Course" , CourseSchema);
module.exports= Course;
