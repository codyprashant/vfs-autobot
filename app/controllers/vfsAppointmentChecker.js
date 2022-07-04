require('dotenv').config();
const puppeteer = require("puppeteer");
const sleep = require('sleep');
const axios = require('axios').default;
var urlencode = require('urlencode');
const { saveRecord } = require("./saveData");


const vfsAppointmentChecker =async (destination, origin, email, password) =>{
    const browser = await puppeteer.launch({headless: false, product: 'chrome'
    // , devtools:true
      , args: [
    // '--no-sandbox',
    // '--disable-setuid-sandbox',
    '--disable-web-security'
        ]
    });

    let token = "";
    const page = await browser.newPage();
    const page2 = await browser.newPage();
    await page.setExtraHTTPHeaders({'Accept-Language': 'en' });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
  
    console.log(`Logging into VFS Services... for ${email}`);
    console.log("Accessing VFS Page");
    await page.goto("https://visa.vfsglobal.com/ind/en/nld/login");
    await page.setViewport({ width: 1920, height: 929 });
    sleep.sleep('10');

    const loginRes = await axios.post('https://lift-api.vfsglobal.com/user/login', `username=${email}&password=${password}&missioncode=${destination}&countrycode=${origin}`);
      if(loginRes.status == 200){
        // console.log(loginRes.data)
        token = loginRes.data.accessToken
      }
      console.log(token)
      sleep.sleep('10');  

    let getLocations= await page2.evaluate(async (destination, origin) => { 
        const resp = await fetch(`https://lift-api.vfsglobal.com/master/center/${destination}/${origin}/en-US`);
        const jsonData = await resp.json();
        return jsonData;
     }, destination, origin); 
     console.log("Locations")
     sleep.sleep('5'); 

    for (let i = 0; i < getLocations.length; i++) {
        let getAppointmentCategory = await page2.evaluate(async (destination, origin, getLocations, i) => { 
          const resp = await fetch(`https://lift-api.vfsglobal.com/master/visacategory/${destination}/${origin}/${getLocations[i].isoCode}/en-US`);
          const jsonData = await resp.json();
          return jsonData;
        },destination, origin, getLocations, i ); 
        console.log(`Category for ${getLocations[i].isoCode}`)
        sleep.sleep('5'); 

        for (let j = 0; j < getAppointmentCategory.length; j++) {
          let getVisaSubCategory = await page2.evaluate(async (destination, origin, getLocations, i, getAppointmentCategory, j) => { 
            const resp = await fetch(`https://lift-api.vfsglobal.com/master/subvisacategory/${destination}/${origin}/${getLocations[i].isoCode}/${getAppointmentCategory[j].code}/en-US`);
            const jsonData = await resp.json();
            return jsonData;
          },destination, origin, getLocations, i, getAppointmentCategory, j); 
          console.log(`SubCategory for ${getAppointmentCategory[j].code} of ${getLocations[i].isoCode}`)
          sleep.sleep('5'); 
          for (let k = 0; k < getVisaSubCategory.length; k++) {
            try{
              let url = `https://lift-api.vfsglobal.com/appointment/slots?countryCode=${origin}&missionCode=${destination}&centerCode=${urlencode(getLocations[i].isoCode)}&loginUser=${urlencode(email)}&visaCategoryCode=${urlencode(getVisaSubCategory[k].code)}&languageCode=en-US&applicantsCount=1&days=180&fromDate=05%2F07%2F2022&slotType=2&toDate=28%2F12%2F2022`;
              console.log(url)
              if(token != ""){
                await page.evaluate((token, url) => { 
                    var xhr = new XMLHttpRequest;
                    var data = null;
                    xhr.open("GET", url);
                    xhr.setRequestHeader("authorization", token);
                    xhr.send(data);
                    xhr.onreadystatechange = function() {
                      if (this.readyState == 4 && this.status == 200) {
                        var response = xhr.responseText;
                        localStorage.setItem('slotResponse', response)
                      };
                    };
                }, token, url).then(async respo =>{
                  return await page.evaluate(() => { 
                    let responseData = localStorage.getItem('slotResponse')
                    let responseData2 = JSON.parse(responseData);
                    console.log('Ia ma here')
                    return responseData2;
                  })
                }).then(async res => {
                    if(res?.length > 0){
                      console.log(res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.timeSlot) 
                      console.log(res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.totalSeats) 
                      let timeSlot = res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.timeSlot ? res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.timeSlot : "";
                      let totalSeats = res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.totalSeats ? res[0]?.counters[0]?.groups[0]?.timeSlots[0]?.totalSeats : ""
                      await saveRecord(res[0]?.center, getAppointmentCategory[j]?.name, getVisaSubCategory[k]?.name, res[0]?.date, res[0]?.date, i,timeSlot, totalSeats);
                    }
                  })
                
                sleep.sleep('10'); 

              } else{
                console.log("No Access Token")
              }
  
            } catch(error){
              console.log(error)
            }

          }  

        }
    }
}


module.exports = { vfsAppointmentChecker };