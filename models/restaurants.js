var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restaurants = new Schema({
    address: {
        building: String,
        coord: [Number],
        street: String,
        zipcode: String
    },
    borough: String,
    cuisine: String,
    grades: [{
        _id: false,
        date: Date,
        grade: String,
        score: Number
    }],
    name: String,
    restaurant_id: String
});
module.exports = mongoose.model('restaurants', restaurants);