const appProfile = require('./../smallstuff/appProfile');
const markdownToHTML = require("./../smallstuff/markdown")

module.exports = class Bot{
  constructor(botName, io){
    this.name = botName;
    this.io = io;
  }
  randomChoice(arr){
    const r = Math.floor(Math.random()*arr.length);
    return arr[r]
  }
  translate(msg){
    msg = msg.trim();
    if(msg.match(`${this.name} => `)){
      if(msg.match(`${this.name} => `).index === 0){
        // here the magic happens!
        let command;
        let commandArguments = [];

        let wholeCommand = msg.slice(`${this.name} => `.length, msg.length);
        command = wholeCommand.split(" ")[0];
        commandArguments = wholeCommand.split(" ").slice(1, wholeCommand.split(" ").length)
        return ({
          command:command,
          commandArguments:commandArguments
        })
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
  sendMsg(msg, speed, group){
    setTimeout(()=>{
      let date = new Date().getTime();
      this.io.to(group).emit('chat message', {
        content:markdownToHTML(msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')),
        senderName:appProfile.name,
        date:date,
        color:appProfile.color
      });
    }, speed)
  }
}
