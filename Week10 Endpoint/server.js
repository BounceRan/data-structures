require('dotenv').config({ path: '../.env' });
var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
//var moment= require('moment');
var moment = require('moment-timezone');


// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'DanRan';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'danDB';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AK_IAM;
AWS.config.secretAccessKey = process.env.SAK_IAM;
// console.log(process.env.AK_IAM);
//  console.log(process.env.SAK_IAM);
// AWS.config.accessKeyId = process.env.RTAK;
// AWS.config.secretAccessKey = process.RTSK;
//AWS.config.accessKeyId = process.env.AK_JU;
//AWS.config.secretAccessKey = process.env.SK_JU;

AWS.config.region = "us-east-2";



// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query //derivedTable.sensorValue, 查看正负值
    var q = ` 
               
                SELECT  derivedTable.sensorTime
                FROM (
                    SELECT 
                        sensorValue, sensorTime,
                        LAG(sensorValue, 1, '0') OVER (ORDER BY sensorTime) AS pSensorValue,
                        LAG(sensorValue, 1, '0') OVER (ORDER BY sensorTime DESC) AS aSensorValue 
                    FROM sensorData
                ) AS derivedTable
                WHERE (sensorValue='1' AND pSensorValue='0') or (sensorValue='1' AND aSensorValue='0')
                union all  
                SELECT  derivedTable.sensorTime
                FROM (
                    SELECT 
                        sensorValue, sensorTime,
                        LAG(sensorValue, 1, '0') OVER (ORDER BY sensorTime) AS pSensorValue,
                        LAG(sensorValue, 1, '0') OVER (ORDER BY sensorTime DESC) AS aSensorValue 
                    FROM sensorData
                ) AS derivedTable
                WHERE (sensorValue='1' AND pSensorValue='0' AND aSensorValue='0')
                ORDER by sensorTime;
                `;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

var todayAA=moment().tz("America/New_York").format('dddd');//.utcOffset(5);//.format('dddd');//.day();
console.log(todayAA);

 //WHERE mtday = '${todayAA}' AND mtzone = 3

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query   
    var thisQuery = `SELECT address as mtgaddress,mtspin, mtlocation as location,wheelchair,
                    json_agg(json_build_object('day', mtday, 'timeStart', mtstart)) as meetings,
                    lat,lng
                
                 FROM aainfoAll 
                
                 WHERE mtday = 'Tuesday' AND mtzone = 3
                 GROUP BY mtgaddress, location, mtspin, lat,lng,wheelchair
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName: "SketchTherapy",
        KeyConditionExpression: "#tp = :typeOfS", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#tp": "typeOfSketch"
        },
        ExpressionAttributeValues: { // the query values
            ":typeOfS": { "S": "pencil"}
            // ":typeOfS": { "S": "pen"}
                
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});