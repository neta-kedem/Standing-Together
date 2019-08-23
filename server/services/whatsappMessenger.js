const puppeteer = require('puppeteer');

sendMessage = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
    await page.goto('https://web.whatsapp.com');
    await page.waitForSelector("img[alt='Scan me!']");
    await page.screenshot({path: 'example.png'});
    const imageData = await page.evaluate(()=>{
        const qrImg = document.querySelector("img[alt='Scan me!']");
        return qrImg.src;
    });
    await browser.close();
    return imageData;
};
module.exports = {
    sendMessage
};

