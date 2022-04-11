export class VerificateAccountHelper {

  protected readonly serviceUrl = 'https://www.riotgames.com/ru'
  protected readonly puppeteer = require('puppeteer')

  public async verificate(login: string, password: string, lastmatch: number): Promise<string> {
    let verified = '';

    if (lastmatch) {
      lastmatch = new Date().getTime()
    }

    const browser = await this.puppeteer.launch({ headless: true,  args: ['--disable-setuid-sandbox', '--no-sandbox', '--incognito'] })

    const page = await browser.newPage()

    await page.setViewport({ width: 1400, height: 720 })

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

    //await page.setDefaultNavigationTimeout(0)

    await page.goto(this.serviceUrl, { waitUntil: 'load', timeout: 0 })

console.log('From puppeteer service: loaded page!')

try {
    await Promise.all([
      page.click('#riotbar-right-content > div.undefined.riotbar-account-reset._2f9sdDMZUGg63xLkFmv-9O.riotbar-account-container > div > a'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 })
    ])
} catch (err) {
	console.log('Error exideed' + err)
	await Promise.all([
	page.click('#riotbar-right-content > div.undefined.riotbar-account-reset._2f9sdDMZUGg63xLkFmv-9O.riotbar-account-container > div > a'),
	page.waitForNavigation({waitUntil: 'networkidle0'})
	])
}

    //await page.screenshot({ path: 'fullpage.png', fullPage: true })

    
      await page.type('body > div:nth-child(3) > div > div > div.grid.grid-direction__row.grid-page-web__content > div > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div:nth-child(1) > div > input', login)
      
      await page.type('body > div:nth-child(3) > div > div > div.grid.grid-direction__row.grid-page-web__content > div > div > div.grid.grid-align-center.grid-justify-space-between.grid-fill.grid-direction__column.grid-panel-web__content.grid-panel__content > div > div > div > div.field.password-field.field--animate > div > input', password)
await page.waitForTimeout(1500)
      //await page.screenshot({path: 'fullpage.png'})
   
try {
	console.log(lastmatch)
	
	await Promise.all([
	page.click('body > div:nth-child(3) > div > div > div.grid.grid-direction__row.grid-page-web__content > div > div > button'),  
      	page.waitForNavigation({waitUntil: 'networkidle0', timeout: 7000})
	])
		if (typeof lastmatch != 'undefined') {
      const days = Math.floor(Math.abs(new Date().getTime() - lastmatch) / (1000 * 60 * 60 * 24))
      if ( days < 30 ) {
        verified = 'pending'
      } else {
        verified = 'not valid'
      } 
	} else { verified = 'pending' }
    } catch (err) 
    { console.log(err.message)
	    if (err.message == 'Execution context was destroyed, most likely because of a navigation.') {
		    console.log('Valid!')
      verified = 'pending'} else { verified = 'not valid'; console.log(err) }
    }

    /* End script block */
    await browser.close()

    return verified
  }

}
