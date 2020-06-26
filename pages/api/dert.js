const puppeteer = require('puppeteer');
const Filter = require('bad-words');

function extractItems() {
    // const elementAtEndOfTimeline = document.querySelectorAll('div#timeline :not(div.tweet)');
    // console.log(elementAtEndOfTimeline);
    // if (elementAtEndOfTimeline.length > 0) {
        const extractedElements = document.querySelectorAll('div.tweet');
        const items = [];
        for (let element of extractedElements) {
            items.push({
                id: element.getAttribute("data-tweet-id"),
                text: element.getElementsByClassName("TweetTextSize")[0].innerText
            });
        }
        return items;
    // }
    // return null;
}

async function scrapeInfiniteScrollItems(
    page,
    extractItems
    ) {
    let items = [];
    try {
        let previousHeight;
        while (true) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`, {timeout: 10000});
            // items = await page.evaluate(extractItems);
            // if (items != null) {
            //     return items;
            // }
            // await page.waitFor(5000);
        }
    } catch(e) { 
        console.log("we here");
        // return [];
        items = await page.evaluate(extractItems);
        return items;
    }
}

export default async (req, res) => {
    // Set up browser and page.
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });
    const username = "diggins_app";
    const pwd = "***************";
    // Navigate to the demo page.
    // await page.goto(
    //     `https://twitter.com/${req.query.user}/with_replies`,
    //     { waitUntil: 'networkidle2' }
    // );
    // await page.waitForSelector('input.email-input');
    // await page.type('input.email-input', username);
    // await page.type('input.js-password-field', pwd);
    // await page.click('button.submit');
    await page.goto(`https://twitter.com/${req.query.user}/with_replies`)
    await page.waitForNavigation();

    // Scroll and extract items from the page.
    console.log("waiting");
    // await setTimeout(async () => {console.log(await page.content())}, 5000);
    console.log(await page.content())
    console.log("waited");
    // console.log(await page.content());

    res.send(JSON.stringify([]))

    const items = await scrapeInfiniteScrollItems(page, extractItems);
    const filter = new Filter();
    const profaneTweetIds = [];
    await console.log(items.length);
    items.forEach(item => {
        if (filter.isProfane(item.text)) {
            profaneTweetIds.push(item.id);
        }
    });
    console.log(profaneTweetIds.length);
    const filtered = items.filter(item => filter.isProfane(item.text));
    
    // Save extracted items to a file.
    // fs.writeFileSync('./items.txt', filtered.map(item => item.text).join('\n') + '\n');
    
    // Close the browser.
    console.log("and we also here");
    // await browser.close();
    // console.log("browser been had closed");
    // res.setHeader('Content-Type', 'application/json')
    // res.statusCode = 200
    // res.send(JSON.stringify(profaneTweetIds))
}