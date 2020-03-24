const puppeteer = require('puppeteer')
const { deepMap } = require('./utils/deepMap')
const fs = require('fs')
const en = require(process.argv[2])
const URL = 'https://translate.google.com/#view=home&op=translate'

const destiny = 'en';
const target = process.argv[3];


(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const targetFileContent = await deepMap(en, async (value, key) => {
        const page = await browser.newPage()
        let val = ""
        await page.goto(`${URL}&sl=${destiny}&tl=${target}&text=${value}`)
        await page.waitForSelector('.tlid-trans-verified-button.trans-verified-button',{timeout: 6000})
            .then(async() => {
                const translate = await page.evaluate(() => document.querySelector('.tlid-translation.translation').textContent)
                console.log('>>>', key, translate)
                val = translate
            })
            .catch(() => {})
        await page.close()
        return val
    })

    await browser.close()
    const pathTarget = `${process.argv[2].split('/')[1]}Translated`
    await fs.mkdirSync(pathTarget)
    fs.writeFileSync(`./${pathTarget}/${target}.json`, JSON.stringify(targetFileContent, JSON, 2), {flag: 'w'})
})();