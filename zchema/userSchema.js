const mongoose=require('mongoose');
const schema=mongoose.Schema;

const userSchema=new schema({
  name:{
    type:String,
    required:true
  },
  id:{
    type:String,
    required:true
  },
  meta:{
    mode:{
      type:Object,
      required:true
    },
    menuIsOpen:{
      type:Boolean,
      required:true
    },
    nickNameCol:{
      type:String,
      required:true
    },
    group:{
      type:String,
      required:true
    },
    groupsCreated:{
      type:Number,
      required:true
    }
  }
});
let user = mongoose.model('User', userSchema);
module.exports = user;