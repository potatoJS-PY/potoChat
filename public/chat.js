// (function (){
let socket = io();
color = usercolor;
showMenuOrHideIt(showMenu);
document.title = usergroup;

window.addEventListener('load',() => {
  body.classList.replace('starting','chat')
})

const groupNames = [];
const groupNamesElements = $All('.group .group-link p');
for(let i=0;i<groupNamesElements.length;i++){
  if(groupNamesElements[i].textContent !== "main-repl-chat"){
    groupNames.push(groupNamesElements[i].textContent)
  }
}
for(let i=0;i<groupNames.length;i++){
  leaveGroupButtons[i].addEventListener('click',()=>{
    socket.emit('leave-group', {
      grp:groupNames[i],
      sure:false
    });
    body.classList.replace('chat','loading');
  })
}


createGroup.addEventListener("click",()=>{
  if(groupCreateNameInput.value&&groupPrivacyChoice){
  socket.emit("create-group",{
    createName:groupCreateNameInput.value,
    createPsd:groupCreatePsdInput.value,
    createPrivacyOption:groupPrivacyChoice
  })
  body.classList.replace("chat","loading")
  }
})
// event listenning 

joinGroup.addEventListener("click",()=>{
  socket.emit("join-group",{
    joinName:groupJoinNameInput.value,
    joinPsd:groupJoinPsdInput.value
  })
  body.classList.replace("chat","loading")
})

let groupPrivacyChoice = "private";

$("#create-group-button").addEventListener('click', ()=>{
  $(".required").style.display = "none";
  groupAdder.classList.replace('notActive','active');
})
$("#blur-group-create").addEventListener('click', closeGroupAdder);

const groupSettingsButtons = $All(".group-settings-button");
const groupSettings = $All(".group-settings");
const secretBlur = $("#secret-blur")

secretBlur.addEventListener('click',()=>{
  for(let i=0;i<groupSettings.length;i++){
    groupSettings[i].classList.replace("active","notActive")
  }
  secretBlur.classList.replace("active","notActive")
})

for(let i=0;i<groupSettingsButtons.length;i++){
  groupSettingsButtons[i].addEventListener('click',()=>{
    groupSettings[i].classList.replace("notActive","active");
    secretBlur.classList.replace("notActive","active");
  })
}

groupPrivacyOption.addEventListener('click', ()=>{
  const isGPOOpen = groupPrivacyOption.classList.contains("activeOption");
  if(isGPOOpen){
    groupPrivacyOption.classList.replace('activeOption','notActiveOption');
  }else{
    groupPrivacyOption.classList.replace('notActiveOption','activeOption');
  }
})
groupPrivacyOption2.addEventListener('click', ()=>{
  groupPrivacyOption.classList.replace('activeOption','notActiveOption');
  groupPrivacyChoice = groupPrivacyOption2.textContent;
  groupPrivacyOption.textContent = groupPrivacyChoice;
  if(groupPrivacyChoice === "public"){
    groupCreatePsdInput.classList.replace('activeInput','notActiveInput')
    groupCreatePsdInput.setAttribute( "disabled", "disabled" );
    groupPrivacyOption2.textContent = "private";
  }
  if(groupPrivacyChoice === "private"){
    groupPrivacyOption2.textContent = "public";
    groupCreatePsdInput.removeAttribute( "disabled" );
    groupCreatePsdInput.classList.replace('notActiveInput','activeInput');
  }
})

groupSearchingInput.addEventListener('input', ()=>{
  const groupsLinks = $All('.group .group-link p');
  const groups = $All('.group');
  for(let i=0;i<groupsLinks.length;i++){
    const groupExist = groupsLinks[i].textContent.search(groupSearchingInput.value) !== -1 ;
    if(groupExist){
      groups[i].classList.replace("notChoosen","choosen");
    }else{
      groups[i].classList.replace("choosen","notChoosen");
    }
  }
})

