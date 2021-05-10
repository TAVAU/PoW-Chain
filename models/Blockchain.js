class Blockchain {
    constructor() {
        this.blocks = [];
    }
    addBlock(block) {
        this.blocks.push(block);
        console.log(this.blocks)
    }
    blockHeight() {
        return this.blocks.length;
    }
}

module.exports = Blockchain;
