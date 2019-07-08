const mongoose   = require("mongoose");
const campgroundSchemea =new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    },
    comments:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"

    }]
});
module.exports = mongoose.model("Campground",campgroundSchemea);