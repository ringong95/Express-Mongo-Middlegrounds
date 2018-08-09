var assert = require('assert');
// const uploadToDB = require("./helper");

const stringFunctions = require('./lib/stringFunctions');
const exportedFunctions = require('./lib/exportFunctions')


const massFind = (contact, orders, users, res)=>{
  
  contact.aggregate([
    {
      $match: { $and: [{ dateToContact: { $gt: (Date.now() / 1000) } }, {contactedYet: false} ] }
    },
    {
      $lookup:
      {
        from: "kitorders",
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

  const users = db.collection('users');
  const products = db.collection('products');
  const orders = db.collection('kitorders');
  const contact = db.collection('contact');

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

  app.post("/updateContact", (req, res) => {
    console.log('loud and clear', req.body.data)
    var bulk = contact.initializeUnorderedBulkOp()
    JSON.parse(req.body.data).forEach((element)=>{
      bulk.find( { user_email:element.email } ).update({ $set: { contactedYet: true, contactedWhen:  Date.now()  }})
    })
    bulk.execute()
    .then((response, err) =>{
      console.log(response, err)
    })

    // Todo add a responses on success and failure for the app to know
  })


  app.post("/export", (req, res) => {
    

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

    if( /(Deluxe Kit)|(Emergency Kit)/g.test(parsedArray[17])){
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
      
      const  setUpemail  = setUpData.email

      const unixDate = parseInt((new Date(parsedArray[15]).getTime() / 1000).toFixed(0))
      console.log( setUpemail)
      if (!!setUpemail == true) {
        console.log(setUpemail)
        contact.updateOne({
          user_email: setUpemail,
          dateOfPurchase: unixDate,
        }, {
          "$set": 
            exportedFunctions.contactSet(setUpemail, unixDate)
        }, {
          upsert: true,
          safe: false
        }, (err, data) => {
          if (err) {
            console.log(err);
          }
        })
        
        users.updateOne({
          email: setUpemail
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
        user_email: setUpemail,
        date: unixDate
      }, {
        "$set": {
          user_email: setUpemail,
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
    }
  }) // /export route ends
  
}// routes end

module.exports = route;