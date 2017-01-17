onTitleClick = function(){
	scene.drawSystem(scene.movie);
}

updateColorMapping = function() {
	// Check if we should map genre to color and update Galaxy
	var genreSelected = document.getElementById("genreSelect").checked;
	d3.select('#movies').selectAll('circle')
		.style('fill', function(movie) {return movie.color(genreSelected)});
}
