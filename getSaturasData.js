//package dependencies
const puppeteer = require("puppeteer");
const atob = require('atob');
const utils = require("./helper/utils");
const path = require("path");

//cron dependencies
const urlPatterns = ['https://saturasapp.com/api/report/plotsreport'];
const requestCache = new Map();

async function selectorClickSequence(page) {

    //TODO:  Build as a loop of clicks but will be verbose for now
    //await utils.saturasSelectorClickSequence(page);

    console.log('graphButtonSelector clicked...');
    await page.click('#root > div > div.jss14 > header > div.sc-bdVaJa.lfEIfQ > div > a:nth-child(2)');
    await page.waitFor(3000);

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
    await page.waitFor(45000);
}


async function intercept(page, patterns){
  const client = await page.target().createCDPSession();

  await client.send('Network.enable');

  await client.send('Network.setRequestInterception', {
    patterns: patterns.map(pattern => ({
      urlPattern: pattern, interceptionStage: 'HeadersReceived'
    }))
  });

  client.on('Network.requestIntercepted', async({ interceptionId, request, responseHeaders, resourceType}) => {
    console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);

    const response = await client.send('Network.getResponseBodyForInterception',{ interceptionId });

    const contentTypeHeader = Object.keys(responseHeaders).find(k => k.toLowerCase() === 'content-type');
    let jsonData, contentType = responseHeaders[contentTypeHeader];

    if(requestCache.has(response.body)){
      console.log('requestCache called');
      jsonData = requestCache.get(response.body);
    } else {
      const bodyData = response.base64Encoded ? atob(response.body) : response.body;
      jsonData = bodyData;
    }
    await utils.saturasDownloadJson(jsonData);
  })
}

(async () => {

  console.log('Starting Saturas Cron...');
  //browser setup
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    devtools: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  
  //enable console logging
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));

  //function used to determine when payload from graph has been downloaded
  intercept(page, urlPatterns);

  //login
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

  await selectorClickSequence(page);
  await browser.close();
  console.log('Finish Saturas Cron...');
})().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