messageInput.focus()
messageInput.addEventListener('input', ()=>{
  socket.binary(false).emit('typing',{
    isTyping:(!messageInput.value==''),
    group:usergroup
  })
})

menuButton.addEventListener('click', ()=>{
  showMenu=!showMenu
  showMenuOrHideIt(showMenu)
})

let colorIndex=nicknamescolors.indexOf(color);
nicknamescolorsDiv[colorIndex].classList.add('element-selected');

messageInput.addEventListener('keypress', (event) => {
  if(event.code === 'Enter'){
    event.preventDefault();
  }
  if (event.code === 'Enter'&&!shiftPressed) {
    sendMessage();
  }else if(event.code === 'Enter'&&shiftPressed){
    messageInput.value += "\n";
  }
})
messageInput.addEventListener('keydown', (event) => {
  shiftPressed = event.shiftKey
})

settingsButton.addEventListener('click', () => {
  settings.classList.replace('notActive','active')
  wishedColor=color;
})
saveButton.addEventListener('click', ()=>{
  color=wishedColor;
  mode=choosenMode;
  changeMode(mode)
  closeSettings()

  // emitting settings changes
  socket.binary(false).emit('changing-settings',{
    mode:mode,
    color:color,
    name:username
  })
})

// socket events
socket.on('banned', group => {
  console.log(group);
  $("#ban-message").classList.replace("notActive", "active");
  messageInput.blur();
});
function showGroupError(error){
  body.classList.replace("loading","chat");
  $(".required").style.display = "block";
  $(".required").textContent = error;
}
socket.on('are-u-sure', (group)=>{
  console.log(group)
  $("#are-u-sure-popup").classList.replace('notActive','active');
  $('#group-name-sure-msg').textContent = `\"${group}\"`;
  groupWannaLeave = group;
  body.classList.replace("loading","chat");
})

//
$("#are-u-sure-popup .cancel").addEventListener('click', ()=>{
  closeSureMsg();
})
$("#are-u-sure-popup .save").addEventListener('click', ()=>{
  socket.emit("leave-group", {
    grp:groupWannaLeave,
    sure:true
  });
})
//

socket.on('left-group', group => {window.location.href = group});
socket.on('group-added', group => {window.location.href = group});
socket.on('group-creating-error', showGroupError);

socket.on('required',(required)=>{
  console.log(required);
  required.join(' and ');
  const error = required.length === 1?`${required} is required`:`${required} are required`;
  showGroupError(error);
})

socket.on('debugging', (err)=>{
  console.log(err);
})
socket.binary(false).emit('ready',usergroup)
for(let i=0;i<14;i++){
  nicknamescolorsDiv[i].addEventListener('click', ()=>{
    wishedColor=nicknamescolors[i];
    removeAllElementsSelected();
    nicknamescolorsDiv[i].classList.add('element-selected');
  })
}
socket.on('typing', updateUsersTyping)
socket.on('notValid', openMessageLengthWarning)
socket.on('chat message', (msg) => {
  let shouldScroll = (messages.scrollTop == messages.scrollHeight -  messages.offsetHeight || msg.name==id);
  createMessage(msg);
  if (shouldScroll) messages.scrollTop = messages.scrollHeight;
});

function showMenuOrHideIt(showMenu){
  if(showMenu){
    menu.style.display="";
    menu.classList.add("active");
    mainChatContent.style.width=`calc(100% - 300px)`;
  }else{
    menu.style.display="none";
    menu.classList.remove("active");
    mainChatContent.style.width="100%";
  }
  socket.binary(false).emit("open-hide-menu", {value:showMenu});
}

function sendMessage() {
  if(!isJustSpaces(messageInput.value)){
    let date = new Date().getTime();
    socket.binary(false).emit('chat message', {
      content: messageInput.value,
      color:color,
      group:usergroup,
      date:date
    });
    messageInput.value = '';
    socket.binary(false).emit('typing',{
      isTyping:false,
      group:usergroup
    });
  }
}

// })();

