//package dependencies
const puppeteer = require('puppeteer');
const jsonfile = require('jsonfile');
const utils = require('./helper/utils');

(async (response) => {

  //Getting a list of old CSV files that we will be deleting after the new stuff gets downloaded
  //Don't want to delete our csv data unelss there is new data to replace it.  
  await utils.jainLogicDeleteCurrentCsvData();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 })

  //enable verbose logging in console.
//   page.on('console', msg => console.log('PAGE LOG:', msg.text()));
//   await page.evaluate(() => console.log(`url is ${location.href}`));

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

  await page.screenshot({ path: './jainLogicData/debugging/afterNetworkIdle.png' });
  console.log('==Screenshot capture: after networkidle0==');

  await page.goto(process.env.JAINLOGIC_DASHBOARD_URL);

  await page.waitFor(5000);
  await page.screenshot({ path: './jainLogicData/debugging/afterClickingView.png' });
  console.log('==Screenshot capture: after clicking View==');

  //await utils.jainLogicGetSelectOptions(page, '#AssetSelect');
  
  //hardcoded station ids.  
  const arrOfValues = [41415, 62876, 47273, 47270, 35129, 8948, 8943, 8947, 63719, 8946, 41664, 39202, 48725, 48729, 51278, 48735];

  for(let i = 0; i < arrOfValues.length; i++)
  {
    await page.select('#AssetSelect', arrOfValues[i].toString())
    await page.waitFor(5000);
    await page.click('#DownloadMenuButton');
    await page.waitFor(3000);
    await utils.jainLogicGetCsv(browser, page);
  }

  await browser.close();
  
})().catch(err => {
  console.error(err);
  process.exit(1);
});