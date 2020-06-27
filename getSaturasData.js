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

  await page.screenshot({ path: "./saturasData/debugging/screenshot.png" });
  await browser.close();
  console.log('Finish Saturas Cron...');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
