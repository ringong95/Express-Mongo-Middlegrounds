const app = require('./app')

 // Server
 const port = 3001;

 app.server = app.listen(port);
 console.log(`listening on port ${port}`);