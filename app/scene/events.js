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

onTopTenClic = (function() {
	let saveCritic = true;
	return function() {
		if(!saveCritic) {
			scene.critic = null;
		}
		saveCritic = !saveCritic;
		scene.renderGalaxy();
	}
})();

