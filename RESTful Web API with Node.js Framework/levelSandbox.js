/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

exports.addLevelDBData = (key, value) => {
  db.put(key, value, function (err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
  })
}

// Get data from levelDB with key
exports.getLevelDBData = (key) => {
  return new Promise((resolve, reject) => {
    db.get(key, function (err, value) {
      if (err) reject(err);
      resolve(value);
    })
  })
}

//It will give the count of the blocks present in blockchain
exports.countBlocks = () => {
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
exports.addDataToLevelDB = (value) => {
  let self = this;
  let i = 0;
  db.createReadStream().on('data', function (data) {
    i++;
  }).on('error', function (err) {
    return console.log('Unable to read data stream!', err)
  }).on('close', function () {
    console.log('Block #' + i);
    self.addLevelDBData(i, value);
  });
}
