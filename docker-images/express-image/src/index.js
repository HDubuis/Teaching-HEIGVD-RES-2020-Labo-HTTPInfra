var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/test', function(req,res){
	res.send("Hello again - test is working");
});

app.get('/', function(req,res){
	res.send(generateAnimals());
});

app.listen(3000, function(){
	console.log('Accepting HTTP requests on port 3000');
});

function generateAnimals(){
	var numberOfAnimals = chance.integer({
	min: 0,
	max : 5
	});
	console.log(numberOfAnimals);
	var animals = [];
	for(var i = 0; i < numberOfAnimals; i++){
		animals.push({
			race: chance.animal(),
			name: chance.last(),
			gender: chance.gender()
		});
	};
	
	console.log(animals);
	return animals;
}