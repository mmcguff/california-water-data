const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const CryptoJS = require('crypto-js');
const morgan = require('morgan');
let moment = require('moment');
moment().format();
const app = express();

const calTestPayload = require('./cal-test.json');



app.use(cors());
app.use(morgan('combined'));


function getTime(){
	const today = moment().utcOffset(-8).format('YYYY-MM-DD');
	const sixDaysAgo = moment().utcOffset(-8).subtract(6, 'days').format('YYYY-M-DD');
	return {today, sixDaysAgo};
}

app.get('/californiaWaterData/:target', async function(req, res){
    const target = req.params.target;
    const startDate = getTime().sixDaysAgo;
    const endDate = getTime().today;
    const API_KEY = '2298ecc1-317c-4f19-a8d0-948ca1ae719f';
    const uri = 'http://et.water.ca.gov/api/data'
    + '?appKey=' + API_KEY 
	+ '&targets=' + target 
	+ '&startDate=' + startDate
	+ '&endDate=' + endDate
	+ '&dataItems=day-eto';
    
    let options = {
        uri,
        headers: {
            'Accept': 'application/json'
        },
        json: true 
    };
     
    rp(options)
        .then(function (payload) {
            res.send(payload);
        })
        .catch(function (err) {
            console.log(err);
            res.send(err);
        });

});


app.get('/fieldClimateData', async function(req, res){

    const public_key = '8e0037389c697e256700b56601738ee7cf2de70e';
    const private_key = '9bb981cba1243576de45e917d892c7106abf2250';
    const timestamp = new Date().toUTCString(); 

    const stationCode = '002047A7';
    const method = 'GET';
    const request = `/data/normal/${stationCode}/hourly/last/21d`;
    const uri = `https://api.fieldclimate.com/v1/data/normal/${stationCode}/hourly/last/21d`

    const content_to_sign = method + request + timestamp + public_key;
    let signature = CryptoJS.HmacSHA256(content_to_sign, private_key);
    const hmac_str = "hmac " + public_key + ":" + signature;

        let options = {
            uri,
            headers: {
                'Accept': 'application/json',
                'Authorization': hmac_str,
                'Request-Date': timestamp
            },
            json: true 
        };
         
        rp(options)
            .then(function (payload) {
                res.send(payload);
            })
            .catch(function (err) {
                console.log(err);
                res.send(err);
            });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));