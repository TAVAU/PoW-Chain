const Block = require('./models/Block');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const db = require('./db');
const {PUBLIC_KEY} = require('./config');
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;
const fs = require('fs');

let mining = true;
mine();

function startMining() {
  mining = true;
  mine();
}

function stopMining() {
  mining = false;
}

function mine() {
  if(!mining) return;
  const block = new Block();
  try {
    fs.readFile('a', 'utf8', (err, data) => {
      if (err) throw err;
      console.log('reading from file');
      cur_state = JSON.parse(data);
      const msg = `Mined block #${cur_state.block_number} with a hash of ${cur_state.hash} at nonce ${cur_state.nonce}`;
      console.log(msg);
    });
  } catch (err) {
    console.error(err)
  }

  // TODO: add transactions from the mempool

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  while(BigInt('0x' + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }

  block.execute();

  db.blockchain.addBlock(block);
  const msg = `Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${block.nonce}`;
  console.log(msg);

  const state = {
    block_number: db.blockchain.blockHeight(),
    hash: block.hash(),
    nonce: block.nonce,
  }

  fs.writeFile('mine_state', JSON.stringify(state), 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  setTimeout(mine, 2500);
}

module.exports = {
  startMining,
  stopMining,
};
