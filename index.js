// importing stuff
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
     
const updateMessages = require('./smallstuff/updateMessages');
const convertToMs = require('./smallstuff/convertFunc');
const listen = require('./socketEvents');
const router = require('./routes');
     
const uri = process.env.URL;
     
// connecting to mongoDB database
mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology:true
},()=>{
  console.log('database ready to go!');
})   
     
//  networking with the client
     
app.use(express.static('public'));
app.set('view engine','ejs');

//  routes and io connection stuff LOL
app.use(router)
listen(io);

// main loop stuff
const mainLoop = setInterval(()=>{
  updateMessages()
},convertToMs(5,'min'))

// listenning at port 3000
http.listen(3000);