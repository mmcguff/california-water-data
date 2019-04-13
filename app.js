const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const CryptoJS = require('crypto-js');
const morgan = require('morgan');
const app = express();

const calTestPayload = require('./cal-test.json');

app.use(cors());
app.use(morgan('combined'));

app.get('/californiaWaterData', async function(req, res){
    const API_KEY = '2298ecc1-317c-4f19-a8d0-948ca1ae719f';
	let baseurl = 'http://et.water.ca.gov/api/data';

	// return fetch(baseurl 
	// + "?appKey=" + API_KEY 
	// + "&targets=" + targets 
	// + "&startDate=" + startDate
	// + "&endDate=" + endDate
	// + "&dataItems=day-eto" , 
	// {method: 'get'})
	// .then(function(response) {
	// return response.text();
    // });
    
    /*
    let options = {
        uri: uri,
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
        */

    res.send(calTestPayload);
})


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