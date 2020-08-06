//package dependencies
const _ = require('lodash');
const path = require('path');
const util = require('util');
const fs = require('fs');
const csv = require('fast-csv');
const Moment = require('moment');
Moment().format();
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const atob = require('atob');

//AWS
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

//custom configuration
const jainLogicDownloadPath = path.join(__dirname, '../cron-jainlogic');
const saturasDataObjects = require('./saturasObjectModels');
const internals = {};

//califorinaWaterData
internals.calWaterDataGetTime = () => {
    const today = Moment().utcOffset(-8).format('YYYY-MM-DD');
    const sixDaysAgo = Moment().utcOffset(-8).subtract(6, 'days').format('YYYY-MM-DD');
    return { today, sixDaysAgo };
}

internals.ranchSystemsTransform = (sourcePayload, rb) => {
    
    const targetDateStringFormat = 'MM/DD/YYYY h:mm a';
    const targetTimeStringFormat = 'h:mm a';
    const data = sourcePayload.data;

    let transformedPayload = [];

    const _4inProbeId =  rb._4inProbeId;
    const _12inProbeId = rb._12inProbeId;
    const _24inProbeId = rb._24inProbeId;
    const _36inProbeId = rb._36inProbeId;
    const _48inProbeId = rb._48inProbeId;
    const _60inProbeId = rb._60inProbeId;
    const _0To100PSIProbeId = rb._0To100PSIProbeId;

    const _4inProbeIndexLocation = _.findIndex(data, ['id', _4inProbeId]);
    const _12inProbeIndexLocation = _.findIndex(data, ['id', _12inProbeId]);
    const _24inProbeIndexLocation = _.findIndex(data, ['id', _24inProbeId]);
    const _36inProbeIndexLocation = _.findIndex(data, ['id', _36inProbeId]);
    const _48inProbeIndexLocation = _.findIndex(data, ['id', _48inProbeId]);
    const _60inProbeIndexLocation = _.findIndex(data, ['id', _60inProbeId]);
    const _0To100PSIProbeIndexLocation = _.findIndex(data, [ 'id',  _0To100PSIProbeId]);
    
    const arrIndexLengths = [
        data[_4inProbeIndexLocation].rmsdata.length, 
        data[_12inProbeIndexLocation].rmsdata.length, 
        data[_24inProbeIndexLocation].rmsdata.length, 
        data[_36inProbeIndexLocation].rmsdata.length, 
        data[_48inProbeIndexLocation].rmsdata.length, 
        data[_60inProbeIndexLocation].rmsdata.length, 
        data[_0To100PSIProbeIndexLocation].rmsdata.length
    ];
    
    const minCommonLength = Math.min(...arrIndexLengths);

    for (let i = 0; i < minCommonLength; i++) {

        transformedPayload.push({
            "date": Moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetDateStringFormat),
            "10_X_X_4_time": Moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetTimeStringFormat),
            "4_in_soil_moisture": data[_4inProbeIndexLocation].rmsdata[i].y,
            "12_in_soil_moisture": data[_12inProbeIndexLocation].rmsdata[i].y,
            "24_in_soil_moisture": data[_24inProbeIndexLocation].rmsdata[i].y,
            "36_in_soil_moisture": data[_36inProbeIndexLocation].rmsdata[i].y,
            "48_in_soil_moisture": data[_48inProbeIndexLocation].rmsdata[i].y,
            "60_in_soil_moisture": data[_60inProbeIndexLocation].rmsdata[i].y,
            "Pressure_0-100psi": data[_0To100PSIProbeIndexLocation].rmsdata[i].y
        })
    }
    return transformedPayload;
} 

//shared
internals.enableVerboseBrowserLogging = async(page) => {
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));
};

//jainLogic
internals.jainLogicDeleteCurrentCsvData = async () => {

    const targetFilePaths = [
        '../cron-jainlogic/1y',
        '../cron-jainlogic/1m'
    ]

    targetFilePaths.forEach(targetFilePath => {
        fs.readdir(path.join(__dirname, targetFilePath), function (err, files) {
            if (err) return console.log(err);
        
            files.forEach(file => {
                fs.unlink(path.resolve(__dirname, targetFilePath, file), (err) => {
                    if (err) return console.log(err);
                })
            });

            console.log(`..clearing old data files at: ${path.join(__dirname, targetFilePath)}`);
        });  
    });
}

