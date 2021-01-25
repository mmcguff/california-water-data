const moment = require('moment'); 
moment().format(); 

const now = moment().unix();
const then = moment().subtract(2, 'years').unix();

console.log(now);
console.log(then);

