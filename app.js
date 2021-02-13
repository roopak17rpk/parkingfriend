const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

let todo =[];  // always use let rather than var
app.set("view engine" , "ejs");

app.use(bodyparser.urlencoded({extended : true }));

app.use(express.static(__dirname + "/public/"));

let name_ ="" ;
let vehicle_number ="" ;
let vehicle_type = "" ;
let contact_ = 0;
let reference_id = 0;

mongoose.connect("mongodb+srv://admin:Adminpass12@cluster0.dc1kk.mongodb.net/myDB?retryWrites=true&w=majority" ,{useNewUrlParser :true});
let today = new Date();
const info_schema = {
    name : String,
    vehiclenumber : String,
    vehicletype : String,
    contact : Number,
    referenceid : Number,
    selectedslot : Number,
    rating : Number,
    feedback_message : String
};
const info = mongoose.model("vehicledatabase" , info_schema);

/*const slotschema = {
    slotnumber : Number,
    slotprice : Number
};

const slotdetail = mongoose.model("slot_database" , slotschema);
for(let i = 0 ; i <40 ;i++)
{
let slot = new slotdetail({
    slotnumber : i,
    slotprice : i*2
});
slot.save();
}
*/
app.get("/" , function(req,res){
    res.render("index");
});

app.get("/layout" , function(req,res){
    res.render("layout");
});

app.post("/" , function(req,res){
    name_ = req.body.Name;
    vehicle_number = req.body.vehicle_number;
    vehicle_type = req.body.vehicle_type;
    contact_ = req.body.contact;
    reference_id = today.getTime();
    
    res.render("layout");
}); 

app.post("/layout" , function(req,res){
    let selected_slot = req.body.example ;
    let new_booking = new info({
        name : name_ ,
        vehiclenumber : vehicle_number,
        vehicletype : vehicle_type,
        contact : contact_,
        referenceid : reference_id , 
        selectedslot : selected_slot
    });
    console.log(selected_slot);
   new_booking.save();
   res.render("show_reference" , {referenceid : reference_id})
});

app.get("/booking_info" , function(req,res){
    res.render("enterreference" , { page_name : "booking_info"});
});

app.post("/booking_info" , function(req,res){
    let ref_id = req.body.referenceid;
    console.log(ref_id);
    info.find({referenceid : ref_id} , function(err,found_info){
        console.log(found_info);
        if(err)
        {
            console.log("their is problem fetching the data");
        }
        else
        {
            found_info.forEach(function(founded_info){
            name_ = founded_info.name;
            vehicle_number = founded_info.vehiclenumber;
            vehicle_type = founded_info.vehicletype;
            contact_ = founded_info.contact;
            reference_id = founded_info.referenceid; 
            selected_slot = founded_info.selectedslot;
            });
            console.log(contact_);
            res.render("display_booking_info" , {name : name_ ,vehicletype :  vehicle_type
            ,vehiclenumber: vehicle_number , slotnumber : selected_slot,phonenumber :  contact_ 
        ,referenceid : reference_id});
        }
    })
});

app.get("/cancel_booking" , function(req,res){
    res.render("enterreference" , { page_name : "cancel_booking"});
});

app.post("/cancel_booking" , function(req,res){
    let ref_id = req.body.referenceid;
    console.log(ref_id);
    info.find({referenceid : ref_id} , function(err,found_info){
        console.log(found_info);
        if(err)
        {
            console.log("their is problem fetching the data");
        }
        else
        {
            found_info.forEach(function(founded_info){
            name_ = founded_info.name;
            vehicle_number = founded_info.vehiclenumber;
            vehicle_type = founded_info.vehicletype;
            contact_ = founded_info.contact;
            reference_id = founded_info.referenceid; 
            selected_slot = founded_info.selectedslot;
            });
            console.log(contact_);
            res.render("cancel_booking" , {name : name_ ,vehicletype :  vehicle_type
            ,vehiclenumber: vehicle_number , slotnumber : selected_slot,phonenumber :  contact_ 
        ,referenceid : reference_id});
        }
    })
});

app.post("/cancellation_confirmed" , function(req,res){
    console.log(reference_id);
    info.deleteOne( { referenceid : reference_id} , function(err){
        if(err){
            res.send("This Reference Never existed");
        }
        else
        {
            res.send("Cancellation Successfull");
        }
    });
});

app.get("/feedback" , function(req,res){
    res.render("feedback");
});

app.post("/feedback" , function(req,res){
    let message = req.body.message;
    let rating_ = req.body.rating;
    let reference_id = req.body.Reference_id
    console.log(req.body.message);
    info.findOneAndUpdate({ referenceid : reference_id} , {rating : rating_},
        function(err){
            if(err){res.send("There was an error");}
        });
    info.findOneAndUpdate({ referenceid : reference_id} , {feedback_message : message},
        function(err){
            if(err){res.send("There was an error");}
            });
    res.redirect("/");
});

app.listen(3000,function(req,res){
    console.log("Server Up And Running");
});