internals.jainLogicGetAllFilesFromS3 = async () => {
    const params = {
        Bucket: process.env.JAINLOGIC_S3_BUCKET
    }

    let targetFiles = [];
    for(;;){
        let data = await s3.listObjects(params).promise();

        data.Contents.forEach((file) => {
            targetFiles = targetFiles.concat(file.Key);
        });

        if(!data.IsTruncated){
            break;
        }
        params.Marker = data.NextMarker;
    }
    return targetFiles;
} 

async function jainLogicDownload(page, downloadPath, f) {
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath,
    });

    await f();

    let fileName;
    let filePath;
    while (!fileName || fileName.endsWith('.crdownload')) {
        await new Promise(resolve => setTimeout(resolve, 100));
        [fileName] = await util.promisify(fs.readdir)(downloadPath);
    }

    filePath = path.resolve(jainLogicDownloadPath, fileName);
    console.log(`..new file downloaded.`);
    return filePath;
}

internals.jainLogicGetCsv = async (browser, page, downloadPath) => {
    try {
        await jainLogicDownload(page, downloadPath, async () =>
            await page.click('#DownloadDataSpan')
        );
    } finally {
        return;
    }
}

internals.jainLogicPushNewFilesToS3 = async () => {
   
    const targetFilePaths = [
        '../cron-jainlogic/1y',
        '../cron-jainlogic/1m'
    ]

    let folder;

    let params = {
        Bucket: process.env.JAINLOGIC_S3_BUCKET
    }

    targetFilePaths.forEach(targetFilePath => {
        fs.readdir(path.join(__dirname, targetFilePath), function (err, files) {
            if (err) return console.log(err);
        
            files.forEach(file => {
                folder = (targetFilePath.includes('1y')) ? '1y': '1m';
                params.Key = `${folder}/${Date.now()}-${file}`;
                params.Body = fs.readFileSync(path.join(__dirname, `../cron-jainlogic/${folder}`, file))
                
                s3.upload(params, (err, data) => {
                    if(err) throw err;
                    console.log(`s3 upload successful at: ${data.Location}`);
                }) 
            });
        });  
    });
}

internals.jainLogicClearOldFromS3 = async (oldDataFiles) => {

    const arrDeletionObj = [];
    oldDataFiles.forEach(file => { arrDeletionObj.push({Key : file})});

    const params = {
        Bucket: process.env.JAINLOGIC_S3_BUCKET,
        Delete: {Objects: arrDeletionObj}
    };

    s3.deleteObjects(params, async(err, data) => {
        if(err) throw err;
        console.log(data);
    });
}


//jainLogic route calling helpers
internals.jainLogicDownloadFileFromS3 = async (Key, fileName) => {

    return new Promise((resolve, reject) => {
        const destPath = path.join(__dirname, `../cron-jainlogic/data/${fileName}`)
        const params = { Bucket: process.env.JAINLOGIC_S3_BUCKET, Key: Key }
        s3.getObject(params)
          .createReadStream()
          .pipe(fs.createWriteStream(destPath))
          .on('close', () => {
            console.log(`File Successfully downloaded at: ${destPath}`);
            resolve(destPath)
          })
      })
}



internals.jainLogicParseCSV = async (sourceFilePath, customHeaders) => {
    let results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(sourceFilePath)
        .pipe(csv.parse({ headers: customHeaders, renameHeaders: true }))
        .on('error', error => reject(error)) 
        .on('data', row => results.push(row))
        .on('end', data => resolve(results))
      })
}

