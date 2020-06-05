const utils = require('./helper/utils');

(async () => {

  const files = await utils.jainLogicGetAllFilesFromS3();
  let mCSV = [];
  let yCSV = [];
  let mKeyIndex;
  let yKeyIndex;

  files.forEach(file => {
    if(file.includes('1m')){
      mCSV.push(file);
    } else {
      yCSV.push(file);
    }
  });

  

  mKeyIndex = mCSV.findIndex(file => file.includes('Meridian'));
  yKeyIndex = yCSV.findIndex(file => file.includes('Meridian'));

  await utils.jainLogicDownloadFileFromS3(mCSV[mKeyIndex], '1m.csv');
  await utils.jainLogicDownloadFileFromS3(yCSV[yKeyIndex], '1y.csv');
  

})();
