module.exports=(val,mes)=>{
  switch (mes){
    case 'sec':
    return 1000*val
    case 'min':
    return 1000*60*val
    case 'hour':
    return 1000*60*60*val
    case 'day':
    return 1000*60*60*24*val
    case 'week':
    return 1000*60*60*24*7*val
  }
}