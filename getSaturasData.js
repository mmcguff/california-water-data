//package dependencies
const puppeteer = require("puppeteer");
const utils = require("./helper/utils");
const path = require("path");

(async () => {

  console.log('Starting Saturas Cron...');
  //browser setup
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  
  //enable console logging
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  await page.evaluate(() => console.log(`url is ${location.href}`));

  //login
  const loginSelector = '#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span:nth-child(3) > div > div > input';
  const passwordSelector = '#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span:nth-child(4) > div > div > input';
  const signInbuttonSelector = '#root > div > div.jss15 > div > div.sc-fjdhpX.eWGqgb > div > span.sc-cSHVUG.cVdccz > button';

  await page.goto(process.env.SATURAS_LOGIN_URL);
  await page.waitFor(8000);
  await page.focus(loginSelector);
  await page.keyboard.type(process.env.SATURAS_EMAIL);
  await page.focus(passwordSelector);
  await page.keyboard.type(process.env.SATURAS_PASSWORD);
  await page.click(signInbuttonSelector);

  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.waitFor(3000);

  //Graph workflow
  const graphButtonSelector = '#root > div > div.jss14 > header > div.sc-bdVaJa.lfEIfQ > div > a:nth-child(2)';
  const startingDateRangeSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-cqpYsc.fOwIwS > div:nth-child(1) > div > input';
  const _2019DateSelector = '#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div:nth-child(121)';
  const janDateSelector = '#body > div.MuiPopover-root.date-picker-inline > div.MuiPaper-root.MuiPaper-elevation8.MuiPopover-paper.MuiPaper-rounded > div > div.MuiPickersBasePicker-pickerView > div > div.MuiTypography-root.MuiPickersMonth-root.MuiPickersMonth-monthSelected.MuiTypography-h5.MuiTypography-colorPrimary';
  const selectFarmsSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div';
  const canalFarmsCheckboxSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(1) > div > span > span.MuiIconButton-label > input';
  const selectFarmsOkSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-hIVACf.dnpcUk > div.sc-fHxwqH.hsWQHP > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button';
  
  const canalFarmsPlusSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.sc-kcDeIU.fOhYHk > div';
  const canalFarmsPlotsSelectSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div';
  const canalFarmsPlotsInnerCheckboxSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input';
  const canalFarmsPlotsInnerOkSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button';
  const canalFarmsTransSelectSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div';
  const canalFarmsTransInnerCheckboxSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(4) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input';
  const canalFarmsTransInnerOkSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button';

  const poundstonePlusSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.sc-kcDeIU.fOhYHk > div';
  const poundstonePlotsSelectSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input';
  const poundstonePlotsInnerCheckboxSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(1) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div > div > span > span.MuiIconButton-label > input';
  const poundstonePlotsInnerOkSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(1) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button';
  const poundstoneTransSelectSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div';
  const poundstoneTransInnerCheckboxSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-eIHaNI.gsdGgv > div:nth-child(3) > div.sc-dxZgTM.liMceQ > span > span.MuiIconButton-label > input';
  const poundstoneTransInnerOkSelector = '#root > div > div.jss15 > div > div.sc-hzDkRC.igZSEb > div > div.sc-jeCdPy.gjhURx > div > div.sc-likbZx.cPkYea > div.sc-gpHHfC.fnqfNl > div:nth-child(2) > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div:nth-child(2) > div.sc-cEvuZC.fWJbmN > div > div.sc-cBdUnI.dnlong > button';

  await page.click(graphButtonSelector);
  await page.waitFor(2000);
  await page.click(startingDateRangeSelector);
  await page.waitFor(2000);
  await page.click(_2019DateSelector);
  await page.waitFor(2000);
  await page.click(janDateSelector);
  await page.waitFor(2000);
  await page.keyboard.press('\n'); 
  await page.waitFor(2000);
  await page.click(selectFarmsSelector);
  await page.waitFor(1000);
  await page.click(canalFarmsCheckboxSelector);
  await page.click(selectFarmsOkSelector);
  await page.waitFor(1000);
  
  await page.click(canalFarmsPlusSelector);
  await page.waitFor(500);
  
  await page.click(canalFarmsPlotsSelectSelector);
  await page.waitFor(500);
  await page.click(canalFarmsPlotsInnerCheckboxSelector);
  await page.waitFor(500);
  await page.click(canalFarmsPlotsInnerOkSelector);
  await page.waitFor(500);
  
  await page.click(canalFarmsTransSelectSelector);
  await page.waitFor(500);
  await page.click(canalFarmsTransInnerCheckboxSelector);
  await page.waitFor(500);
  await page.click(canalFarmsTransInnerOkSelector);

  await page.waitFor(2000);

  await page.click(poundstonePlusSelector);
  await page.waitFor(500);
  
  await page.click(poundstonePlotsSelectSelector);
  await page.waitFor(500);
  await page.click(poundstonePlotsInnerCheckboxSelector);
  await page.waitFor(500);
  await page.click(poundstonePlotsInnerOkSelector);
  await page.waitFor(500);
  
  await page.click(poundstoneTransSelectSelector);
  await page.waitFor(500);
  await page.click(poundstoneTransInnerCheckboxSelector);
  await page.waitFor(500);
  await page.click(poundstoneTransInnerOkSelector);


  await page.screenshot({ path: "./saturasData/debugging/screenshot.png" });
  await browser.close();
  console.log('Finish Saturas Cron...');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
