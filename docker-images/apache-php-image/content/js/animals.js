$(function(){
	console.log("Loading animals");
	
	function loadAnimals(){
		$.getJSON( "/api/students/", function( animals ){
			console.log(animals);
			var message = "It's a quiet place here";
			if(animals.length > 0){
				message = "Oh look, it's "+animals[0].name+", the "+animals[0].race;
			}
			$(".masthead-heading").text(message);
		});
	};
	loadAnimals;
	setInterval( loadAnimals, 2000);
});