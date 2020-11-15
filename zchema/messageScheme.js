const mongoose=require('mongoose');
const schema=mongoose.Schema;

const messageSchema=new schema({
  content:{
    type:String,
    required:true
  },
  senderName:{
    type:String,
    required:true
  },
  color:{
    type:String,
    required:true
  },
  group:{
    type:String,
    required:true
  },
  date:{
    type:Number,
    required:true
  }
});
let message = mongoose.model('Message', messageSchema);
module.exports = message;