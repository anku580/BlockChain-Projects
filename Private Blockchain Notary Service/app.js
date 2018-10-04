const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const level = require('level');
const chainDB = './address';
const db1 = level(chainDB);
var Message = require('bitcore-message');

//blockRouter contains the get and Post method in seperate file
const blockRouter = require('./router/blockRouter');
const starRouter = require('./router/starRouter');
app.use(bodyParser.json());



let addressValidated = [];

app.post('/requestValidation', (req, res, next) => {

    validationRequest = true;
    db1.get(req.body.address, (err, value) => {

        if (err) {

            let validationAddress = req.body.address;
            let creationTime = new Date().getTime().toString().slice(0, -3);
            let messageToBeSigned = validationAddress + ":" + creationTime + ":starRegistry";

            requestBlock = {
                "address": validationAddress,
                "requestTimeStamp": creationTime,
                "message": messageToBeSigned,
                "validationWindow": 300
            }
            db1.put(validationAddress, JSON.stringify(requestBlock));
            res.statusCode = 200;                     // set staus to 200 which is OK.
            res.setHeader('Content-Type', 'application/json');
            res.json(requestBlock);
        }
        else {
            let validationBlock = JSON.parse(value);
            let currTime = new Date().getTime().toString().slice(0, -3);
            let validationTime = (currTime - validationBlock.requestTimeStamp);
            validationBlock.validationWindow = 300 - validationTime;

            if(validationBlock.validationWindow < 0) {
                db1.del(req.body.address);
                let err1 = new Error("Validation window Expired");
                return next(err1);
            }
            console.log(validationBlock.validationWindow);
            res.statusCode = 200;                     // set staus to 200 which is OK.
            res.setHeader('Content-Type', 'application/json');
            res.send(validationBlock);
        }
    })

})


app.post('/message-signature/validate', (req, res, next) => {

    let validateAddress = req.body.address;
    let signatureValue = req.body.signature;

    let verified;
    db1.get(req.body.address, (err, value1) => {

        let currTime = new Date().getTime().toString().slice(0, -3);
        let value = JSON.parse(value1);

        verified = new Message(value.message).verify(validateAddress, signatureValue);

        let validationTime = (currTime - value.requestTimeStamp);
        let registerStar = false;
        let messageSignature = false;

        console.log("validated:" + verified);
        console.log(validationTime);
        if (validationTime <= 300 && verified) {

            registerStar = true;
            messageSignature = true;

            let output1;
            let output2;

            output2 = {
                "address": value.address,
                "requestTimeStamp": value.requestTimeStamp,
                "message": value.message,
                "validationWindow": 300 - validationTime,
                "messageSignature": messageSignature
            }

            output1 = {
                "registerStar": registerStar,
                "status": output2
            }

            res.json(output1);
            messageRequest = true;
            addressValidated.push(req.body.address);
        }
        else {
            res.json("Message is not verified");
        }
    })
})


// When user request /block path it will go to blockRouter
app.use('/block', blockRouter);
app.use('/stars', starRouter);

//Server will listen to 8000 port Number
app.listen(8000, () => console.log('Example app listening on port 8000!'))

exports.db1 = db1;
exports.addressValidated = addressValidated;

