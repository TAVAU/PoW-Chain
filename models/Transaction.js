const { utxos } = require('../db');

class Transaction {
	constructor(inputs, outputs) {
		this.inputs = inputs;
		this.outputs = outputs;
	}
	execute() {
		const anySpent = this.inputs.some((x) => x.spent);
		if (anySpent) {
			throw new Error("Cannot include a spent UTXO");
		}

		// const inputAmount = this.inputs.reduce((p, c) => {
		// 	return p + c.amount;
		// }, 0);
		// const outputAmount = this.outputs.reduce((p, c) => {
		// 	return p + c.amount;
		// }, 0);
		// if (inputAmount < outputAmount) {
		// 	throw new Error("Not enough here");
		// }

		this.inputs.forEach((input) => {
			input.spend();
		});
		this.outputs.forEach((output) => {
			utxos.push(output);
		});

		// this.fee = (inputAmount - outputAmount);
	}
}

module.exports = Transaction;
