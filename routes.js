function route(app) {

  app.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
    // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
    // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
  });

  // For all get requests to *oururl*.com/export    
  let lastValidName
  let lastValidEmail
  let lastValidPhoneNumber
  let lastValidMarketing

  app.post("/export", (req, res) => {
    // Get the documents collection      
    const users = db.collection('users');

    const parsedArray = JSON.parse(req.body.data)
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

    // Update document where a is 2, set b equal to 1
    console.log(name);
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