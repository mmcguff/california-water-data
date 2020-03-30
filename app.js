
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const morgan = require('morgan');
const app = express();

let moment = require('moment');
moment().format();

function getTime(){
	const today = moment().utcOffset(-8).format('YYYY-MM-DD');
	const sixDaysAgo = moment().utcOffset(-8).subtract(6, 'days').format('YYYY-M-DD');
	return {today, sixDaysAgo};
}

app.use(cors());
app.use(morgan('combined'));

app.get('/californiaWaterData/:target', async (req, res) => {
    const target = req.params.target;
    const startDate = getTime().sixDaysAgo;
    const endDate = getTime().today;
    const API_KEY = process.env.CAL_WATER_APIKEY;
    const uri = 'http://et.water.ca.gov/api/data'
    + '?appKey=' + API_KEY 
	+ '&targets=' + target 
	+ '&startDate=' + startDate
	+ '&endDate=' + endDate
	+ '&dataItems=day-eto';

    const options = {
        headers: {
            'Accept': '*/*'
        }
    };

    await fetch(uri, options)
    .then(response => response.json())
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
});

app.get('/fieldClimateData', async (req, res) => {

    const public_key = process.env.FIELD_CLIMATE_PUBLIC_APIKEY;
    const private_key = process.env.FIELD_CLIMATE_PRIVATE_APIKEY;
    const timestamp = new Date().toUTCString(); 

    const stationCode = '002047A7';
    const method = 'GET';
    const request = `/data/normal/${stationCode}/hourly/last/21d`;
    const uri = `https://api.fieldclimate.com/v1/data/normal/${stationCode}/hourly/last/21d`

    const content_to_sign = method + request + timestamp + public_key;
    let signature = CryptoJS.HmacSHA256(content_to_sign, private_key);
    const hmac_str = "hmac " + public_key + ":" + signature;

        const options = {
            method,
            headers: {
                'Accept': 'application/json',
                'Authorization': hmac_str,
                'Request-Date': timestamp
            }
        }

        await fetch(uri, options)
        .then(response => response.json())
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
});

app.get('/ranchSystems/:days', async (req, res) => {

    const baseurl = 'https://app.ranchsystems.com';
    const username = process.env.RANCH_SYSTEMS_USERNAME;
    const password = process.env.RANCH_SYSTEMS_PASSWORD;
    const requestType = 'data';
    const rmsids = ['227985','227986','227987','227988','227989','227990'];
    const to = new Date().getTime();
    const from = to - req.params.days * 24 * 60 * 60 * 1000

    const request = `/rsapp15/jsp/rsjson.jsp?uname=${username}&pword=${password}&reqtype=${requestType}&rmsids=${rmsids.join(',')}&from=${from}&to=${to}`

    const uri = baseurl + request; 

    await fetch(uri)
    .then(response => response.json())
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));