const mongoose = require('mongoose');
var train = {
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
}


var UserSchema = mongoose.Schema({
    name : String,
    email : String,
    pass : String,
    voyage : Array,
    lastTrip : Array,
  });
  
module.exports = mongoose.model('users', UserSchema);