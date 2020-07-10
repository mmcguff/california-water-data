//package dependencies
const puppeteer = require("puppeteer");
const utils = require("./helper/utils");

(async () => {

  console.log('Starting Saturas Cron...');
  //browser setup
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: null,
    devtools: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 937 });
  
  //enable console logging
  await utils.enableVerboseBrowserLogging(page);
  await utils.saturuasInterceptTargetAPICall(page); 
  await utils.saturasLoginSequence(page);
  await utils.saturasSelectorClickSequence(page);
  
  await browser.close();
  console.log('Successfully Finish Saturas Cron...');
})().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
