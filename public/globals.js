const $ = selector => document.querySelector(selector);
const $All = selector => document.querySelectorAll(selector);
let shiftPressed = false;
const groupAdder = $("#group-create");
const groupPrivacyOption = $("#privacy-option");
const groupPrivacyOption2 = $("#privacy-option + div");
const cancelGroupAdding = $("#cancel-group-adding");
const createGroup = $("#continue-group-adding");
const joinGroup = $("#join-group");

let groupWannaLeave;

const leaveGroupButtons = $All(".group-setting-leave")

const groupJoinNameInput =   $("#group-join-name-input");
const groupJoinPsdInput =    $("#group-join-psd-input");
const groupCreateNameInput = $("#create-group-name-input");
const groupCreatePsdInput =  $("#create-group-password-input");

const messageInputDiv = $('#chatSpot');
const messageInput = $('#chatSpot #m');
const messages = $('#messages');
const typingP = $('#someone-is-typing');
const userTypingBody = $('#userTypingBody');
const menu = $('#menu');
// i'm at this point very close to finish :) :) :)
const groupSearchingInput = $('#menu input');
const creattingGroupButton = $('#create-group-button');

const settingsButton = $('#settings-button');
const settings = $('#settings');
const saveButton = $('.settingsButtonsSaveCancel #save-settings');
const blur = $('#settings-blur');
const nicknamescolorsDiv = $All('.color-option');
const themeButtons = $('#theme-buttons');
const lightModeButton = $('#light-mode');
const darkModeButton = $('#dark-mode');
const body = $('body');
const messagesList = $All('.message');
const menuButton = $('#menu-button');
const mainChatContent=$('#main-chat-content');
const messageLengthWarningBlur = $('#warning-message-length-blur');
const messageLengthWarning = $('#message-length-warning');
const messageLength = $('#message-length');
const messageLengthCloseButton = $('#close-message-length-warning');
const modesNames=["dark","light"]

const nicknamescolors=[
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
]

let id;
let wishedColor;

// class theme{
//   constructor(name,bgColor,fontCol,settBlur,settingsBgCol,scrollBar,defaultCol){
//     this.name=name;
//     this.backgroundColor=bgColor;
//     this.fontColor=fontCol;
//     this.settingsBlur=settBlur;
//     this.settingsBackgroundColor=settingsBgCol;
//     this.scrollBarClass=scrollBar;
//     this.defaultColor = defaultCol;
//   }
// }
// let darkMode=new theme('dark','rgb(30, 30, 30)','rgb(228, 228, 228)','rgba(0, 0, 0, 0.300)','rgb(40, 40, 40)','darkMode','rgb(255,255,255)');

// let lightMode=new theme('light','white','black', 'rgba(0, 0, 0, 0.623)','white','lightMode','rgb(0, 0, 0)');

let mode = usermode;
let choosenMode = mode;

let defaultColors=['rgb(0, 0, 0)','rgb(255, 255, 255)']
let defaultColor;
if(mode==="darkMode"){
  defaultColor = 'rgb(255, 255, 255)';
}else{
  defaultColor = 'rgb(0, 0, 0)';
}
const defaultColorKeeper = $('#default')
let color;

function replaceClass(element){
  element.classList.replace('hidden','visible')
}