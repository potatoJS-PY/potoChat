const message = require('./zchema/messageScheme');
const user = require('./zchema/userSchema');
const group = require('./zchema/groupsSchema');
const router = require('express').Router()
const {MAXMSG,PSDLEN,GroupLimit} = require('./constants');

const colors = [
  'rgb(0, 0, 0)',
  'rgb(25, 0, 255)',
  'rgb(7, 196, 0)',
  'rgb(183, 0, 255)',
  'rgb(255, 115, 0)',
  'rgb(255, 255, 0)',
  'rgb(255, 0, 0)',
  'rgb(87, 87, 87)',
  'rgb(10, 0, 104)',
  'rgb(51, 255, 0)',
  'rgb(109, 0, 131)',
  'rgb(110, 26, 0)',
  'rgb(255, 72, 0)',
  'rgb(0, 140, 255)'
];

function randomChoice(array){
  if(array.length > 0){
    let choice=Math.floor(Math.random()*array.length);
    return (array[choice])
  }else{
    return undefined
  }
}

function authUser(res,req) {
  let name = req.headers['x-replit-user-name'];
  let id = req.headers['x-replit-user-id'];
  if(id){
    user.findOne({id:id},(err, userData)=>{
      if(err){
        console.log('error searching for a user in auth');
      }else{
        if(!userData){
          // creating a new user and store it the database;
          let thisUser=new user({
            name:name,
            id:id,
            meta:{
              mode:"darkMode",
              nickNameCol:randomChoice(colors),
              group:'main-repl-chat',
              menuIsOpen:false,
              groupsCreated:0
            }
          })
          thisUser.save()
            .then(()=>{console.log('user saved')})
            .catch( err => {console.log('error saving the user')});
          group.findOne({name:"main-repl-chat"},(err, data) => {
            data.members.push({
              name:name,
              id:id
            })
            data.save()
              .then( () => console.log("working?.."))
              .catch(() => console.log("error saving the data of a group"))
          })
        }
      }
    })  
  }
}

router
  .get('/',(req,res) =>{
    let userInfo={
      username:req.headers['x-replit-user-name'],
      userid:req.headers['x-replit-user-id'],
      userroles:req.headers['x-replit-user-roles']
    };
    if(userInfo.username) {
      user.findOne({name:userInfo.username},(err,userData)=>{
        if(userData){
          res.redirect(`group/${userData.meta.group}`);
        }else{
          res.render('pages/404');
        }
      })
    }else{
      res.redirect('/login');
    }
  })
  .get('/group/:group',(req,res)=>{
    let userInfo={
      username:req.headers['x-replit-user-name'],
      userid:req.headers['x-replit-user-id'],
      userroles:req.headers['x-replit-user-roles']
    };
    if(userInfo.username){
    user.findOne({id:userInfo.userid}, (err,userData)=>{
      if(userData){
        group.find({members:{$elemMatch:{id:userInfo.userid}}},(err,data)=>{
        if(data){
        const groupsAllowedToEnter = data.map(gRoUp => gRoUp.name)
        if(groupsAllowedToEnter.includes(req.params.group)){
          message.find({group:`${req.params.group}`}, (err, data) =>{
            if(data){
              if(userInfo.username){
                if( userData ){
                  userInfo.usermeta = userData.meta;
                  userData.meta.group = req.params.group;
                  userData.save().then().catch(err =>{
                    console.log(err);
                  })
                  const oldMessages = [];
                  for(let i=0;i<data.length;i++){
                    oldMessages.push({
                      content:data[i].content,
                      color:data[i].color,
                      senderName:data[i].senderName
                    })
                  }
                  res.render('chat',{
                    user:userInfo,
                    group:req.params.group,
                    info:{
                      groupLimit:GroupLimit,
                      passwordLength:PSDLEN
                    },
                    data:{
                      oldMessages:JSON.stringify(oldMessages),
                      yourGroups:groupsAllowedToEnter
                    }
                  });
                }else{
                  // user not found!
                  console.log('user not found...!');
                  res.render('pages/404');
                }
              }else{
                res.redirect('/login');
              }
            }else{
              console.log('error while searching for old messages');
            }
          })
        }else{
          res.render('pages/notAllowed',{group:req.params.group});
        }
      }
      })
    }else{
      res.render('pages/404')
    }
    })
    }else{
      res.redirect('../login');
    }
    
  })

  .get('/login',(req,res)=>{
    let username = req.headers['x-replit-user-name'];
    if(username){
      authUser(res,req);
      res.redirect('/');
    }else{
      res.render('pages/login');
    }     
  })
  .use((req,res)=>{
    res.render('pages/404');
  })

module.exports= router