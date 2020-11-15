function changeMode(newMode){
  let old;
  if(newMode==="darkMode"){
    old = "lightMode"
  }else{
    old = "darkMode"
  }
  $("html").classList.replace(old, newMode);

  // for(let i=0;i<modesNames.length;i++){
  //   messageLengthWarning.classList.remove(modesNames[i]+"ModeWarning");
  //   groupAdder.classList.remove(modesNames[i]+"ModeWarning");
  //   menu.classList.remove(modesNames[i]+"ModeMenu")
  // }
  // menu.classList.add(newMode.name+"ModeMenu");
  // messageLengthWarning.classList.add(newMode.name+"ModeWarning")
  // groupAdder.classList.add(newMode.name+"Mode");
}

function closeSureMsg(){
  $('#are-u-sure-popup').classList.replace("active","notActive")
}

function isJustSpaces(text){
  let spaces = 0;
  for(let i=0;i<text.length;i++) if(text[i]==' ') spaces++;
  return (spaces === text.length);
}

function chooseRandomFrom(list){
  let choice = Math.floor(Math.random()*list.length);
  return (list[choice]);
}

function removeAllElementsSelected(){
  for(let j=0;j<14;j++){
    nicknamescolorsDiv[j].classList.remove('element-selected');
  }
}

function closeSettings(){
  settings.classList.replace('active','notActive')
  wishedColor = color;
  removeAllElementsSelected();
  let index=nicknamescolors.indexOf(color);
  nicknamescolorsDiv[index].classList.add('element-selected');
  choosenMode = mode;
  changeMode(mode);
  messageInput.focus();
}


function closeMessageLengthWarning(){
  messageLengthWarning.classList.replace('active','notActive');
}

function closeGroupAdder(){
  groupAdder.classList.replace('active','notActive');
  groupPrivacyOption.classList.replace('active','notActive');
  groupJoinNameInput.value="";
  groupJoinPsdInput.value="";
  groupCreateNameInput.value="";
  groupCreatePsdInput.value="";
}

function updateUsersTyping(msg){
  let typing='';
  let ending='';
  // getting the users typing names :) 
  let usersTyping = msg.map(user => user.name);

  // deleting the user itself so you don't see youself :)
  usersTyping = usersTyping.filter( name => name !== username );
  
  if(usersTyping > 4){
    typing=' oof.. a lot of PEOPLE are typing..';
    ending='';
  }else if(usersTyping.length>=2){
    let theFirst2Guys=usersTyping.splice(0, 2).join(' and ');
    usersTyping.push(' ');
    usersTyping.join(' ,');
    typing+=usersTyping+theFirst2Guys;
    ending=' are typing';
  }else if(usersTyping.length==1){
     typing=usersTyping[0];
     ending=' is typing';
  }else if(usersTyping.length==0){
    typing='';
    ending='';
  }
  
  userTypingBody.textContent=typing;
  typingP.textContent=ending;
}

function openMessageLengthWarning(length){
  console.log(length);
  messageLength.textContent=length-300;
  messageLengthWarning.classList.replace('notActive','active');
}

function createMessage(msg){
  let messageText = document.createElement('div');
  let nickNameP = document.createElement('div');

  messageText.classList.add("message-content");
  nickNameP.classList.add("nickName");

  if(!defaultColors.includes(msg.color)){
    nickNameP.style['color'] = msg.color;
  }else{
    nickNameP.style['color'] = defaultColors;
  }

  nickNameP.title = msg.senderName;
  nickNameP.textContent = msg.senderName;
  let nickNameHolder = document.createElement('div');
  nickNameHolder.appendChild(nickNameP);
  messageText.innerHTML = msg.content;

  let message = document.createElement('li');
  message.className="message";
  message.append(nickNameHolder);
  message.append(messageText);
  messages.append(message);
}

  // body.style['background-color']= newMode.backgroundColor;
  // body.style['color']= newMode.fontColor;
  // lightModeButton.style['color']= newMode.fontColor;
  // darkModeButton.style['color']= newMode.fontColor;
  // settings.style['background-color']= newMode.settingsBackgroundColor;
  // blur.style['background-color']= newMode.settingsBlur;
  // messageInput.style['background-color']= newMode.backgroundColor;
  // messageInput.style['color']= newMode.fontColor;
  // messages.className=newMode.scrollBarClass;
  // defaultColor=newMode.defaultColor;
  // defaultColorKeeper.style['background-color']=newMode.defaultColor;
  // userTypingBody.style['color']=newMode.defaultColor;
  // menuButton.style.color=newMode.defaultColor;