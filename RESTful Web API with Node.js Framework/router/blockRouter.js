const express = require('express');
const bodyParser = require('body-parser');
const bK = require('../simpleChain');       // used to import classes from simpleChain.js file

const blockRouter = express.Router();       // Express router is used to create different routes

blockRouter.use(bodyParser.json());

blockRouter.route('/')                      // post method
    .post((req, res, next) => {
        let block = new bK.Blockchain();       // block object is being created from Blockchain class
        block.addBlock(new bK.Block(req.body.body))
        .then((added) => {                          // promise is consumed when data is returned.
            res.statusCode = 200;                     // set staus to 200 which is OK.
            res.setHeader('Content-Type', 'application/json');
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
            res.send(block);
        }, (err) => next(err))
        .catch((err) => next(err));               
    });


module.exports = blockRouter;