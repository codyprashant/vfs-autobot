const mongoDB = require("mongodb");
const mongoClient = mongoDB.MongoClient;
const objId = mongoDB.ObjectId;
const dbUrl = process.env.DB_URL;
const LocationRecord = require('../models/locationRecord');
const { sendEmail, sendErrorEmail } = require("../utils");
const receiverEmail = process.env.RECEIVER_EMAIL
const sleep = require('sleep');

const saveRecord = async (locationSelectionText, categorySelectionText, subCategorySelectionText,
     statusResponsetext, dateString, locationCode, availbileTime, availbileSlots) => {
        try{
            let emails = receiverEmail.split(',');
            let availble = new Date(statusResponsetext);
            if(availble.getMonth+1 == 7){
                for (let k = 0; k < emails.length; k++) {
                    await sendEmail(locationSelectionText, statusResponsetext, availbileTime, email[k])
                    sleep.sleep('10');
                }
            }
        }catch(error){
            console.log('Invalid Date')
            let emails = receiverEmail.split(',');
            await sendErrorEmail(locationSelectionText, statusResponsetext, availbileTime, email[0], error)
        }
        

    try{
        let location = {
            "locationName": locationSelectionText,
            "category": categorySelectionText,
            "subCategory": subCategorySelectionText,
            "sourceCountry": "India",
            "destinationCountry": "Netherlands",
            "availbileDate":  dateString ,
            "availbilityRes": statusResponsetext,
            "locationCode": locationCode,
            "availbileTime":availbileTime,
            "availbileSlots":availbileSlots
        }
        console.log("Adding Record")
        let locationRecord = new LocationRecord(location);
        // console.log(locationRecord);
        let result = await locationRecord.save();
        console.log(result);
    } catch(error){
        console.log(error);
    }
}

module.exports = { saveRecord };

