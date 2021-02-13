const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

let todo =[];  // always use let rather than var
app.set("view engine" , "ejs");

app.use(bodyparser.urlencoded({extended : true }));

app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin:Adminpass12@cluster0.dc1kk.mongodb.net/myDB?retryWrites=true&w=majority" ,{useNewUrlParser :true});

app.get("/" ,function(req,res){
    
app.listen(3100,function(req,res){
    console.log("server is up an running");
});
