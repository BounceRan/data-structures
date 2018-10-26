


var diaryEntries = [];

require('dotenv').config({ path: '../.env' });
var async = require('async');

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
// AWS.config.accessKeyId = process.env.AK_IAM;
// AWS.config.secretAccessKey = process.env.SAK_IAM;
AWS.config.accessKeyId = process.env.RTAK ;
AWS.config.secretAccessKey = process.RTSK;

AWS.config.region = "us-east-2";





class DiaryEntry {
    
   
    
    
  constructor(primaryKey, dt, sketch, noteOfSketch) {
    //auto date
    //let date = new Date(Date.now());
   // let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   // let options = { year: 'numeric', month: 'long', day: 'numeric' };
   //this.date.S = date.toLocaleDateString( 'en-US',options).toString();
    this.typeOfSketch = {};
    this.typeOfSketch.S = primaryKey.toString();
    this.dt = {}; 
    
    this.dt.N = new Date(dt).valueOf().toString();
    
    this.date= {};
     this.date.S = new Date(dt).toDateString();
    
    if (sketch != null) {
     this.sketch = {};
     this.sketch.SS = sketch; 
    }
    if (noteOfSketch != null){
      this.noteOfSketch={};
      this.noteOfSketch.SS= noteOfSketch;
      
    }
   // this.month = {};
    ////	Get the month as a number (0-11)
   // this.month.N = new Date().getMonth().toString();
  }
}

diaryEntries.push(new DiaryEntry("pencil", 'October 14, 2018', ["https://github.com/BounceRan/SketchTherapy/blob/master/Sketch/Oct_14_2018.jpg"],["figure study"]));
diaryEntries.push(new DiaryEntry("pencil", 'October 18, 2018', ["https://github.com/BounceRan/SketchTherapy/blob/master/Sketch/Oct_18_2018.jpg","https://github.com/BounceRan/SketchTherapy/blob/master/Sketch/Oct_18_2018_2.jpg"],["Storyboard Study","Storyboard Study 2"]));
//diaryEntries.push(new DiaryEntry("pen", 'October 20, 2018', ["https://github.com/BounceRan/SketchTherapy/blob/master/Sketch/Oct_20_2018.jpg"],["trees"]));

//diaryEntries.push(new DiaryEntry(2, "Third Sketh", ["testingURL","testingURL2","testingURL4"]));

console.log(diaryEntries[0].typeOfSketch.S);

//console.log(process.env.SAK_IAM)

 var dynamodb = new AWS.DynamoDB();

// var params = {};
// params.Item = diaryEntries[0]; 
// params.TableName = "SketchTherapy";

// dynamodb.putItem(params, function (err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });


//loop and insert each of item.

async.eachSeries(diaryEntries, function(value, callback) {
  
  var params = {};
params.Item = value; 
params.TableName = "SketchTherapy";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
   
  console.log('insert'+ value.typeOfSketch.S)
    setTimeout(callback, 1000); 
}); 