const express = require('express');
const bodyParser = require('body-parser');
const bK = require('../simpleChain');       // used to import classes from simpleChain.js file
const myModule = require('../app.js');
const blockRouter = express.Router();       // Express router is used to create different routes

blockRouter.use(bodyParser.json());

blockRouter.route('/')                      // post method
    .post((req, res, next) => {

        // to check if user has provided wallet address or not
        if(!req.body.address) {
            throw new Error("There is no address");
        }
        
        // Restrict a user to register a star one at a time
        let addressInd = myModule.addressValidated.indexOf(req.body.address);
        if( addressInd == -1) {

            throw new Error("This address is not validated");
        }

        let block = new bK.Blockchain();       // block object is being created from Blockchain class
        let info = req.body;

        let starHexCode = Buffer(info.star.story).toString('hex');

        info.star.story = starHexCode;

        console.log(info);
        block.addBlock(new bK.Block(info))
            .then((added) => {
                added = JSON.parse(added);
                //console.log(added.hash); 
                //console.log("value:" + db1);
                let db1 = myModule.db1;
                db1.put(added.hash, JSON.stringify(added));                   // promise is consumed when data is returned.
                res.statusCode = 200;                     // set staus to 200 which is OK.
                res.setHeader('Content-Type', 'application/json');
                myModule.addressValidated.splice(addressInd, 1);
                res.send(added);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

blockRouter.route('/:blockHeight')
    .get((req, res, next) => {
        let block = new bK.Blockchain();
        block.getBlock(req.params.blockHeight)
            .then((block) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                block = JSON.parse(block);
                let encodedValue = block.body.star.story;
                //console.log(star1.body.star.story);
                let decodedValue = Buffer(encodedValue, 'hex').toString();
                //console.log(decodedValue);
                block.body.star.storyDecoded = decodedValue;
                //console.log("Output: " + output);
                res.send(block);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = blockRouter;