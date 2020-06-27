//package dependencies
const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const utils = require('./helper/utils');
const path = require('path');

//app dependencies
const _1mDownloadPath = path.join(__dirname, './jainLogicData/1m');
const _1yDownloadPath = path.join(__dirname, './jainLogicData/1y');


async function loopDownloads(page, browser, stationIds, _downloadPath, fileDownloadCount){
  for(let i = 0; i < stationIds.length; i++)
  {
    await page.select('#AssetSelect', stationIds[i].toString())
    await page.waitFor(3000);
    await page.click('#DownloadMenuButton');
    await page.waitFor(3000);
    await utils.jainLogicGetCsv(browser, page, _downloadPath);
  }
}

(async (response) => {

  //Getting a list of old CSV files that we will be deleting after the new stuff gets downloaded
  //Don't want to delete our csv data unelss there is new data to replace it.  
  await utils.jainLogicDeleteCurrentCsvData();
  const oldDataFiles = await utils.jainLogicGetAllFilesFromS3();
  
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 })

  //enable verbose logging in console.
  if(process.env.JAINLOGIC_CRON_VERBOSE_LOGGING == true){
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.evaluate(() => console.log(`url is ${location.href}`));
  }
  
  //login
  const url = process.env.JAINLOGIC_LOGIN_URL;
  await page.goto(url);
  await page.focus('#username');
  await page.keyboard.type(process.env.JAINLOGIC_EMAIL);
  await page.focus('#password');
  await page.keyboard.type(process.env.JAINLOGIC_PASSWORD);
  await page.click('button[type=submit]')

  //customer selection
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  if(process.env.JAINLOGIC_CRON_VERBOSE_LOGGING == true){
    await page.screenshot({ path: './jainLogicData/debugging/afterNetworkIdle.png' });
    console.log('==Screenshot capture: after networkidle0==');
  }

  await page.goto(process.env.JAINLOGIC_DASHBOARD_URL);

  await page.waitFor(5000);

  if(process.env.JAINLOGIC_CRON_VERBOSE_LOGGING == true){
    await page.screenshot({ path: './jainLogicData/debugging/afterClickingView.png' });
    console.log('==Screenshot capture: after clicking View==');
  }

  //hardcoded station ids.  
  const arrStationIds = [41415, 62876, 47273, 47270, 35129, 8948, 8943, 8947, 63719, 8946, 41664, 39202, 48725, 48729, 51278, 48735];
  
  //All 1m data should contain hourly readings
  const csvDurationHandler = await page.$x("//div[contains(text(), '1m')]");
  await csvDurationHandler[0].click();
  await loopDownloads(page, browser, arrStationIds, _1mDownloadPath);

  //All 1y data should contain daily readings
  const csv1YDurationHandler = await page.$x("//div[contains(text(), '1y')]");
  await csv1YDurationHandler[0].click();
  await loopDownloads(page, browser, arrStationIds, _1yDownloadPath);

  //push new files to s3
  await utils.jainLogicPushNewFilesToS3();

  //delete old files from s3
  await utils.jainLogicClearOldFromS3(oldDataFiles);

  await browser.close();
  
})().catch(err => {
  console.error(err);
  process.exit(1);
});