var crypto = require("crypto");
exports.separateNum = function(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
exports.getHashValue = function(str){
  
}
