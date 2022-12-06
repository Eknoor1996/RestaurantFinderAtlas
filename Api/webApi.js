var mongoose = require('mongoose');
var Restaurant = require('../models/restaurants');

//Form connection with database present in Atlas and access the collection
function initialize(url){
    mongoose.connect(url, function(err){
        if (err){
            console.log('Connection failed!');
            throw err;
        }
        else{
            console.log('Connected successfully!');
        } 
    });
}

// Function to interact with the collection and create new documents
async function addNewRestaurant(data){
   await Restaurant.create(data,function(err, results) {
    if (err)
        console.log(err);
    else
        console.log("New restaurant information has been added!!!");
        return results;
    });
}

//Function to get all the restaurant information
async function getAllRestaurants(){
    
    var results = await Restaurant.find().lean()/*.sort(sort).limit(limit).skip(skip).exec()*/;
    //console.log(results);
    return results;
}

//Function to get data by pages
async function getRestaurantByPages(page,perPage,borough){
    let limit =  perPage;
    let skip = (page-1)*perPage;
    let sort = null;
    sort = {restaurant_id: 1};

    if(borough != null && borough != ""){
        var filtered =await Restaurant.find({borough: {$eq: borough}}).lean().sort(sort).limit(limit).skip(skip).exec();
    }
    else{
        var results = await Restaurant.find().lean().sort(sort).limit(limit).skip(skip).exec();
        return results;
    }
    return filtered;
}

//Function to return restaurant information corresponding to an ID
async function getRestaurantById(Id){
    return await Restaurant.find({_id: Id}).lean();
}

//Function to update a particular document corresponding to the ID
async function updateRestaurantById(id,data){
    await Restaurant.findByIdAndUpdate(id, data);
}

//Function to delete a particular document corresponding to the ID
function deleteRestaurantById(Id){
    Restaurant.remove({_id : Id}, function(err) {
        if (err)
            console.log(err)
        else
            console.log("Restaurant deleted successfully");
    });
}
module.exports = {initialize, addNewRestaurant, getAllRestaurants, getRestaurantById, updateRestaurantById, deleteRestaurantById, getRestaurantByPages}
