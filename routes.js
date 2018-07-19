function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log('not json')
    return false;
  }
    console.log('is json')
  
  return JSON.parse(str);
}

function route(app, db) {

  app.get("/", (req, res) => {
    res.status(200).send('some text');
    console.log('test')
  });
  
  // These variables allow me to keep valid data that the last input had
  let lastValidName
  let lastValidEmail
  let lastValidPhoneNumber
  let lastValidMarketing

  app.post("/export", (req, res) => {

    // Get the documents collection      
    const users = db.collection('users');

    // check if passed arry is JSON
    console.log(req.body.data);
    const parsedArray = IsJsonString(req.body.data)
  
    if (!parsedArray) {
      console.log(!!parsedArray)
      res.status(418).send({});
    }
    

    let email = parsedArray[1]
    let phone_number = parsedArray[43]
    let name = parsedArray[24]
    let accepts_marketing = parsedArray[6]
    if (!phone_number && !name) {
      console.log('entered')
      if (name == 'retail' || 'Shopify retail' || '') return
      console.log('see once')
      email = lastValidEmail
      phone_number = lastValidPhoneNumber
      name = lastValidName
      accepts_marketing = lastValidMarketing
    }
    console.log(name);

    res.status(200).send({
      users: {
        email,
        phone_number,
        name,
        accepts_marketing
      }
    });


    
    users.updateOne({
      email
    }, {
      $set: {
        email,
        phone_number,
        name,
        accepts_marketing
      }
    }, {
      upsert: true,
      safe: false
    }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("upload succeded");
      }
    });

  });
}

module.exports = route;