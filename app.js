/********************************************************************************** 
 * ITE5315 – Project* I declare that this assignment is my own work in accordance with Humber Academic Policy.* 
 * No part of this assignment has been copied manually or electronically from any other source* 
 * (including web sites) or distributed to other students.** 
 * Group member Name: Eknoor Kaur & Stavan Adhyaru Student IDs: N01552845,N01570916 Date: 05-12-2022
 **********************************************************************************/

var express  = require('express');
var app      = express();
var path = require('path');
var database = require('./config/database');
var db = require('./Api/webApi');
var bodyParser = require('body-parser'); 

var port     = process.env.PORT || 8000;

const exphbs = require('express-handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true}));
const HBS = exphbs.create();
app.engine('.hbs', HBS.engine);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({'extended':'true'}));            
app.use(bodyParser.json());                                     
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

//Function to connect our application with the database
db.initialize(database.url);

//Function to visit the application home page
app.get('/api/home',function(req,res){
	res.render('index', { title: 'Restaurant Finder' });
});

//Function to get the entire data from the database
app.get('/api/restaurants', async function(req, res) {
    var result = await db.getAllRestaurants()
	res.status(200).render('allRestaurants', { data: result});
});

//Function to get the restaurant data by pages
app.get('/api/restaurantByPages', async function(req,res){
	if(req.body.page != null){
		var page = req.body.page;
	}
	else{
		var page = 1;
	}
	if(req.body.perPage != null){
		var perPage = req.body.perPage;
	}
	else{
		var perPage = 10;
	}
	var borough = null;
	console.log(page,perPage,borough)
	var result = await db.getRestaurantByPages(page,perPage,borough)
	res.status(200).render('restaurantsByPages', { data: result });
});

app.post('/api/restaurantByPages/pages',async function(req,res){
	if(req.body.page != null){
		var page = req.body.page;
		page = parseInt(page);
		if (page == 0){
			res.render('error', {title: 'Invalid Page Number'});
		}
		console.log("Page",page);
		req.body.page = parseInt(page);
		
		console.log("Body Page ",req.body.page);
	}else{
		var page = 1;
		req.body.page = page;
	}

	if(req.body.perPage != null){
		var perPage = req.body.perPage;
		req.body.perPage = perPage;

	}else{
		var perPage = 10;
		req.body.perPage = perPage;
	}

	if(req.body.borough != null){
		var borough = req.body.borough;
	}else{
		var borough = null;
	}
	console.log(page,perPage,borough)
	var result = await db.getRestaurantByPages(page,perPage,borough)

	res.status(200).render('restaurantsByPages', { data: result, page: page, perPage: perPage  });
})

//Function to find a restaurant by it's object id
app.get('/api/find_restaurants',async function(req, res){
	res.render('findRestaurant', { title: 'Restaurants' });
});

app.get('/api/restaurant/', async function(req, res){
	let id = req.query._id;
	var result = await db.getRestaurantById(id);
	res.render('allRestaurants', { data: result});
});

//Function to insert a new record in the database
app.get("/api/insertDetails", (req, res) => {
	res.status(201).render("insertData",{title:'Insert new restaurant details'});
});

app.post('/api/insertDetails', async function(req, res) {
	let coordinates = req.body.coord;
	let coordDataStr = coordinates.split(',');
	let coordData = [];
	for (var i = 0; i < coordDataStr.length; i++)
	{
		coordData.push(parseInt(coordDataStr[i]));
	}
	var data = {
        address: {
			building: req.body.building,
			coord: coordData,
			street: req.body.street,
			zipcode: req.body.zipcode
		},
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: [{
			date: req.body.date,
			grade: req.body.grade,
			score: req.body.score
		}],
        name: req.body.name,
        restaurant_id: req.body.restaurant_id,
	}
    await db.addNewRestaurant(data);
	res.status(200).render('docInsert');
});

//Function to update the details for a particular restaurant
app.get('/api/updateDetails', function(req, res){
	res.status(201).render('updateRestaurantDetails', { title: 'Update Restaurant Details'});
});

app.post('/api/updateDetails', async function(req, res){
	var id = req.body._id;
	let coordinates = req.body.coord;
	let coordDataStr = coordinates.split(',');
	let coordData = [];
	for (var i = 0; i < coordDataStr.length; i++)
	{
		coordData.push(parseInt(coordDataStr[i]));
	}
	var data = {
        address: {
			building: req.body.building,
			coord: coordData,
			street: req.body.street,
			zipcode: req.body.zipcode
		},
        borough: req.body.borough,
        cuisine: req.body.cuisine,
        grades: [{
			date: req.body.date,
			grade: req.body.grade,
			score: req.body.score
		}],
        name: req.body.name,
        restaurant_id: req.body.restaurant_id
	}
	await db.updateRestaurantById(id,data);
	res.status(200).render('docUpdate',{ id: id});
});

//Function to delete the restaurant record from database
app.delete('/api/restaurant/:_id', function(req, res){
	let id = req.params._id;
	db.deleteRestaurantById(id);
});

app.get('/api/deleteRestaurant/:_id', function(req,res){
	var id = req.params._id;
	db.deleteRestaurantById(id);
	res.render('deleteRestaurant');
});

app.get('/*', function(req, res){
    res.render('error', { title: 'Wrong Route' });
});

app.listen(port);