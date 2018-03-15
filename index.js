const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication  = require('./routes/authentication')(router);
const bodyParser = require('body-parser');




mongoose.connect("mongodb://127.0.0.1:27017/meanDB",(err)=>{
	if(err){
		console.log(' oops!! :( Could not connect to database');
	}
	else{
		console.log(':) Happy to Connected with database');
	}
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  next();
});



app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication',authentication);

 app.get('*',(req,res)=>{
res.sendFile(path.join(__dirname + '/client/dist/index.html'));
 });
 app.listen(8080,()=>{
 	console.log('Listing on port 8080')
 });


