var assert = require('assert');
const stringFunctions = require('./lib/stringFunctions');
const postExport = require('./lib/postExport');

const addOrderData = (collectedData, orders, users, products, res)=>{
  const newCollectedData = []
  
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms))
  
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  const start = async () => {
    await asyncForEach(collectedData, async (perOrder, index, array) => {
      orders.find({ user_email: perOrder.user_email }).toArray((err, data) => {
        if (err) {
          console.log(err)
        }
        if (data) {

          perOrder['product'] = data[0].product
          newCollectedData.push(perOrder)
        }
      })
      await waitFor(10)
    })
    const withUserData = addUserData(newCollectedData, users, products);
    return withUserData

  }
  start()
}

const addUserData = (collectedData, users, products, res) => {

  // It seems to stop being async here and instantly console log  
  const newCollectedData = []
console.log('does it reach?')
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }
  const start = async () => {
    await asyncForEach(collectedData, async (perUser, index, array) => {
      users.find({ email: perUser.user_email }).toArray((err, data) => {
        if (err) {
          console.log(err)
        }
        if (data) {
          console.log(data[0].name)
          perUser['name'] = data[0].name
          perUser['phone_number'] = data[0].phone_number
          perUser['accepts_marketing'] = data[0].accepts_marketing
          newCollectedData.push(perUser)
        }
      })
      await waitFor(10)
    })
    console.log('cube')    
    res.status(200).end();
    res.json({ data: newCollectedData });
    // addProductData(newCollectedData, products)
  }
  start()
}

// const addProductData = (collectedData, products) => {
//   const newCollectedData = []

//   const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

//   const asyncForEach = async (array, callback) => {
//     for (let index = 0; index < array.length; index++) {
//       await callback(array[index], index, array)
//     }
//   }
//   const start = async () => {
//     await asyncForEach(collectedData, async (perProduct, index, array) => {
//       products.find({ user_email: perUser.user_email }).toArray((err, data) => {
//         if (err) {
//           console.log(err)
//         }
//         if (data) {

//           perProduct['name'] = data[0].name
//           perProduct['phone_number'] = data[0].phone_number
//           perProduct['accepts_marketing'] = data[0].accepts_marketing

//           newCollectedData.push(perUser)
//         }
//       })
//       await waitFor(10)
//     })
//     return newCollectedData;

//   }
//   start()
// }

function route(app, db) {
  
  app.get("/", (req, res) => {
    res.status(200).end();
  });
  
  
  app.get('/fetchColdCallData', (req, res) =>{
    // Get the documents collection      
    const users = db.collection('users');
    const products = db.collection('products');
    const orders = db.collection('orders');
    const contact = db.collection('contact');
    
    contact.find( { dateToContact: { $gt: (Date.now()/1000) }  }).toArray( (err, data) => {
      if(err){
        console.log(err)
      }
      if(data){
        collectedData = data.map(( eachOrder )=>{
          delete eachOrder._id
          return eachOrder
        })
        const fullOrderData = addOrderData(collectedData, orders, users, products, res)
      }
    });
    
  })
  
  //All of this is in the file './lib/postExport.js'
  app.post("/export", (req, res) => {
    postExport.exportToDB(req, res, db)
  })
}

module.exports = route;