function getDateOnly(dateString){
    let str = dateString;
    let patt = /(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/;
    return str.match(patt)[0];
}

internals.jainLogicTransformData = async (rawData, sort, days) => {
    let arr = [...rawData];
    
    //sorting the array
    arr = (sort === 'ascend') ? arr.reverse() : arr;
    
    const today = moment().utcOffset(-8).format('YYYY-MM-DD');
    const lastValidDate = moment().utcOffset(-8).subtract(days, 'days').format('YYYY-MM-DD');
    const tragetRange = moment.range(lastValidDate, today);
    
    let transformedData = [];
    let rawDate;
    let targetDate;
    for (let i = 0; i < arr.length; i++) {
        rawDate = getDateOnly(arr[i].date);
        targetDate = moment(rawDate, 'MM/DD/YYYY');
        
        if(tragetRange.contains(targetDate))
        {
            arr[i].date = moment(new Date(arr[i].date).toISOString()).format('MM/DD/YYYY h:mm a');
            transformedData.push(arr[i]);
        }
    }
    
    return transformedData;
}

//saturas
internals.saturasDownloadFileFromS3 = async (fileName) => {

    return new Promise((resolve, reject) => {
        const destPath = path.join(__dirname, `../cron-saturas/data/${fileName}`)
        const params = { Bucket: process.env.SATURAS_S3_BUCKET, Key: 'saturas-data.json' }
        s3.getObject(params)
          .createReadStream()
          .pipe(fs.createWriteStream(destPath))
          .on('close', () => {
            console.log(`File Successfully downloaded at: ${destPath}`);
            resolve(destPath)
          })
      })
}

const saturasDownloadJson = async (jsonData) => {
    const fileName = 'saturasData.json';
    const destPath = path.join(__dirname, `../cron-saturas/data/${fileName}`)
    let writeStream = fs.createWriteStream(destPath);
    writeStream.write(jsonData, 'utf8');
    writeStream.on('finish', () => {
        console.log('Saturas JSON Object collected!');
    })
  }
  
  const saturasPushNewFilesToS3 = async (_jsonData) => {
    let params = {
      Bucket: process.env.SATURAS_S3_BUCKET,
      Key: `saturas-data.json`, //if you don't include a time stamp here not implementation of a delete should be needed
      Body: _jsonData,
    };

    s3.upload(params, (err, data) => {
      if (err) throw err;
      console.log(`s3 upload successful at: ${data.Location}`);
    });
  };

internals.saturuasInterceptTargetAPICall = async (page) => {
  const patterns = ['https://saturasapp.com/api/report/plotsreport'];
  const requestCache = new Map();
  const client = await page.target().createCDPSession();

  await client.send('Network.enable');

  await client.send('Network.setRequestInterception', {
    patterns: patterns.map(pattern => ({
      urlPattern: pattern, interceptionStage: 'HeadersReceived'
    }))
  });

  client.on('Network.requestIntercepted', async({ interceptionId, request}) => {
    console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);

    const response = await client.send('Network.getResponseBodyForInterception',{ interceptionId });
    let jsonData;

    if(requestCache.has(response.body)){
      console.log('requestCache called');
      jsonData = requestCache.get(response.body);
    } else {
      const bodyData = response.base64Encoded ? atob(response.body) : response.body;
      jsonData = bodyData;
    }
    await saturasPushNewFilesToS3(jsonData);
    await saturasDownloadJson(jsonData);
  })
}

internals.saturasLoginSequence = async (page) => {
  
  const loginSelector = "#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span:nth-child(3) > div > div > input";
  const passwordSelector = "#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span:nth-child(4) > div > div > input";
  const signInbuttonSelector = "#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span.sc-cSHVUG.cVdccz > button";

  await page.goto(process.env.SATURAS_LOGIN_URL);
  await page.waitFor(8000);
  await page.focus(loginSelector);
  await page.keyboard.type(process.env.SATURAS_EMAIL);
  await page.focus(passwordSelector);
  await page.keyboard.type(process.env.SATURAS_PASSWORD);
  await page.click(signInbuttonSelector);

  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitFor(3000);

}

