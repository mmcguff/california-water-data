//package dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
let moment = require('moment');
moment().format();

//env
const CAL_WATER_BASEURL = process.env.CAL_WATER_BASEURL;
const CAL_WATER_APIKEY = process.env.CAL_WATER_APIKEY;
const FIELD_CLIMATE_BASEURL = process.env.FIELD_CLIMATE_BASEURL;
const FIELD_CLIMATE_PUBLIC_KEY = process.env.FIELD_CLIMATE_PUBLIC_APIKEY;
const FIELD_CLIMATE_PRIVATE_KEY = process.env.FIELD_CLIMATE_PRIVATE_APIKEY;
const RANCH_SYSTEMS_BASEURL = process.env.RANCH_SYSTEMS_BASEURL;

//static file paths
const mSourceFilePath = path.join(__dirname, 'jainLogicData/data/1m.csv');
const ySourceFilePath = path.join(__dirname, 'jainLogicData/data/1y.csv');



//middleware
const getTargetCSVFromLocation = require('./middleware/getTargetCSVFromLocation');

//custom utlis
const utils = require('./helper/utils');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/californiaWaterData/:target', async (req, res) => {
    
    const target = req.params.target;
    const startDate = utils.calWaterDataGetTime().sixDaysAgo;
    const endDate = utils.calWaterDataGetTime().today;
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

app.all('/ranchSystems/:days', async (req, res) => {

   let RANCH_SYSTEMS_USERNAME =  req.headers.username || '';
   let RANCH_SYSTEMS_PASSWORD = req.headers.password || '';

   if(!RANCH_SYSTEMS_USERNAME || !RANCH_SYSTEMS_PASSWORD){
       return res.status(401).send("Missing username or password in header");
   }

    const requestType = 'data';
    const rmsids = [
        req.body._4inProbeId,
        req.body._12inProbeId,
        req.body._24inProbeId,
        req.body._36inProbeId,
        req.body._48inProbeId,
        req.body._60inProbeId, 
        req.body._0To100PSIProbeId
    ];
    const to = new Date().getTime();
    const from = to - req.params.days * 24 * 60 * 60 * 1000
    const uri = `${RANCH_SYSTEMS_BASEURL}/rsapp15/jsp/rsjson.jsp?uname=${RANCH_SYSTEMS_USERNAME}&pword=${RANCH_SYSTEMS_PASSWORD}&reqtype=${requestType}&rmsids=${rmsids.join(',')}&from=${from}&to=${to}`; 
    
    await fetch(uri)
    .then(response => response.json())
    .then(data => {
        res.send(utils.ranchSystemsTransform(data, req.body));
    })
    .catch(err => {
        console.log(err);
        res.send(err);
    })
});

app.get('/jainlogic/:location', getTargetCSVFromLocation, async(req, res) => {
    
    //query parameters
    const sort = req.query.sort ? req.query.sort : 'ascend';
    const days = req.query.days ? req.query.days : 31;
    const type = req.query.type ? req.query.type : 'daily';

    const csvHeaders = res.req.res.locals.csvHeaders;
    let rawData;
    
    if(days > 31 && type == 'hourly') return res.send('hourly data not available passed 31 days.');

    //1m monthly 1y daily
    if(days > 31 || type == 'daily'){
        rawData = await utils.jainLogicParseCSV(ySourceFilePath, csvHeaders);
    } else {
        rawData = await utils.jainLogicParseCSV(mSourceFilePath, csvHeaders);
    } 
     
    res.send(await utils.jainLogicTransformData(rawData, sort, days));
});

app.get('/saturas', async(req, res) => {
    fs.readFile(path.join(__dirname, `./saturasData/data/saturasData.json`),async  (err, data) => {
        if (err) throw err;
        const transformedData = await utils.saturasTransformData(JSON.parse(data));
        res.send(transformedData);
    });  
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));