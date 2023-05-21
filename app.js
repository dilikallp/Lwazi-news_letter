const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https")

const app = express();
app.use(express.static("public"));// this will help our server serve up static files in our computer to be activated on the browsr 
//in this case my css files and any locally located image files etc. 
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
//this will insure that when people get to our page they get signUp html page
   res.sendFile(__dirname + "/signUp.html");
   //here we just saying our response is to send this file upon request on this directry name 
   //So now when we request the home route from our server, then it should deliver the file at that directory 

});
app.post("/", function(req, res){
const firstName = req.body.fName
const lastName = req.body.lName
const email = req.body.eName
console.log(firstName, lastName,email);
let data = {
   members: [ //this structure comes from mailchimps documentation on audience/list
      {
       email_address: email,
       status: "subscribed",
       merge_fields: { // to know filds names you need to log in to mailchimps go to audience settings and audience fields & mergers
          FNAME: firstName,
          LNAME: lastName,
       }
      }
   ]
}
let jsonData = JSON.stringify(data); // this will just convert the data javacrip object in a flat JSON object
const url = " https://us8.api.mailchimp.com/3.0/lists/029aa52cce" //the us8 comes from the end of my api key
   const options = {
      method: "POST",
      auth: "dilikallp:n00b7c0fe4728e9d904935ee6e8636ddd-us8"
   }
const request = https.request(url, options, function(response){
   if (response.statusCode === 200) {//to figure out what response code we got back we will use this code
    res.sendFile(__dirname + "/successful.html");} 
    else {
      res.sendFile(__dirname + "/faliur.html")
    }
  response.on("data", function(data) {
     console.log(JSON.parse(data));
    
  }) 
})
 request.write(jsonData)//sending this to the mail.chimp server
 request.end()
});
app.post("/faliur", function(req, res){//we we click the retry button we will triger the post request in the failur form
   //to the failur rout= action which will be called by our server right here 
 res.redirect("/")//send the app.get signUp page
 //then it will redirect to the home rout which is the app.get
})
app.listen(process.env.PORT || 5000, function () {//process.env.PORT we tap into this instead of efining a 
   //port pourselves because heroku might want to chose which port to use on the go dynamically. the process object is defined by heroku
   //so unless we define a port like 5000 we cannot run this code on our local computer
   //to listen to both local and heroku = or||5000
   console.log("hosted in server 5000");
}) 

//API key
//00b7c0fe4728e9d904935ee6e8636ddd-us8
//Audience ID
//029aa52cce