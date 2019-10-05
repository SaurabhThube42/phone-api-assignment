const AWS=require('aws-sdk');

AWS.config.update({region:'ap-south-1'});

const dynamodb=new AWS.DynamoDB();

var params = {
    TableName : "Person",
    KeySchema: [       
        { AttributeName: "uniformIdentifier", KeyType: "HASH"} //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "uniformIdentifier", AttributeType: "S" },
        { AttributeName: "phonenumber", AttributeType: "N" }
    ],
    GlobalSecondaryIndexes: [ 
        { 
            IndexName: 'phone_index', 
            KeySchema: [
                {
                    AttributeName: 'phonenumber',
                    KeyType: 'HASH',
                }
            ],
            Projection:{
                ProjectionType:'ALL'
            },
            ProvisionedThroughput:{
                ReadCapacityUnits: 10, 
                WriteCapacityUnits: 10
            }
        }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};


dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});