//package dependencies
const puppeteer = require("puppeteer");
const utils = require("./helper/utils");

(async () => {

  console.log('Starting Saturas Cron...');
  //browser setup
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 937 },
    devtools: true,
    args: ['--no-sandbox'] 
  });
  const page = await browser.newPage();
  
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
