const mongoose = require('mongoose');
var train = {
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number
}


var UserSchema = mongoose.Schema({
    email : String,
    pass : String,
    voyage : [train]
  });
  
module.exports = mongoose.model('users', UserSchema);