internals.saturasSelectorClickSequence = async (page) => {
    //TODO:  Build as a loop of clicks but will be verbose for now
    //await utils.saturasSelectorClickSequence(page);

    console.log('graphButtonSelector clicked...');
    await page.click('#root > div > div.jss14 > header > div.sc-bdVaJa.lfEIfQ > div > a:nth-child(2)');
    await page.waitFor(10000);

    console.log('startingDateRangeSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-cqpYsc.fOwIwS > div:nth-child(1) > div > input');
    await page.waitFor(3000);

    console.log('_2019DateSelector clicked..');
    await page.click('#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div:nth-child(121)');
    await page.waitFor(3000);

    console.log('janDateSelector clicked..');
    await page.click('#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div.MuiTypography-root.MuiPickersMonth-root.MuiPickersMonth-monthSelected.MuiTypography-h5.MuiTypography-colorPrimary');
    await page.waitFor(3000);

    console.log('Enter Pressed..');
    await page.keyboard.press('\n'); 
    await page.waitFor(3000);

    console.log('selectFarmsSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div');
    await page.waitFor(3000);

    console.log('canalFarmsCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(1) > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('poundstoneCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(2) > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('selectFarmsOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);

    console.log('canalFarmsPlusSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.sc-kcDeIU.fOhYHk > div');
    await page.waitFor(3000);

    console.log('canalFarmsPlotsSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div');
    await page.waitFor(3000);

    console.log('canalFarmsPlotsInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('canalFarmsPlotsInnerOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);

    console.log('canalFarmsTransSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div');
    await page.waitFor(3000);

    console.log('canalFarmsTransInnerCheckboxSelectorclicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(4) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('canalFarmsTransInnerOkSelector clicked..');
    await page.waitFor(3000);
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');

    console.log('poundstonePlusSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.sc-kcDeIU.fOhYHk > div');
    await page.waitFor(3000);

    console.log('poundstonePlotsSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div');
    await page.waitFor(3000);

    console.log('poundstonePlotsInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('poundstonePlotsInnerOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);

    console.log('poundstoneTransSelectSelector');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div');
    await page.waitFor(3000);

    console.log('poundstoneTransInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(3) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);

    console.log('poundstoneTransInnerOkSelector clicked...');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);

    console.log('createGraphSelector clicked...');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-eKZiaR.ipdBLK > button');
    await page.waitFor(120000);//this insanely long wait time assures that the download of the JSON is complete to S3. 
}

//This function looks to see if the current UnixDate has a reading for irrigationValue at that time stamp
function getMatchedValue(_currentUnixDate, _targetValuesArr){
    
    for(let i = 0; i < _targetValuesArr.length; i++){
        if(_targetValuesArr[i][0] == _currentUnixDate)
        {
            return _targetValuesArr[i][1];
        }
    }
    
    return;
}

internals.saturasTransformData = async (rawData, location, type, days, sort) => {

  const today = moment().utcOffset(-8).format('YYYY-MM-DD');
  const lastValidDate = moment().utcOffset(-8).subtract(days, 'days').format('YYYY-MM-DD');
  const tragetRange = moment.range(lastValidDate, today);
  
  const locationData = (location == 'canal') ? saturasDataObjects.dataObject.canal : saturasDataObjects.dataObject.poundstone; 
  let targetData, currentUnixDate;
  let transformedData = [];

  if (type == 'plot') {
    targetData = rawData.plots;   
    targetData = _.find(targetData, {'plotTIndex': locationData.plotTIndex});

    for(let i = 0; i < targetData.swpAvg.length; i++){
        currentUnixDate = targetData.swpAvg[i][0];

        if(tragetRange.contains(currentUnixDate))
        {
            transformedData.push({
                date: moment(new Date(currentUnixDate)).format('MM/DD/YYYY'), //convert this date using moment
                swpAvg: getMatchedValue(currentUnixDate, targetData.swpAvg),
                et: getMatchedValue(currentUnixDate, targetData.et),
                solarRadiation: getMatchedValue(currentUnixDate, targetData.solarRadiation),
                dailyMaxWind: getMatchedValue(currentUnixDate, targetData.dailyMaxWind),
                rain: getMatchedValue(currentUnixDate, targetData.rain),
                irrigationValue: getMatchedValue(currentUnixDate, targetData.irrigationValue)
            })  
        }
    }
  }
  
  if (type == 'transmitor') {
    targetData = rawData.transmitors;
    targetData = _.find(targetData, {'plotTIndex': locationData.plotTIndex});

    const longestLength = Math.max(targetData.volt.length, targetData.rssi.length, targetData.txTemp.length, targetData.txRh.length, targetData.sf.length);
    const longestArr = targetData.rssi; //TODO:  Find better way to get this
    for(let i = 0; i < longestLength; i++){
        currentUnixDate = longestArr[i][0];

        if(tragetRange.contains(currentUnixDate)){
            transformedData.push({
                date: moment(new Date(currentUnixDate)).format('MM/DD/YYYY h:mm a'),
                volt: getMatchedValue(currentUnixDate, targetData.volt),
                rssi: getMatchedValue(currentUnixDate, targetData.rssi),
                txTemp: getMatchedValue(currentUnixDate, targetData.txTemp),
                txRh: getMatchedValue(currentUnixDate, targetData.txRh),
                sf: getMatchedValue(currentUnixDate, targetData.sf),
            })
        }
    }
  }
  
  if (type == 'sensor'){
    targetData = rawData.sensors;
    targetData = _.find(targetData, {'plotTIndex': locationData.plotTIndex});

    for(let i = 0; i < targetData.sensorSwpAvg.length; i++){
        currentUnixDate = targetData.sensorSwpAvg[i][0];
        if(tragetRange.contains(currentUnixDate)){
            transformedData.push({
                date: moment(new Date(currentUnixDate)).format('MM/DD/YYYY'),
                sensorSwpAvg: targetData.sensorSwpAvg[i][1],
                soilEc: getMatchedValue(currentUnixDate, targetData.soilEc),
                soilVwc: getMatchedValue(currentUnixDate, targetData.soilVwc)
            })
        }
    }
  }  
  return (sort == 'ascend') ? transformedData : transformedData.reverse();
};

module.exports = internals;