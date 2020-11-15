const mongoose = require('mongoose');
const user = require('./userSchema')
const schema = mongoose.Schema;

const groupSchema = new schema({
  name:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:true
  },
  admin:{
    name:{
      type:String,
      required:true
    },
    id:{
      type:String,
      required:true
    }
  },
  members:{
    type:[Object],
    required:true
  },
  baned:{
    type:[Object],
    required:true
  },
  muted:{
    type:[Object],
    required:true
  }
});

const group = mongoose.model('Group', groupSchema);
user.find({},(err,data)=>{
  const users = data.map(user => {
    return ({name:user.name,id:user.id});
  })
  group.findOne({name:"main-repl-chat"},(err,data)=>{
  if(!data){
    const mainReplChat = new group({
      name:"main-repl-chat",
      password:"none",
      type:"public",
      admin:{
        name:"potatojs",
        id:"3586193"
      },
      members:users
    })
    mainReplChat.save()
  }
})
})
module.exports = group;