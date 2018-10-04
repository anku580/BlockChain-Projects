const express = require('express');
const bodyParser = require('body-parser');
const bK = require('../simpleChain');       // used to import classes from simpleChain.js file
const myModule = require('../app.js');
const starRouter = express.Router();       // Express router is used to create different routes

starRouter.use(bodyParser.json());

starRouter.route('/address:starId')
    .get((req, res, next) => {

        let blockchain = new bK.Blockchain();
        //console.log(req.params.starId);
        let string = req.params.starId;
        let cutString = string.slice(1);
        blockchain.getStars(cutString).then((starBlocks) => {
            res.send(starBlocks);
        })
            .catch((err) => {
                res.json(err);
            })
    })

starRouter.route('/hash:blockId')
    .get((req, res, next) => {

        let blockchain = new bK.Blockchain();
        let string = req.params.blockId;
        let cutString = string.slice(1);

        let db1 = myModule.db1;
        db1.get(cutString)
            .then((output) => {
                output = JSON.parse(output);
                let encodedValue = output.body.star.story;
                //console.log(star1.body.star.story);
                let decodedValue = Buffer(encodedValue, 'hex').toString();
                //console.log(decodedValue);
                output.body.star.storyDecoded = decodedValue;
                //console.log("Output: " + output);
                res.json(output);
            })
    })


module.exports = starRouter;