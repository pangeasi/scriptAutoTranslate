const puppeteer = require('puppeteer')
const { deepMap } = require('./utils/deepMap')
const fs = require('fs')
const en = require(process.argv[2])
const URL = 'https://translate.google.com/#view=home&op=translate'

const destiny = 'es';
const target = process.argv[3];


(async () => {
    const browser = await puppeteer.launch({ headless: true })
    const targetFileContent = await deepMap(en, async (value, key) => {
        const page = await browser.newPage()
        let val = ""
        await page.goto(`${URL}&sl=${destiny}&tl=${target}&text=${value}`)
        await page.waitFor(2000,{timeout: 6000})
            .then(async() => {
                const h2 = await page.evaluate(() => document.querySelector('body').innerHTML)
                const regex = new RegExp(`data-language-code=\"${target}\" data-language-name=\".+\" data-text=\"(.+)\" data-crosslingual-hint`)
                const translate = h2.match(regex)[1]
                
                console.log('->', key, translate)
                val = translate
            })
            .catch((err) => {console.log('err', err)})
        await page.close()
        return val
    })

    await browser.close()
    const pathTarget = `${process.argv[2].split('/')[1]}Translated`
    await fs.mkdirSync(pathTarget)
    fs.writeFileSync(`./${pathTarget}/${target}.json`, JSON.stringify(targetFileContent, JSON, 2), {flag: 'w'})
})();