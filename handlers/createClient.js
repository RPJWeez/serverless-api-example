const uuid = require('uuid');
const dynamodb = require('./dynamodb');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require("@aws-sdk/util-dynamodb");

module.exports.create = async (event, context, callback) => {
    const postBody = JSON.parse(event.body);

    const timestamp = new Date().getTime();
    const newClientId = uuid.v4();
    const newClient = {
        clientId: newClientId,
        objectKey: 'METADATA#' + newClientId,
        clientName: postBody.clientName,
        clientPhoneNumbers: postBody.clientPhoneNumbers,
        createdAt: timestamp,
        updatedAt: timestamp,
    }

    const putCommand = new PutItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Item: marshall(newClient) //aws v3 sdk forces you to use dynamoDB's god-awful syntax, so using util to convert it
    });

    try {
        await dynamodb.send(putCommand);
        const response = {
            statusCode: 201,
            headers: {
                'Location': '/clients/' + newClientId
            }
        };
        callback(null, response);
    } catch (error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 500,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Create failed',
        });
        return;
    }
};