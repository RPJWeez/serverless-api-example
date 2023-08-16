'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')

let options = {};

// if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
// }

const client = new DynamoDBClient(options);

module.exports = client;