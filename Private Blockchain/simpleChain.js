/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
  constructor(data) {
    this.hash = "",
      this.height = 0,
      this.body = data,
      this.time = 0,
      this.previousBlockHash = ""
  }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {

  constructor() {
    let self = this;
    this.chainLength = 0;
    //it will only create one genesis block once in the blockchain
    countBlocks()
      .then((blockcount) => {
        if (blockcount == 0) {
          //calls the addBlock function to add genesis block
          self.addBlock(new Block("First block in the chain - Genesis block"));
        }
      })
      .catch((err) => {
        return err;
      });
  }

  // Add new block
  addBlock(newBlock) {
    // promise consumed to get all the blocks i.e No. of blocks in blockchain
    countBlocks()
      .then((blockcount) => {
        this.chainLength = blockcount;
        //updates the height of new Block
        newBlock.height = this.chainLength;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (this.chainLength > 0) {
          // getting previous block and acessing it's hash value
          getLevelDBData(this.chainLength - 1)
            .then((resp) => {
              let pblock = JSON.parse(resp);
              newBlock.previousBlockHash = pblock.hash;
              // Block hash with SHA256 using newBlock and converting to a string
              newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
              //Adding newBlock object in the LevelDB
              addDataToLevelDB(JSON.stringify(newBlock));
            })
            .catch((err) => {
              return err;
            })
        }
        if (this.chainLength == 0) {
          // Block hash with SHA256 using newBlock and converting to a string
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          //Adding newBlock object in the LevelDB
          addDataToLevelDB(JSON.stringify(newBlock));
        }
      })
      .catch((err) => {
        return err;
      });
  }

  // Get block height
  getBlockHeight() {
    countBlocks()
      .then((resp) => {
        console.log(resp - 1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // get block
  getBlock(blockHeight) {
    // return object as a single string
    getLevelDBData(blockHeight)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // validate block
  validateBlock(blockHeight) {
    // get block object
    return new Promise((resolve, reject) => {
      getLevelDBData(blockHeight)
        .then((resp) => {
          let block = JSON.parse(resp);
          // get block hash
          let blockHash = block.hash;
          // remove block hash to test block integrity
          block.hash = '';
          // generate block hash
          let validBlockHash = SHA256(JSON.stringify(block)).toString();
          // Compare
          if (blockHash === validBlockHash) {
            resolve(true);
          }
          else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            resolve(false);
          }

        })
        .catch((err) => {
          return err;
        })
    })
  }

  // Validate blockchain
  validateChain() {
    let self = this;
    let errorLog = [];
    countBlocks()
      //promise that fetches no. of blocks till now present in blockchain
      .then((resp) => {
        let i = 0;
        //This is a loop which tranverse the whole blockchain and verifies all the blocks one by one
        let interval = setInterval(function () {
          // promise is consumed so that it will return true or false depending upon the situation
          self.validateBlock(i)
            .then((resp) => {
              //console.log(resp);
              if (!resp) errorLog.push(i);
            })
          // used this condition in order to stop the loop exceeding from the index present in database 
          if (i < resp - 1) {
            //fetches i block
            getLevelDBData(i)
              .then((data1) => {
                let block1 = JSON.parse(data1);
                //fetches i+1 block
                getLevelDBData(i)
                  .then((data2) => {
                    let block2 = JSON.parse(data2);
                    let blockHash = block1.hash;
                    let previousHash = block2.previousBlockHash;
                    if (blockHash !== previousHash) {
                      errorLog.push(i);
                    }
                  })
                  .catch((err) => {
                    return err;
                  })
              })
              .catch((err) => {
                return err;
              })
          }
          // loop will go on till (size of blocks - 1)
          if (i >= resp - 1) {
            clearInterval(interval);
          }
          i++;
        }, 200);

        // return the promise after all the errors have been detected if present
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(errorLog), 200 * (resp + 1));
        })
      })
      .then((errorLog) => {
        if (errorLog.length > 0) {
          console.log('Block errors = ' + errorLog.length);
          console.log('Blocks: ' + errorLog);
        } else {
          console.log('No errors detected');
        }
      })
      .catch((err) => {
        return err;
      });
  }
}


/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

addLevelDBData = (key, value) => {
  db.put(key, value, function (err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
getLevelDBData = (key) => {
  return new Promise((resolve, reject) => {
    db.get(key, function (err, value) {
      if (err) reject(err);
      resolve(value);
    })
  })
}

//It will give the count of the blocks present in blockchain
countBlocks = () => {
  return new Promise((resolve, reject) => {
    let count = 0;
    db.createReadStream()
      .on('data', (data) => {
        count++;
      })
      .on('error', (err) => {
        console.log(err);
      })
      .on('close', () => {
        resolve(count);
      })
  })
}

// Add data to levelDB with value
addDataToLevelDB = (value) => {
  let self = this;
  let i = 0;
  db.createReadStream().on('data', function (data) {
    i++;
  }).on('error', function (err) {
    return console.log('Unable to read data stream!', err)
  }).on('close', function () {
    console.log('Block #' + i);
    addLevelDBData(i, value);
  });
}


let blockchain = new Blockchain();
let i = 1,
  blocksToAdd = 5,
  delay = 200;

// let interval = setInterval(function () {
//   blockchain.addBlock(new Block("Test"));
//   i++;

//   if (i >= blocksToAdd) {
//     clearInterval(interval);
//   }
// }, delay);


//blockchain.validateChain();

