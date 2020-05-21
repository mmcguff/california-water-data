const internals = {};
const _ = require('lodash');
let moment = require('moment');
moment().format();

internals.getTime = () => {
    const today = moment().utcOffset(-8).format('YYYY-MM-DD');
    const sixDaysAgo = moment().utcOffset(-8).subtract(6, 'days').format('YYYY-M-DD');
    return {today, sixDaysAgo};
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
            "date": moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetDateStringFormat),
            "10_X_X_4_time": moment(new Date(data[_4inProbeIndexLocation].rmsdata[i].x)).format(targetTimeStringFormat),
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

//jainLogic
internals.jainLogicDeleteCurrentCsvData = async () => {
    fs.readdir(jainLogicDownloadPath, function (err, items) {
        if (err) return console.log(err);

        //ensures that debugging and test csv files are not deleted during this process
        items = items.filter(item => item !== 'debugging');
        items = items.filter(item => item !== 'test.csv');

        items.forEach(file => {
            

            fs.unlink(path.resolve(__dirname, '../jainLogicData', file), (err) => {
                if (err) return console.log(err);
            })
        });
    });
}

async function jainLogicDownload(page, f) {
    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: jainLogicDownloadPath,
    });

    await f();

    console.error('Downloading next file...');
    let fileName;
    let filePath;
    while (!fileName || fileName.endsWith('.crdownload')) {
        await new Promise(resolve => setTimeout(resolve, 100));
        [fileName] = await util.promisify(fs.readdir)(jainLogicDownloadPath);
        //console.log(fileName);
    }

    filePath = path.resolve(jainLogicDownloadPath, fileName);
    return filePath;
}

//TODO: Files get saved in file system okay but logging isn't helpful. fix
internals.jainLogicGetCsv = async (browser, page) => {
    try {
        let pathToCsvData = await jainLogicDownload(page, async () =>
            await page.click('#DownloadDataSpan')
        );

        let { size } = await util.promisify(fs.stat)(pathToCsvData);
        //console.log(pathToCsvData, `${size}B`);
    } finally {
        return;
    }
}

internals.jainLogicGetSelectOptions = async (page, selector) => {
    //TODO:  Figure out a way of getting the station ids dynamically generated from the dropdown
}

internals.jainLogicParseCSV = async (sourceFilePath) => {
    let results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(sourceFilePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => reject(error)) 
        .on('data', row => results.push(row))
        .on('end', data => resolve(results))
      })
}

internals.jainLogicTransformData = async (rawData, sort, days) => {
    let transformedData = [...rawData];


    if(sort === 'ascend')
    {
        transformedData = transformedData.reverse();     
    }   

    return transformedData;
}

module.exports = internals;