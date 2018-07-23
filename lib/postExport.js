const stringFunctions = require('./stringFunctions');
var assert = require('assert');

module.exports = {
  exportToDB: function (req, res, db){
    // These variables allow me to keep valid data that the last input had
    let lastValidName
    let lastValidEmail
    let lastValidPhoneNumber
    let lastValidMarketing
    
    function fillUserGaps(parsedArray) {
      const email = parsedArray[1]
      const phone_number = parsedArray[33]
      const name = parsedArray[24]
      const accepts_marketing = parsedArray[6]
      if (!!phone_number == true || name.match(/(retail)/gi)) {
        return {
          email,
          phone_number,
          name,
          accepts_marketing
        }
      }
      return {
        name: lastValidName,
        email: lastValidEmail,
        phone_number: lastValidPhoneNumber,
        accepts_marketing: lastValidMarketing
      }
    }
    const users = db.collection('users');
    const products = db.collection('products');
    const orders = db.collection('orders');
    const contact = db.collection('contact');
    // check if passed arry is JSON
    const parsedArray = stringFunctions.isJsonString(req.body.data, res)
    
    const setUpData = fillUserGaps(parsedArray);
    lastValidName = setUpData.name
    lastValidEmail = setUpData.email
    lastValidPhoneNumber = setUpData.phone_number
    lastValidMarketing = setUpData.accepts_marketing
    
    res.status(200).end()
    
    const unixDate = parseInt((new Date(parsedArray[15]).getTime() / 1000).toFixed(0))
    contact.find({
      user_email: {
        $eq: setUpData.email
      },
      unixDate: {
        $lt: unixDate
      }
    }).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
    });
    
    contact.updateOne({
      user_email: setUpData.email,
      dateOfPurchase: unixDate,
    }, {
      "$set": {
        user_email: setUpData.email,
        dateOfPurchase: unixDate,
        dateToContact: (unixDate + Math.floor(5 * 365 * 24 * 60 * 60))
        
      }
    }, {
      upsert: true,
      safe: false
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("upload succeded");
      }
    })
    orders.updateOne({
      user_email: setUpData.email,
      date: unixDate
    }, {
      "$set": {
        user_email: setUpData.email,
        date: unixDate
      },
      $push: {
        product: {
          quantity: parsedArray[16],
          name: parsedArray[17],
          sku: parsedArray[20],
        },
      }
    }, {
      upsert: true,
      safe: false
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("upload succeded");
      }
    })
    
    products.updateOne({
      sku: parsedArray[20]
    }, {
      $set: {
        sku: parsedArray[20],
        experation: null,
        active: null,
        url_to_product: stringFunctions.nameToUrl(parsedArray[17]), // using name of product remove spaces and specail characters and add dashes
        name: parsedArray[17]
      }
    }, {
      upsert: true,
      safe: false
    }, (err, data) => {
      if (err) {
        console.log(err);
      }
    })
    users.updateOne({
      email: setUpData.email
    }, {
      $set: setUpData
    }, {
      upsert: true,
      safe: false
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("upload succeded");/
      }
    })
  }
}