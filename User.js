class User {
	constructor(user_id) {
		this.user_id = user_id;
		this.operations = [];
		this.totalCashOut = 0;
	}

	addOperation(operation) {
		this.operations.push(operation);
	}

	get operations() {
		return this.operations;
	}

	get totalCashOut() {
		return this.totalCashOut;
	}
}

module.exports = User;
