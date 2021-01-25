const atn = require('./helpers/atn-cron-utils');
const fetch = require('node-fetch');
const moment = require('moment'); 
moment().format(); 

const emoji = require('node-emoji');

(async () => {

console.log(`...${emoji.get('tulip')} ATN Cron Start`)
const cookie = await atn.getSessionCookieFromLogin();

const endDate = moment().unix();
const startDate = moment().subtract(2, 'years').unix();

console.log(`...${emoji.get('cookie')} Found cookie with JSESSIONID: ${cookie[0].value}`);

//make api call using fetch to get needed data
const url = `http://atn.irrigate.net/values2?action=getValuesJson&startDate=${startDate}&endDate=${endDate}&width=1710&panelId=23847&tagNodeIds=27368,27356,27351,27341,27354,-1`;

const options = {
    method: 'GET',
    headers: {
        'Aceept': 'application/json',
        'Cookie': `JSESSIONID=${cookie[0].value}`
    }
};

console.log(`...${emoji.get('repeat')} Fetching data for JH1 Soil Mositure from ${emoji.get('date')} ${moment.unix(startDate).format("MM/DD/YYYY")} to ${emoji.get('date')} ${moment.unix(endDate).format("MM/DD/YYYY")}`);
await fetch(url, options)
.then(response => response.json())
.then(data => {
    atn.uploadDataToS3(JSON.stringify(data), `atn-${moment.unix(startDate).format("MM-DD-YYYY")}to${moment.unix(endDate).format("MM-DD-YYYY")}`);
    process.env['ATN_S3_FILENAME'] = `atn-${moment.unix(startDate).format("MM-DD-YYYY")}to${moment.unix(endDate).format("MM-DD-YYYY")}`;
})
.catch(err => {
    console.log(err);
})

//push data into aws

//TODO: Create routes for accessing the data you have saved. 


})();