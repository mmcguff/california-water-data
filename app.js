//package dependencies
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const morgan = require('morgan');
const app = express();
let moment = require('moment');
moment().format();

//env
const CAL_WATER_BASEURL = process.env.CAL_WATER_BASEURL;
const CAL_WATER_APIKEY = process.env.CAL_WATER_APIKEY;
const FIELD_CLIMATE_BASEURL = process.env.FIELD_CLIMATE_BASEURL;
const FIELD_CLIMATE_PUBLIC_KEY = process.env.FIELD_CLIMATE_PUBLIC_APIKEY;
const FIELD_CLIMATE_PRIVATE_KEY = process.env.FIELD_CLIMATE_PRIVATE_APIKEY;
const RANCH_SYSTEMS_BASEURL = process.env.RANCH_SYSTEMS_BASEURL;
const RANCH_SYSTEMS_USERNAME = process.env.RANCH_SYSTEMS_USERNAME;
const RANCH_SYSTEMS_PASSWORD = process.env.RANCH_SYSTEMS_PASSWORD;

//custom utlis
const utils = require('./helper/utils');

app.use(cors());
app.use(morgan('dev'));

app.get('/californiaWaterData/:target', async (req, res) => {
    
    const target = req.params.target;
    const startDate = utils.getTime().sixDaysAgo;
    const endDate = utils.getTime().today;
    const uri = `${CAL_WATER_BASEURL}?appKey=${CAL_WATER_APIKEY}&targets=${target}&startDate=${startDate}&endDate=${endDate}&dataItems=day-eto`;

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

    const timestamp = new Date().toUTCString(); 
    const stationCode = '002047A7';
    const method = 'GET';
    const request = `/data/normal/${stationCode}/hourly/last/21d`;
    const uri = `${FIELD_CLIMATE_BASEURL}/${stationCode}/hourly/last/21d`

    const content_to_sign = method + request + timestamp + FIELD_CLIMATE_PUBLIC_KEY;
    let signature = CryptoJS.HmacSHA256(content_to_sign, FIELD_CLIMATE_PRIVATE_KEY);
    const hmac_str = "hmac " + FIELD_CLIMATE_PUBLIC_KEY + ":" + signature;

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

    const requestType = 'data';
    const rmsids = ['227985','227986','227987','227988','227989','227990', '227975'];
    const to = new Date().getTime();
    const from = to - req.params.days * 24 * 60 * 60 * 1000
    const uri = `${RANCH_SYSTEMS_BASEURL}/rsapp15/jsp/rsjson.jsp?uname=${RANCH_SYSTEMS_USERNAME}&pword=${RANCH_SYSTEMS_PASSWORD}&reqtype=${requestType}&rmsids=${rmsids.join(',')}&from=${from}&to=${to}`; 
    
    await fetch(uri)
    .then(response => response.json())
    .then(data => {
        res.send(utils.ranchSystemsTransform(data));
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));