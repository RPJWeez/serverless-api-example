const dynamodb = require('./dynamodb');
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

module.exports.get = async (event, context, callback) => {
    const clientId = event.pathParameters.id;

    if (!clientId) {
        callback(null, {
            statusCode: 400,
            headers: { 'Content-Type': 'text/plain' },
            body: 'No client ID provided',
        });
        return;
    }

    const getCommand = new GetItemCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: marshall({
            clientId: clientId,
            objectKey: 'METADATA#' + clientId
        })
    });

    try {
        const result = await dynamodb.send(getCommand);
        let response = {
            statusCode: 404
        }
        if (result && result.Item) {
            const responseBody = unmarshall(result.Item); //aws v3 sdk uses dynamoDB's god-awful syntax, so using util to convert it
            delete responseBody.objectKey; //sort key is a system detail the client does not need to know about

            response = {
                statusCode: 201,
                body: JSON.stringify(responseBody) //for AWS API gateway, it expects the response in a JSON-formatted string for some reason
            };
        }
        callback(null, response);
    } catch (error) {
        console.error(error);
        callback(null, {
            statusCode: error.statusCode || 500
        });
        return;
    }
};