onTitleClick = function(){
	scene.renderSystem();
}

onRadioClick = function() {
	console.log("onRadioClick");
	scene.colorIsGenre = document.getElementById("genreSelect").checked;
	scene.renderGalaxy();

	var genre = document.getElementById("legendGenre");
	var geo   = document.getElementById("legendGeo");

	if(scene.colorIsGenre) {
		genre.style.display = "block";
		geo.style.display = "none";
	}
	else {
		geo.style.display = "block";
		genre.style.display = "none";
	}
};

onTopTenClic = function() {
	if(scene.current == "galaxy") {
		scene.critic = null;
	}
	scene.renderGalaxy();
}

