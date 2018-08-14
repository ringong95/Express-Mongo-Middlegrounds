const app = require('./app')
require('dotenv').load();

 // Server
 const port = 3001;

 app.server = app.listen(port);
 console.log(`listening on port ${port}`);