const express = require('express')
const app = express()
var bodyParser = require('body-parser');

//blockRouter contains the get and Post method in seperate file
const blockRouter = require('./router/blockRouter');
app.use(bodyParser.json());

// When user request /block path it will go to blockRouter
app.use('/block', blockRouter);

//Server will listen to 8000 port Number
app.listen(8000, () => console.log('Example app listening on port 8000!'))