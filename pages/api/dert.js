const puppeteer = require('puppeteer');
var Filter = require('bad-words');

function extractItems() {
    const extractedElements = document.querySelectorAll('div.tweet');
    const items = [];
    for (let element of extractedElements) {
        items.push({
        id: element.getAttribute("data-tweet-id"),
        text: element.getElementsByClassName("TweetTextSize")[0].innerText
        });
    }
    return items;
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
        }
    } catch(e) { 
        console.log("we here");
        items = await page.evaluate(extractItems);
        return items;
    }
}

export default async (req, res) => {
    // Set up browser and page.
    const browser = await puppeteer.launch({
        // headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1280, height: 926 });
    
    // Navigate to the demo page.
    await page.goto(`https://twitter.com/${req.query.user}`);
    
    // Scroll and extract items from the page.
    const items = await scrapeInfiniteScrollItems(page, extractItems);
    const filter = new Filter();
    
    const filtered = items.filter(item => filter.isProfane(item.text));
    
    // Save extracted items to a file.
    // fs.writeFileSync('./items.txt', filtered.map(item => item.text).join('\n') + '\n');
    
    // Close the browser.
    console.log("and we also here");
    await browser.close();
    console.log("browser been had closed");
    // res.setHeader('Content-Type', 'application/json')
    // res.statusCode = 200
    res.send(JSON.stringify(filtered))
  }