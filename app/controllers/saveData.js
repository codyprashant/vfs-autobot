const mongoDB = require("mongodb");
const mongoClient = mongoDB.MongoClient;
const objId = mongoDB.ObjectId;
const dbUrl = process.env.DB_URL;
const LocationRecord = require('../models/locationRecord')

const saveRecord = async (locationSelectionText, categorySelectionText, subCategorySelectionText,
     statusResponsetext, dateString, locationCode, availbileTime, availbileSlots) => {
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
        console.log(locationRecord);
        let result = await locationRecord.save();
        console.log(result);
    } catch(error){
        console.log(error);
    }
}

module.exports = { saveRecord };

