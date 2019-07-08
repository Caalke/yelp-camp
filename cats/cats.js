var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/cat_app',{useNewUrlParser:true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({ 
//     name: "ms norris",
//     age: 7,
//     temperament: "evil"
// })
// george.save(function(err, cat){
//     if(err){
//         console.log("error with the save")
//     } else { 
//         console.log("saved a cat")
//         console.log(cat);
//     }
// });
Cat.create({
    name:"moog",
    age:12,
    temperament:"Nice"
}, function(err,cat){
    if (err){
        console.log(err);
    }else{
        console.log(cat);
}
});
// Cat.find({},function(err,cats){
//     if (err){
//         console.log(err);
//     }else{
//         console.log("look at these cats:");
//         console.log(cats);
//     }
// })