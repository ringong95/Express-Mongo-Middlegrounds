var assert = require('assert');
const stringFunctions = require('./lib/stringFunctions');


const massFind = (contact, orders, users, res)=>{
  
  contact.aggregate([
    {
      $match: { $and: [{ dateToContact: { $gt: (Date.now() / 1000) } }] }
    },
    {
      $lookup:
      {
        from: "orders",
        localField: "dateOfPurchase",
        foreignField: "date",
        as: "order"
      }
    },
    {
      $unwind: "$order"
    },{
      $project: {
        "order.user_email": 0,
        "order.date": 0,
        "order._id": 0
      }
    },
    {
      $lookup:
      {
        from: "users",
        localField: "user_email",
        foreignField: "email",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
  ]).toArray(function (err, documents) {
    console.log(err,documents)
    res.json({ data: documents });
    
  })
}

function route(app, db) {
  
  app.get("/", (req, res) => {
    console.log('loud and clears')
    res.status(200).end();
  });
  
  
  app.get('/fetchColdCallData', (req, res) =>{
    console.log('test')
    // Get the documents collection      
    const users = db.collection('users');
    const products = db.collection('products');
    const orders = db.collection('orders');
    const contact = db.collection('contact');
    massFind(contact, orders, users, res)
  })
  let lastValidName
  let lastValidEmail
  let lastValidPhoneNumber
  let lastValidMarketing
  //All of this is in the file './lib/postExport.js'
  app.post("/export", (req, res) => {
    
    const fillUserGaps = () => {
      
    }
    const users = db.collection('users');
    const products = db.collection('products');
    const orders = db.collection('orders');
    const contact = db.collection('contact');
    // check if passed arry is JSON
    const parsedArray = stringFunctions.isJsonString(req.body.data, res)
    const email = parsedArray[1]
    const phone_number = parsedArray[33]
    const name = parsedArray[24]
    const accepts_marketing = parsedArray[6]

    let setUpData = {
      name: lastValidName,
      email: lastValidEmail,
      phone_number: lastValidPhoneNumber,
      accepts_marketing: lastValidMarketing
    }
    if (!!phone_number == true || name.match(/(retail)/gi)) {
       setUpData =  {
        email: email,
        phone_number: phone_number,
        name: name,
        accepts_marketing: accepts_marketing
      }
    }
    
    lastValidName = setUpData.name
    lastValidEmail = setUpData.email
    lastValidPhoneNumber = setUpData.phone_number
    lastValidMarketing = setUpData.accepts_marketing
    res.status(200).end()
    
    const unixDate = parseInt((new Date(parsedArray[15]).getTime() / 1000).toFixed(0))
    if (!!setUpData.email == true) {
      console.log(setUpData.email)
      contact.updateOne({
        user_email: setUpData.email,
        dateOfPurchase: unixDate,
      }, {
        "$set": {
          user_email: setUpData.email,
          dateOfPurchase: unixDate,
          dateToContact: (unixDate + Math.floor(5 * 365 * 24 * 60 * 60)),
          contactedYet: false,
          contactedWhen: null
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
        }
      })
    }
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
      }
    })
  })
}

module.exports = route;