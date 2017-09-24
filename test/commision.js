const expect = require('chai').expect;
const DataProcesser = require('../app/DataProcesser.js');

const operationsJSONEUR = `[
{ "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type":
"cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
{ "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type":
"cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
{ "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 30000, "currency": "EUR" } },
{ "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
{ "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
{ "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
{ "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type":
"cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
{ "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
{ "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 300.00, "currency": "EUR" } }
]`;

const operationsJSONCurrencies = `[
{ "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type":
"cash_in", "operation": { "amount": 200.00, "currency": "EUR" } },
{ "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type":
"cash_out", "operation": { "amount": 300.00, "currency": "EUR" } },
{ "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 30000, "currency": "JPY" } },
{ "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
{ "date": "2016-01-07", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 100.00, "currency": "USD" } },
{ "date": "2016-01-10", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 100.00, "currency": "EUR" } },
{ "date": "2016-01-10", "user_id": 2, "user_type": "juridical", "type":
"cash_in", "operation": { "amount": 1000000.00, "currency": "EUR" } },
{ "date": "2016-01-10", "user_id": 3, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 1000.00, "currency": "EUR" } },
{ "date": "2016-02-15", "user_id": 1, "user_type": "natural", "type":
"cash_out", "operation": { "amount": 300.00, "currency": "EUR" } }
]`;

describe('DataProcesser', () => {
  const dp = new DataProcesser();

  it('should be able to handle EUR operation processing', (done) => {
    const operationsJSON = JSON.parse(operationsJSONEUR);
    dp.processOperationsJSON(operationsJSON, (comissions) => {
      expect(comissions).to.deep.equal([
        '0.06', '0.90', '87.00', '3.00', '0.30', '0.30', '5.00', '0.00', '0.00',
      ]);
      done();
    });
  });

  it('should be able to handle different currency operation processing', (done) => {
    const operationsJSON = JSON.parse(operationsJSONCurrencies);
    dp.processOperationsJSON(operationsJSON, (comissions) => {
      expect(comissions).to.deep.equal([
        '0.06', '0.90', '0.00', '0.70', '0.30', '0.30', '5.00', '0.00', '0.00',
      ]);
      done();
    });
  });
});
