const atn = require('./helpers/atn-cron-utils');
const fetch = require('node-fetch');
const moment = require('moment'); 
moment().format(); 

(async () => {

const cookie = await atn.getSessionCookieFromLogin();
const endDate = moment().unix();
const startDate = moment().subtract(2, 'years').unix();

//make api call using fetch to get needed data
const url = `https://atn.irrigate.net/values2?action=getValuesJson&startDate=${startDate}&endDate=${endDate}&width=1710&panelId=23847&tagNodeIds=27368,27356,27351,27341,27354,-1,`;

console.log(cookie);







//download the data

//push data into aws

//TODO: Create routes for accessing the data you have saved. 


})();