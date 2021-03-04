const semios = require('./helpers/semios-cron-utils');
const fetch = require('node-fetch');
const moment = require('moment');
moment().format();

const emoji = require('node-emoji');

(async () => {
    console.log(`...${emoji.get('tulip')} Semios Cron Start`)
    const xToken = await semios.getXtokenFromLogin();
    console.log(xToken);
})();