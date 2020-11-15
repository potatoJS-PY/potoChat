// importing bad words thingy
const Filter = require('bad-words');
const maBoy = new Filter({ placeHolder: '$'}); // lmao
maBoy.addWords('js-bad', 'js-baf');
const convertFromMs = require('./smallstuff/convertFunc');
const message = require('./zchema/messageScheme');
const user = require('./zchema/userSchema');
const group = require('./zchema/groupsSchema');

const usersTyping = {};
const {MAXMSG, PSDLEN, GroupLimit} = require('./constants');

const plzStopXSSFor =  badStr => badStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); 

function check(text, validation){
  switch(validation){
    case 'spaces':
      let spaces = 0;
      for(let i=0;i<text.length;i++) if(text[i]==' ') spaces++;
      return (spaces !== text.length);
  }
}

const markdownToHTML = require("./smallstuff/markdown")
module.exports = io => {
  const Poto = require('./bots/poto');
  const poto = new Poto("poto", io);
  io.on('connection', (socket) => {
    let messagesoldesnessLimit=convertFromMs(5,'min');
    let thisDate=new Date().getTime();
    let oldMgs=thisDate - messagesoldesnessLimit;
    message.deleteMany({date:{$lte:oldMgs}},()=>{});

    //typing functionnality
    socket.on('typing',(msg)=>{
      const name = socket.handshake.headers['x-replit-user-name'];
      const id = socket.handshake.headers['x-replit-user-id'];
      user.findOne({id:id},(err, userData)=>{
        if(userData){
          group.findOne({name:msg.group}, (err, groupData)=>{
            if(groupData){
              const groupMembers = groupData.members.map(groupThing => groupThing.name);
              if(groupMembers.includes(userData.name)){
                let id=socket.id;
                let userExists=false;
                let index;
                if(!usersTyping[msg.group]){
                  usersTyping[msg.group]=[];
                }
                for(let i=0;i<usersTyping[msg.group].length;i++){
                  if(usersTyping[msg.group][i].id==id){
                    index=i;
                    userExists=true;
                    if(!msg.isTyping && userExists){
                      usersTyping[msg.group].splice(index,1);
                    }
                  }
                }
                if(msg.isTyping&&!userExists){
                  usersTyping[msg.group].push({name:name,id:id});
                }
                io.to(msg.group).emit('typing',usersTyping[msg.group]);
              }else{
                socket.emit('banned', msg.group)
              }
            }
          });
        }
      });
    })

    // handling adding groups i'm so close to finish!! 22/10/2020 15:39
    socket.on("create-group", (msg) => {
      const userName = socket.handshake.headers['x-replit-user-name'];
      const userId = socket.handshake.headers['x-replit-user-id'];
      if(userName && userId){
        if(msg.createPrivacyOption === "public") msg.createPsd = "none";
        if(msg.createName && msg.createPsd && msg.createPrivacyOption){
          msg.createName = msg.createName.replace(/ /g,"-")
          msg.createName = msg.createName.replace(/\?/g,"")
          user.findOne({id:userId} , (err, userData) => {
            if(userData){
              group.find({name:msg.createName} , (err, data) => {
                if(data.length === 0){
                  if(userData.meta.groupsCreated <= GroupLimit){
                    if(msg.createPsd==="none"||msg.createPsd.length>=PSDLEN){
                      if(msg.createName.length <= 30){
                        const newGroup = new group({
                          name:msg.createName,
                          password:msg.createPsd,
                          type:msg.createPrivacyOption,
                          admin:{
                            name:userName,
                            id:userId
                          },
                          members:[{
                            name:userName,
                            id:userId
                          }],
                          baned:[],
                          muted:[]
                        })
                        newGroup.save()
                          .then(() => {
                            userData.meta.groupsCreated++;
                            userData.save()
                              .then(()=>{
                                socket.emit('group-added', msg.createName);
                              })
                        })
                      }else{
                        socket.emit('group-creating-error',"group name is too long!")
                      }
                    }else{
                      socket.emit('group-creating-error',"your password is too short!")
                    }
                    
                  }else{
                    socket.emit('group-creating-error', "you passed your group creating limit :(")
                  }
                }else{
                  socket.emit('group-creating-error', `a group with the name of \"${msg.createName}\" already exists`)
                }
              })
            }
          })
        }else{
          // stuff required!
          const requiredStuff=[];
          if(!msg.createName) requiredStuff.push('name');
          if(!msg.createPsd) requiredStuff.push('password');
          socket.emit('required', requiredStuff);
        }
      }
    })
  
    socket.on('join-group', msg => {
      const userName = socket.handshake.headers["x-replit-user-name"];
      const userId = socket.handshake.headers["x-replit-user-id"];
      if(userName&&userId){
      user.findOne({id:userId} , (err, userData) => {
        if(userData){
          group.findOne({name:msg.joinName},(err, groupData)=>{
            if(groupData){
              let userIsMember = false;
              for(let i=0;i<groupData.members.length;i++){
                if(groupData.members[i].name===userName&&groupData.members[i].id===userId){
                  userIsMember=true;
                  break;
                }
              }
              if(!userIsMember){
                if(!groupData.baned.map(userD=>userD.id).includes(userData.id)){
                  if(groupData.password!=="none"){
                    if(groupData.password===msg.joinPsd){
                      groupData.members.push({id:userId,name:userName})
                      groupData.save()
                        .then(()=>{
                          socket.emit('group-added', groupData.name)
                        })
                    }else{
                      socket.emit('group-creating-error',"wrong password :(")
                    }
                  }else{
                    groupData.members.push({id:userId,name:userName})
                    groupData.save()
                      .then(()=>{
                        socket.emit('group-added', groupData.name)
                      })
                  }
                }else{
                  socket.emit('group-creating-error',`you are banned from \"${groupData.name}\" group`)
                }
              }else{
                socket.emit('group-creating-error',`you are already a member of the \"${groupData.name}\" group`)
              }
            }else{
              socket.emit('group-creating-error',`there is no group with the name of \"${msg.joinName}\"`)
            }
          })
        }
      })
      }
    })

    // sending stuff to user
    socket.on('ready', (msg)=>{
      if(!usersTyping[msg]) usersTyping[msg] = [];
      socket.emit('typing',usersTyping[msg]);
      socket.join(msg)
    })

    // handelling changing mode and menu ;)
    socket.on('changing-settings',(msg)=>{
      let userId = socket.handshake.headers['x-replit-user-id']
      user.findOne({id:userId},(err,data)=>{
        if(err){ 
          console.log('error finding a user')
        }else{
          data.meta.nickNameCol=msg.color;
          data.meta.mode=msg.mode;
          data.save()
            .then(()=>{
              // console.log('saved');
            })
            .catch((err)=>{
              console.log('error saving the new settings of the user');
            })
        }
      })
    })

    socket.on('open-hide-menu', (menu)=>{
      const menuUserId = socket.handshake.headers['x-replit-user-id']
      user.findOne({id:menuUserId},(err,userData)=>{
        if(userData){
          userData.meta.menuIsOpen = menu.value;
          userData.save().then()
            .catch((err)=>{console.log('error saving the data of a user')});
        }
      })
    })

    // sending messages
    socket.on('chat message', msg => {
      let userId = socket.handshake.headers['x-replit-user-id'];
      let userName = socket.handshake.headers['x-replit-user-name'];
      if(userName){
        user.findOne({id:userId},(err, userData)=>{
          if(check(msg.content, "spaces")&&userData){
            group.findOne({name:msg.group},(err, groupData)=>{
              if(groupData){
                const groupMembers = groupData.members.map(groupThing => groupThing.name);
                if(groupMembers.includes(userData.name)){
                  if(msg.content.length <= MAXMSG){
                    msg.sender=userId
                    msg.senderName=userName;
                    msg.content = maBoy.clean(msg.content);
                    
                    poto.read(msg.content, msg.group, {name:userName,id:userId})
                    msg.content = plzStopXSSFor(msg.content);
                    msg.content = markdownToHTML(msg.content);
              
                    if(msg.content!=''){
                      let data=new message(msg);
                      data.save().then()
                        .catch((err)=>{
                          console.log(err);
                          console.log('error saving a message');
                        })
                      io.to(msg.group).emit('chat message', msg);
                    }
                  }else{
                    socket.emit('notValid',(msg.content.length));
                  }
                }else{
                  socket.emit('banned', msg.group)
                }
              };
            });
          }
        });
      }
    });
    // leaving groups
    socket.on('leave-group',(msg)=>{
      const userName = socket.handshake.headers['x-replit-user-name'];
      const userId = socket.handshake.headers['x-replit-user-id'];
      user.findOne({id:userId},(err, userData)=>{
        if(!err){
          group.findOne({name:msg.grp},(err, groupData)=>{
            if(!err){
              const groupMembersNames = groupData.members.map(userStuff => userStuff.id);
              if(groupData.admin.id !== userId || msg.sure){
                if(groupMembersNames.includes(userId)){
                  for(let i=0;i<groupData.members.length;i++){
                    if(groupData.members[i].id === userId){
                      groupData.members.splice(i, 1)
                      i--;
                    }
                  }
                  if(groupData.admin.id === userId){
                    groupData.admin.name = "none"
                    groupData.admin.id = "none"
                  }
                  groupData.save()
                    .then(()=>{
                      socket.emit('left-group', "main-repl-chat")
                    }).catch(err => console.log('error saving a group'));
                }
              }else{
                // user leaving is the admin!!!
                socket.emit("are-u-sure", groupData.name)
              }
            }else{
              //error
            };
          })
        }else{
          // error
        };
      })
    })
    //handling user disconnection
    socket.on('disconnect', () => {
      // looping trough EVRY SINGLE GROUP searching for the user who disconnected
      let usersMisteriousGroup;
      for(let groupSeachedIn in usersTyping){
        for(let i=0;i<usersTyping[groupSeachedIn].length;i++){
          if(usersTyping[groupSeachedIn][i].id===socket.id){
            usersMisteriousGroup=groupSeachedIn;
            break;
          }
        }
      }
      if(usersMisteriousGroup){
        for(let i=0;i<usersTyping[usersMisteriousGroup].length;i++){
          if(socket.id==usersTyping[usersMisteriousGroup][i].id){
            usersTyping[usersMisteriousGroup].splice(i,1)
            break;
          }
        }
        io.emit('typing',usersTyping[usersMisteriousGroup]);
      }
    });
  });
}