const Operation = require('./Operation.js');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const fx = require('money');
const helpers = require('./helpers/helpers');

class DataProcesser {
  constructor() {
    this.configFetched = false;
    this.config = {
      rates: null,
      cashIn: null,
      cashOutNatural: null,
      cashOutJuridical: null,
    };
    this.fx = fx;
    this.comissions = [];

    this.fetchConfig();
  }

  getcomissions() {
    return this.comissions;
  }

  processOperationsJSON(operationsJSON, callback) {
    if (this.configFetched) {
      const operations = [];
      operationsJSON.forEach((operationObj) => {
        const { date, user_id, user_type, type, operation } = operationObj;
        const op = new Operation(date, user_id, user_type, type, operation);
        operations.push(op);
      });
      const comissions = this.processUserOperations(operations);
      this.comissions = comissions;
      if (callback && typeof (callback) === 'function') {
        callback(comissions);
      }
    } else {
      setTimeout(() => this.processOperationsJSON(operationsJSON, callback), 250);
    }
  }

  processUserOperations(operations) {
    let opCount = 0;
    const comissions = [];
    operations.forEach((op) => {
      if (op.type === 'cash_in') {
        const comission = op.operation.amount * this.config.cashIn.percents * 0.01;
        if (this.fx(comission).from(op.operation.currency)
          .to(this.config.cashIn.max.currency) > this.config.cashIn.max.amount) {
          comissions.push(this.config.cashIn.max.amount.toFixed(2));
        } else {
          comissions.push(comission.toFixed(2));
        }
      } else if (op.type === 'cash_out') {
        if (op.user_type === 'natural') {
          const oDate = moment(op.date).format('YYYY-MM-DD');
          const firstWeekDay = moment(op.date).startOf('isoweek')
            .format('YYYY-MM-DD');
          const totalThatWeek = operations.reduce((sum, o, index) => {
            if ((moment(o.date).isBetween(firstWeekDay, oDate)
              || moment(o.date).isSame(firstWeekDay)
              || moment(o.date).isSame(oDate))
              && o.user_id === op.user_id
              && o.type === op.type
              && index < opCount) {
              return sum + this.fx(o.operation.amount)
                .from(o.operation.currency)
                .to(op.operation.currency);
            }
            return sum;
          }, 0);

          const weekLimit = this.fx(this.config.cashOutNatural.week_limit.amount)
            .from(this.config.cashOutNatural.week_limit.currency)
            .to(op.operation.currency);
          let comission = 0;
          if (totalThatWeek + op.operation.amount > weekLimit) {
            let payableSum = op.operation.amount - weekLimit;
            if (totalThatWeek >= weekLimit) {
              payableSum = op.operation.amount;
            } else if (payableSum <= 0) {
              payableSum = (totalThatWeek + op.operation.amount) - weekLimit;
            }
            comission = payableSum * this.config.cashOutNatural.percents * 0.01;
            comissions.push(helpers.roundUp(comission, 10).toFixed(2));
          } else {
            comissions.push(comission.toFixed(2));
          }
        } else if (op.user_type === 'juridical') {
          const comission = op.operation.amount * this.config.cashOutJuridical.percents * 0.01;
          if (this.fx(comission).from(op.operation.currency)
            .to(this.config.cashOutJuridical.min.currency)
              < this.config.cashOutJuridical.min.amount) {
            comissions.push(this.config.cashOutJuridical.min.amount);
          } else {
            comissions.push(comission.toFixed(2));
          }
        }
      }
      opCount += 1;
    });

    return comissions;
  }

  fetchConfig() {
    axios.all([
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/rates'),
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in'),
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural'),
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical'),
    ])
      .then(axios.spread((rates, cashIn, cashOutNatural, cashOutJuridical) => {
        this.config.rates = rates.data;
        this.config.cashIn = cashIn.data;
        this.config.cashOutNatural = cashOutNatural.data;
        this.config.cashOutJuridical = cashOutJuridical.data;

        Object.keys(rates.data.EUR).forEach((key) => {
          this.fx.rates[key] = rates.data.EUR[key];
        });
        this.fx.rates.EUR = 1;
        this.fx.base = 'EUR';

        this.configFetched = true;
      }));
  }
}

module.exports = DataProcesser;
