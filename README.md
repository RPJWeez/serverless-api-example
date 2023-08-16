# Sample REST API using the serverless framework
A simple REST api using the serverless framework and a dynamodb table.

Uses the serverless-offline and serverless-dynamodb plugins to be able to run locally without actually pushing to an AWS account.

## Resources
POST /clients
```
{
    "clientName": "NAME123",
    "clientPhoneNumbers": [
        {
            "type": "mobile",
            "number": "8009998888"
        }
    ]
}
```

GET /clients/{clientId}

## Running locally
### Setup
```
npm install
serverless dynamodb install
serverless offline start
```
### After initial setup
```
serverless offline start
```

## Notes
* There are lots of examples of how to do this on the internet, I think mine is (or will be) unique because
  * it uses the NodeJS AWS SDK V3 library, most examples online use V2
  * As this app evolves, I intend to create a good example of a 'denormalized' relational model using a single dynamodb table
  * As this app evolves, I intend it be be a good example of an enterprise grade service with all the appropriate IAM entitlements, testing, setup for local/dev and AWS/staging/prod deploys, etc.

* the serverless-offline plugin seems to ignore all IAM configurations and allows any function to do whatever it wants (EG: all operations on the dynamodb table are allowed regardless of how you configure the role).  If I'm doing it wrong, feel free to do a pull request to fix it.