const puppeteer = require('puppeteer');
const private = {};

private.getSessionCookieFromLogin = async () => {
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1920, height: 937 },
        devtools: true,
        args: ['--no-sandbox'] 
        });
    
    const [page] = await browser.pages();
    await page.goto(process.env.ATN_URL);
    await page.waitForSelector('input[name=j_username]');
    await page.focus('input[name=j_username]');
    await page.keyboard.type(process.env.ATN_USERNAME);
    await page.focus('input[name=j_password]');
    await page.keyboard.type(process.env.ATN_PASSWORD);
    await page.click('input[type=submit]');
    return await page.cookies(); 
};

private.navigateToTargetData = async (page) => {
    await page.click('#viewData-image')
}

module.exports = private;