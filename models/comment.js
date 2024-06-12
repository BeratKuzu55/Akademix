const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  } , 
  userName : {
    type : String 
  }
});

const Comment = mongoose.model("Comment" , commentSchema);
module.exports= Comment;
