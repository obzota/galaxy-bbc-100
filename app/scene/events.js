onTitleClick = function(){
	scene.renderSystem();
}

onRadioClick = function() {
	// Check if we should map genre to color and update Galaxy
	var genreSelected = document.getElementById("genreSelect").checked;
	scene.renderGalaxy();

	var genre = document.getElementById("legendGenre");
	var geo   = document.getElementById("legendGeo");

	if(genreSelected) {
		genre.style.display = "block";
		geo.style.display = "none";
	}
	else {
		geo.style.display = "block";
		genre.style.display = "none";
	}
};