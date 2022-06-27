const puppeteer = require("puppeteer");
const sleep = require('sleep');
const { saveRecord } = require("./saveData");
const type = [9, 26, 42, 59, 75, 92, 108, 125];
const subCategory = [12, 29, 45, 62, 78, 95, 111, 128];


const vfsAppointmentChecker =async () =>{
    const browser = await puppeteer.launch({headless: true, args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
  ]});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en' });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');

    console.log(`Logging into VFS Services... for ${process.env.VFS_EMAIL}`);
    console.log("Accessing VFS Page");
    await page.goto("https://visa.vfsglobal.com/ind/en/nld/login");

// page.on('request', interceptRequest => {
//   console.log(interceptRequest.headers());
// })


    await page.setViewport({ width: 1920, height: 929 });
    sleep.sleep('10');
    console.log("Filling Email Id");
    await page.waitForSelector("#mat-input-0");
    await page.click("#mat-input-0");
    await page.type("#mat-input-0", process.env.VFS_EMAIL);
    sleep.sleep('5');
    console.log("Filling Password");
    await page.click("#mat-input-1");
    await page.type("#mat-input-1", process.env.VFS_PASSWORD);
    sleep.sleep('5');
    console.log("Clicking Signin")
    await page.waitForSelector(
      ".form-group:nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix"
    );
    await page.click(
      ".form-group:nth-child(2) > .mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix"
    );
    sleep.sleep('5');
    await page.waitForSelector(".row > .col-12 > .mat-card > .ng-dirty > .mat-focus-indicator");
    await page.click(".row > .col-12 > .mat-card > .ng-dirty > .mat-focus-indicator");
    sleep.sleep('10');
    console.log("Clicking on New Appointment")
    await page.waitForSelector('.container > .card-accordion > .position-relative > .mat-focus-indicator > .mat-button-wrapper');
    await page.click('.container > .card-accordion > .position-relative > .mat-focus-indicator > .mat-button-wrapper');

    for (let i = 0; i < 8; i++) {
        sleep.sleep('10')
        console.log(`Selecting ${i} city from list`)
        await page.waitForSelector("#mat-select-value-1");
        await page.click("#mat-select-value-1");
        sleep.sleep('3');
        await page.waitForSelector(`#cdk-overlay-0 > .mat-select-panel-wrap > #mat-select-0-panel > #mat-option-${i} > .mat-option-text`);
        await page.click(`#cdk-overlay-0 > .mat-select-panel-wrap > #mat-select-0-panel > #mat-option-${i} > .mat-option-text`);
        
        sleep.sleep('10')
        console.log("Clicking on Visa type selection")
        await page.waitForSelector("#mat-select-value-3");
        await page.click("#mat-select-value-3");
        sleep.sleep('3');
        console.log("selecting short Visa")
        await page.waitForSelector(`#cdk-overlay-1 > .mat-select-panel-wrap > #mat-select-2-panel > #mat-option-${type[i]} > .mat-option-text`);
        await page.click(`#cdk-overlay-1 > .mat-select-panel-wrap > #mat-select-2-panel > #mat-option-${type[i]} > .mat-option-text`);
      
        sleep.sleep('10')
        console.log("Clicking on Purpose dropdown")
        await page.waitForSelector(".mat-form-field-infix > #mat-select-4 > .mat-select-trigger > #mat-select-value-5 > .mat-select-placeholder");
        await page.click(".mat-form-field-infix > #mat-select-4 > .mat-select-trigger > #mat-select-value-5 > .mat-select-placeholder");
        sleep.sleep('3');
        console.log("Selecting Business as purpose")
        await page.waitForSelector(`#cdk-overlay-2 > .mat-select-panel-wrap > #mat-select-4-panel > #mat-option-${subCategory[i]} > .mat-option-text`);
        await page.click(`#cdk-overlay-2 > .mat-select-panel-wrap > #mat-select-4-panel > #mat-option-${subCategory[i]} > .mat-option-text`);
        
        sleep.sleep('10')
        await page.waitForSelector('.ng-untouched > .mat-card > .ng-touched > .border-info > .alert')
        let statusResponse = await page.$(".ng-untouched > .mat-card > .ng-touched > .border-info > .alert");

        const statusResponsetext = await (await statusResponse.getProperty('textContent')).jsonValue()
        console.log('Status is', statusResponsetext);
        let dateString ="";
        if(statusResponsetext.includes("Earliest Available Slot")){
          dateString = statusResponsetext.substring(statusResponsetext.indexOf(":") +1, statusResponsetext.length);
          console.log(dateString.trim());
        } else{
          console.log(statusResponsetext)
        }
        const locationSelection = await page.$('#mat-select-value-1 > .mat-select-value-text > .mat-select-min-line');
        const locationSelectionText = await (await locationSelection.getProperty('textContent')).jsonValue()
        console.log('Location is', locationSelectionText);

        const categorySelection = await page.$('#mat-select-value-3 > .mat-select-value-text > .mat-select-min-line');
        const categorySelectionText = await (await categorySelection.getProperty('textContent')).jsonValue()
        console.log('Category is', categorySelectionText);

        const subCategorySelection = await page.$('#mat-select-value-5 > .mat-select-value-text > .mat-select-min-line');
        const subCategorySelectionText = await (await subCategorySelection.getProperty('textContent')).jsonValue()
        console.log('SubCategory is', subCategorySelectionText);

        // await saveRecord("Netherlands Visa Application Center,Hyderabad", "Short-stay Visa", "Business", " Earliest Available Slot : 04/08/2022 ", " 04/08/2022 ");
        await saveRecord(locationSelectionText, categorySelectionText, subCategorySelectionText, statusResponsetext, dateString, i);

        sleep.sleep('15');
        await page.screenshot({path: `vfs-${i}.png`});
    }
}


module.exports = { vfsAppointmentChecker };
