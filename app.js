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
const mSourceFilePath = path.join(__dirname, 'cron-jainlogic/data/1m.csv');
const ySourceFilePath = path.join(__dirname, 'cron-jainlogic/data/1y.csv');

//middleware
const jainLogicGetTargetCSVFromLocation = require('./middleware/jainLogicGetTargetCSVFromLocation');
const saturasGetTargetDataFromLocation = require('./middleware/saturasGetTargetDataFromLocation');

//custom utlis
const utils = require('./helpers/utils');

//Swagger Configs
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./configs/swaggerJSDocsOptions');
const swaggerDocs = swaggerJSDoc(swaggerOptions);


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /fieldClimateData:
 *  get:
 *      summary: Request specifc fieldClimate Mositure data (no parameters) 
 *      responses:
 *          '200':
 *              description: ok
 */
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

/**
 * @swagger
 * /californiaWaterData/{target}:
 *  get:
 *      summary: Request water data from a specifc target region. (target = 250)
 *      parameters: 
 *          - in: path
 *            name: target
 *            schema:
 *            type: string
 *            default: '250'
 *            required: true
 *            description: Numeric ID of the target location  
 *      responses:
 *          '200':
 *              description: ok
 */
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
        const errorObject = {
            error: {
                name: 'califorina-water-api-internal-error',
                message: 'The internal api called to provide data to this route is unavailable or failing right now.  Please try again later.',
                errorBody: err
            }
        }
        console.log(errorObject);
        res.send(errorObject);
    })
});


/**
 * @swagger
 * /ranchSystems/{days}:
 *  post:
 *      summary: Request ranch system soil mositure data filter by number of days.  (days = 365)
 *      description: IMPORTANT- SAMPLE REQUEST BODY ISN'T WORKING.  COPY AND PASTE FROM HERE = {"_4inProbeId" &#58; 227967,"_12inProbeId"&#58; 227968,"_24inProbeId"&#58; 227969,"_36inProbeId"&#58; 227970,"_48inProbeId"&#58; 227971,"_60inProbeId"&#58; 227972,"_0To100PSIProbeId"&#58; 227975}
 *      requestBody:
 *       content:
 *         application/json:
 *           schema:      
 *             type: object
 *             properties:
 *               _4inProbeId:
 *                 type: integer
 *               _12inProbeId:
 *                 type: integer
 *               _24inProbeId:
 *                 type: integer 
 *               _36inProbeId:
 *                 type: integer 
 *               _48inProbeId:
 *                 type: integer
 *               _60inProbeId:
 *                 type: integer 
 *               _0To100PSIProbeId:
 *                 type: integer 
 *             example:
 *              _4inProbeId : 227967
 *              _12inProbeId : 227968
 *              _24inProbeId : 227969
 *              _36inProbeId : 227970
 *              _48inProbeId : 227971
 *              _60inProbeId : 227972
 *              _0to100PSIProbeId : 227975        
 *      parameters: 
 *          - in: header
 *            name: username
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *          - in: header
 *            name: password
 *            required: true
 *            schema:
 *              type: string
 *              required: true
 *          - in: path
 *            name: days
 *            required: true
 *            description: Number of days desired in your response
 *            schema:
 *              type: string
 *              default: '31'
 *      responses:
 *          '200':
 *              description: ok
 */
app.post('/ranchSystems/:days', async (req, res) => {

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

/**
 * @swagger
 * /jainlogic/{location}:
 *  get:
 *      summary: Use to get jainlogic soil moisutre data (days range from 1 to 365)
 *      parameters:
 *          - in: path
 *            name: location
 *            required: true
 *            schema:
 *              type: string
 *              enum: [ag-park-east-smp, ag-park-east-pump, ag-park-west-unified, balthazar-prunes-smp, balthazar-walnuts-smp, buttehouse-prunes-nw, buttehouse-ws, home-walnuts-ws, lynna-s-block-ws,meridian-walnuts-ws, sanders-e, sanders-m-ws, south-sommers, sanders-pump, ag-park-west-pump]
 *              default: 'ag-park-east-smp'
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string              
 *              enum: [ascend, descend]
 *              example: ascend
 *          - in: query
 *            name: days
 *            schema:
 *              type: string              
 *              default: '31'
 *              example: 31
 *          - in: query
 *            name: type
 *            schema:
 *              type: string              
 *              enum: [daily, hourly]
 *              example: daily
 *      responses:
 *          '200':
 *              description: ok
 * 
 */
app.get('/jainlogic/:location', jainLogicGetTargetCSVFromLocation, async(req, res) => {
    
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

/**
 * @swagger
 * /saturas/{location}/{type}:
 *  get:
 *      summary: request saturas-sg to see Tree mositure data.  Data doesn't go about a full year at this time.
 *      parameters:
 *          - in: path
 *            name: location
 *            required: true
 *            schema:
 *              type: string
 *              enum: [canal, poundstone]
 *              default: 'canal'
 *          - in: path
 *            name: type
 *            required: true
 *            schema:
 *              type: string
 *              enum: [plot, transmitor, sensor]
 *              default: 'plot'
 *          - in: query
 *            name: sort
 *            schema:
 *              type: string              
 *              enum: [ascend, descend]
 *              example: ascend
 *          - in: query
 *            name: days
 *            schema:
 *              type: string              
 *              default: '31'
 *              example: 31
 *      responses:
 *          '200':
 *              description: ok
 */
app.get('/saturas/:location/:type', saturasGetTargetDataFromLocation, async(req, res) => {

    const location = res.req.res.locals.location;
    const type = res.req.res.locals.type;
    const sort = req.query.sort ? req.query.sort : 'ascend';
    const days = req.query.days ? req.query.days : 31;

    await utils.saturasDownloadFileFromS3('saturasData.json');

    fs.readFile(path.join(__dirname, `./cron-saturas/data/saturasData.json`),async  (err, data) => {
        if (err) throw err;
        const transformedData = await utils.saturasTransformData(JSON.parse(data), location, type, days, sort);
        res.send(transformedData);
    });  
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));