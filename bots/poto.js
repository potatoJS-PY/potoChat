const Bot = require('./botClass');
const group = require('./../zchema/groupsSchema')
const user = require('./../zchema/userSchema')

const help = 
`poto is a thing that can controle **everything** in the app
admin can use it to controle their group

the syntax to use it is poto => command arguments
(e.g poto => say hi)

the commands that are avaible right now are:
###welcome###: shows a welcome message
###help###: give u information about a specified command or shows this message when no arguments are given
###say###: u force poto to say something (it takes one argument)
###hi###: u say hi to poto..
###ban###: you ban someone from your group
###mute###: you mute a user for a given amount of time
###switch_admin###: gives a member the admin role`;

class Poto extends Bot{
  constructor(name, io){
    super(name, io);
    this.helpMsg = help;
    this.speed = 100;
    this.hiStatements = ["what\'s up :)", "hello :)", "how r u doing today?", "hi **BOSS**"]
  }
  doCommand(command, args, grp, sender){
    switch (command){
      case "ban":
        if(args[0]){
          group.findOne({name:grp, members:{$elemMatch:{name:args[0]}}}, (err, groupData)=>{
            user.findOne({name:args[0]},(err, userData)=>{
              if(userData && groupData){
                const bannedPeople = groupData.baned.map(userInfo => userInfo.name);
                if(!bannedPeople.includes(userData.name)){
                  for(let i=0;i<groupData.members.length;i++){
                    if(groupData.members[i].name===userData.name){
                      groupData.members.splice(i, 1);
                      i--;
                    }
                  }
                  groupData.baned.push({
                    name:userData.name,
                    id:userData.id
                  })
                  groupData.save().then(()=>{
                    console.log(this.io)
                    this.sendMsg(`user banned succefully`, this.speed/2, grp)
                  }).catch(()=>{this.sendMsg(`an error happend :(`, this.speed/2, grp)});
                }
              }else{
                if(userData&&!groupData){
                  this.sendMsg(`this user doesn't exist in this group or already banned`, this.speed/2, grp);
                }else{
                  this.sendMsg(`this user doesn't exist`, this.speed/2, grp);
                }
              }
            })
          })
        }else{
          this.sendMsg(`command \"ban\" was expecting one argument`, this.speed, grp);
        }
        break;
      case "unban":
        if(args[0]){
          group.findOne({name:grp}, (err, groupData)=>{
            user.findOne({name:args[0]},(err, userData)=>{
              if(userData){
                // check if user exist
                const members = groupData.members.map(userD => userD.name);
                const banned = groupData.baned.map(userD => userD.name);
                if(!members.includes(userData.name)&&banned.includes(userData.name)){
                  // if not a member and he's banned unban him;
                  console.log("banned")
                  for(let i=0;i<groupData.baned.length;i++){
                    if(groupData.baned[i].name===userData.name){
                      groupData.baned.splice(i, 1);
                      i--;
                    }
                  }
                  groupData.members.push({
                    name:userData.name,
                    id:userData.id
                  });
                  groupData.save()
                    .then(()=>{
                      this.sendMsg(`user \"${userData.name}\" unbanned succefully`, this.speed/2, grp);
                    })
                    .catch(()=>{
                      console.log("error saving group after unbanning user");
                    })

                }else{
                  // else show warning message;
                  this.sendMsg(`user \"${args[0]}\" not banned`, this.speed, grp)
                }
              }else{ 
                this.sendMsg(`user \"${args[0]}\" doesn't exist`, this.speed, grp);
              }
            })
          })
        }else{
          this.sendMsg(`command \"ban\" was expecting one argument`, this.speed, grp);
        }
      case "help":
        if(!args[0]){
          this.sendMsg(this.helpMsg, this.speed, grp);
        }
        break;
      case "say":
        if(args[0]){
          this.sendMsg(args.join(" "), this.speed, grp);
        }else{
          this.sendMsg(`command \"say\" was expecting one argument`, this.speed, grp)
        }
        break;
      case "hi":
        this.sendMsg(this.randomChoice(this.hiStatements), this.speed, grp);
        break;
      default:
        this.sendMsg(`command \"${command}\" not found :(`, this.speed, grp)
    }
  }
  read(msg, grp, sender){
    group.findOne({name:grp},(err, groupData)=>{
      if(groupData){
        if(groupData.admin.id===sender.id){
          const translation = this.translate(msg);
          if(translation){
            this.doCommand(translation.command, translation.commandArguments, grp, sender);
          }
        }
      }
    })
  }
  commandNotFound(command, grp){
    this.sendMsg(`command \"${command}\" not found :(`, this.speed, grp);
  }
}

module.exports = Poto;