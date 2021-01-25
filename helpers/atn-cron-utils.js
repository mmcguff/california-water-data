const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const emoji = require('node-emoji');

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
    const cookie = await page.cookies();
    await browser.close();
    return cookie; 
};

private.navigateToTargetData = async (page) => {
    await page.click('#viewData-image')
}

private.uploadDataToS3 = (data, nameOfFile) => {
    const params = {
        Bucket: 'atn-json-data',
        Key: `${nameOfFile}.json`,
        Body: data
    }

    s3.putObject(params, (err, data) => {
        if (err) console.error(err, err.stack); // an error occurred
        else     console.log(`...${emoji.get('cloud')}  Upload successful for S3 Bucket ${params.Bucket}! ${emoji.get('chart')} ${params.Key}` );           // successful response
      });
}

module.exports = private;