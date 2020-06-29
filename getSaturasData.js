//package dependencies
const puppeteer = require("puppeteer");
const utils = require("./helper/utils");
const path = require("path");

async function selectorClickSequence(page) {

    //TODO:  Build as a loop of clicks but will be verbose for now
    // selectorArr.forEach(async (selector) => {
    //     try {
    //         for (let [selectorName, selectorPath] of Object.entries(selector)) {
    //             await page.click(selectorPath);
    //             console.log(selectorName);
    //             await page.waitFor(3000);
        
    //             if (selectorName == "janDateSelector") {
    //               await page.keyboard.press("\n");
    //             }
        
    //             await page.screenshot({ path: "./saturasData/debugging/progress.png" });
    //           }
    //     } catch (err) {
    //       console.error(err);
    //       process.exit(1);
    //     }
    //   });

    console.log('graphButtonSelector clicked...');
    await page.click('#root > div > div.jss14 > header > div.sc-bdVaJa.lfEIfQ > div > a:nth-child(2)');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('startingDateRangeSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-cqpYsc.fOwIwS > div:nth-child(1) > div > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('_2019DateSelector clicked..');
    await page.click('#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div:nth-child(121)');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('janDateSelector clicked..');
    await page.click('#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div.MuiTypography-root.MuiPickersMonth-root.MuiPickersMonth-monthSelected.MuiTypography-h5.MuiTypography-colorPrimary');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('Enter Pressed..');
    await page.keyboard.press('\n'); 
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('selectFarmsSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(1) > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstoneCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(2) > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('selectFarmsOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsPlusSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.sc-kcDeIU.fOhYHk > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsPlotsSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsPlotsInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsPlotsInnerOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsTransSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsTransInnerCheckboxSelectorclicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(4) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('canalFarmsTransInnerOkSelector clicked..');
    await page.waitFor(3000);
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstonePlusSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.sc-kcDeIU.fOhYHk > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstonePlotsSelectSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstonePlotsInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstonePlotsInnerOkSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstoneTransSelectSelector');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstoneTransInnerCheckboxSelector clicked..');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(3) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('poundstoneTransInnerOkSelector clicked...');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('createGraphSelector clicked...');
    await page.click('#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-eKZiaR.ipdBLK > button');
    await page.waitFor(20000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    console.log('hamburger clicked...');
    await page.click('.highcharts-a11y-proxy-button');
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });
    
    console.log('hover to download button')
    await page.hover('#highcharts-0e2z9so-0 > div.highcharts-contextmenu > ul > li:nth-child(8)');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });

    //await utils.jainLogicGetCsv(browser, page, _downloadPath);
    console.log('download csv clicked');
    await page.click('#highcharts-0e2z9so-0 > div.highcharts-contextmenu > ul > li:nth-child(8)');
    await page.waitFor(3000);
    await page.screenshot({ path: "./saturasData/debugging/progress.png" });
}

(async () => {

  console.log('Starting Saturas Cron...');
  //browser setup
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  
  //enable console logging
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));

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
