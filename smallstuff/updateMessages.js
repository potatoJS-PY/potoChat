let convertFromMs = require('./convertFunc')
let messages = require('../zchema/messageScheme')
const message = require('../zchema/messageScheme')

module.exports = ()=>{
  let messagesoldesnessLimit = convertFromMs(5,'min');
  let thisDate = new Date().getTime();
  let oldMgs = thisDate - messagesoldesnessLimit;
  message.deleteMany({date:{ $lte:oldMgs } },()=>{});
}
