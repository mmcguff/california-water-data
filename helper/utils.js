const _ = require('lodash');
const path = require('path');
const util = require('util');
const fs = require('fs');
const csv = require('fast-csv');
const Moment = require('moment');
Moment().format();
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

//AWS
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

//custom configuration
const jainLogicDownloadPath = path.join(__dirname, '../jainLogicData');
const internals = {};

//califorinaWaterData
internals.calWaterDataGetTime = () => {
    const today = Moment().utcOffset(-8).format('YYYY-MM-DD');
    const sixDaysAgo = Moment().utcOffset(-8).subtract(6, 'days').format('YYYY-MM-DD');
    return { today, sixDaysAgo };
}

internals.ranchSystemsTransform = (sourcePayload, rb) => {
    
    const targetDateStringFormat = 'YYYY/MM/DD hh:mm:ss';
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

//jainLogic web crawling helpers


internals.jainLogicDeleteCurrentCsvData = async () => {

    const targetFilePaths = [
        '../jainLogicData/1y',
        '../jainLogicData/1m'
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

internals.jainLogicGetAllFileFromS3 = async () => {
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
        '../jainLogicData/1y',
        '../jainLogicData/1m'
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
                params.Body = fs.readFileSync(path.join(__dirname, `../jainLogicData/${folder}`, file))
                
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
            transformedData.push(arr[i]);
        }
    }
    
    return transformedData;
}

module.exports = internals;