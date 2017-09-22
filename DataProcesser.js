const Operation = require('./Operation.js');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');

class DataProcesser {
	constructor() {
		this.configFetched = false;
		this.config = {
			rates: null,
			cashIn: null,
			cashOutNatural: null,
			cashOutJuridical: null
		}

		this.fetchConfig();
	}

	processOperationsJSON(operationsJSON) {
		if(this.configFetched) {
			let operations = [];
			for(let operationObj of operationsJSON) {
				let { date, user_id, user_type, type, operation } = operationObj;
				let op = new Operation(date, user_id, user_type, type, operation);
				operations.push(op);
			}

		//	operations = _.groupBy(operations, function(op) {
		//	  return op.user_id;
		//	});

			this.processUserOperations(operations);
		} else {
			setTimeout(() => this.processOperationsJSON(operationsJSON), 250);
		}
	}

	processUserOperations(operations) {
		let commisions = 0;
		console.log(operations);
		for(let op of operations) {

			if(op.type === 'cash_in') {
				let commision = op.operation.amount * this.config.cashIn.percents * 0.01;
				if(commision > this.config.cashIn.max.amount) {
					console.log(this.config.cashIn.max.amount);
				} else {
					console.log(commision);
				}
			} else if(op.type === 'cash_out') {
				if(op.user_type === 'natural') {
					console.log('natural');

					


				} else if(op.user_type === 'juridical') {
					let commision = op.operation.amount * this.config.cashOutJuridical.percents * 0.01;
					if(commision < this.config.cashOutJuridical.min.amount) {
						console.log(this.config.cashOutJuridical.min.amount);
					} else {
						console.log(commision);
					}
				}
			}
		}
	}

	processNaturalUserOperations(operations) {
		let totalCashIn = 0;
		let totalCashOut = 0;
		let commisions = 0;
		console.log(operations);
		for(let operation of operations) {

			console.log(operation);

			if(operation.type === 'cash_in') {
				let commision = operation.amount * this.config.cashIn.percents * 0.01;
				if(commision > this.config.cashIn.max) {
					console.log(this.config.cashIn.max);
				} else {
					console.log(commission);
				}

			} else if(operation.type === 'cash_out') {
				totalCashOut += operation.operation.amount;
				console.log('aa');
			//	let testDate = moment("20150115", "YYYYMMDD");
			//	console.log('week :' + moment(testDate).week());
			}
		}
	}

	processJuridicalUserOperations(userId, userOperations) {
		let totalCashIn = 0;
		let totalCashOut = 0;
		for(let operation of userOperations) {
			totalCashIn += operation.operation.amount;

			if(operation.type === 'cash_in') {

			} if(operation.type === 'cash_out') {

			}
		}

		console.log('user_id' + userId + '. Cash in: ' + totalCashIn);
	}

	processUserOperation(userOperation) {
		if(userOperations.user_type === 'natural') {
			if(userOperation.type === 'cash_in') {



			} else if(userOperation.type === 'cash_out') {

			}
		} else if(userOperations.user_type === 'juridical') {
			if(userOperation.type === 'cash_in') {

			} else if(userOperation.type === 'cash_out') {

			}
		}
	}

	processSingleOperation(operation) {
		if(operation.type === 'cash_in') {
			console.log(this.processCashIn(operation));
		} else if(operation.type === 'cash_out') {
			console.log(this.processCashOut(operation));
		}
	}

	processCashIn(operation) {
		let commision = operation.operation.amount * this.config.cashIn.percents * 0.01;
		if(commision > this.config.cashIn.max.amount) {
			commision = this.config.cashIn.max.amount;
		}
		return commision;
	}

	processCashOut(operation) {
		if(operation.user_type === 'natural') {

		} else if(operation.user_type === 'juridical') {

		}
	}

	fetchConfig() {
		axios.all([
				axios.get('http://private-38e18c-uzduotis.apiary-mock.com/rates'),
				axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in'),
				axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural'),
				axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical')
		  ])
		  .then(axios.spread((rates, cashIn, cashOutNatural, cashOutJuridical) => {
		    this.config.rates = rates.data;
				this.config.cashIn = cashIn.data;
				this.config.cashOutNatural = cashOutNatural.data;
				this.config.cashOutJuridical = cashOutJuridical.data;

				this.configFetched = true;
		  })
		);
	}
}

module.exports = DataProcesser;
