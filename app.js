require('babel-register');

const fs = require("fs");
const content = fs.readFileSync("input.json");
const DataProcesser = require('./DataProcesser.js');

const operationsJSON = JSON.parse(content);

let rates;
let cashIn;
let cashOut;
let cashOutJuridical;

let dp = new DataProcesser();

dp.processOperationsJSON(operationsJSON);
