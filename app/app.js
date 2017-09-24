require('babel-register');
const fs = require('fs');
const DataProcesser = require('./DataProcesser.js');

const content = fs.readFileSync('./data/input.json');

const operationsJSON = JSON.parse(content);

const dp = new DataProcesser();

dp.processOperationsJSON(operationsJSON, (comissions) => {
  comissions.forEach((comission) => {
    console.log(comission);
  });
});
