function Scene(movies, critics) {
	this.movies = movies;
	this.critics = critics;
	this.galaxy = d3.select('#movies');
	this.system = d3.select('#critics');
	this.movie = null;
	this.size = 1000; // in pixels
	this.scaling = 1;

	this.scale = d3.scaleLinear()
		.domain([-1,1])
		.range([10,990]);

	givePosition(this.movies);
}

Scene.prototype.drawGalaxy = function() {
	this.movie = null;

	var that = this;
	var solarSystems = this.selectMovies(movies); // = d3.select('#movies').selectAll('circle').data(movies, keyFunc)
	var enter = solarSystems.enter().append('circle'); // append new circles for movies
	enter
			.classed('movie', true)
		    .style('fill', '#426F8C') // TODO: compute color
		    .attr('r', 3) // TODO: compute radius/choose data for radius ?
		    .attr('cx', function(movie) {return that.scale(movie.pos().farX)})
		    .attr('cy', function(movie) {return that.scale(movie.pos().farY)});
	enter.merge(solarSystems)
		    .on('click', function(movie) {that.drawSystem(movie)})
		    .attr('data-title', function(movie) {return movie.title})
		.transition().duration(1000)
			.attr('cx', function(movie) {return that.scale(movie.pos().x)})
		    .attr('cy', function(movie) {return that.scale(movie.pos().y)});
}

Scene.prototype.drawSystem = function(movie) {
	this.movie = movie;

	var that = this;
	var solarSystems = this.selectMovies([movie]);
	solarSystems
		.transition()
		.duration(1000)
		.attr('cx', this.scale(0))
		.attr('cy', this.scale(0));
	solarSystems
		.exit()
		.transition()
		.duration(1000)
	    .attr('cx', function(movie) {return that.scale(movie.pos().farX)})
	    .attr('cy', function(movie) {return that.scale(movie.pos().farY)})
	    .attr('r', 0)
		.remove();
	solarSystems
		.style('fill', '#000')
		.on('click', function() {that.drawGalaxy()});
};

Scene.prototype.selectMovies = function(data) {
	var key = function(movie, index) {
		return movie.imdbid;
	}
	return this.galaxy.selectAll('circle').data(data, key);
};

Scene.prototype.zoomIn = function() {
	if (this.movie) {return}
	this.scaling = 1.1 * this.scaling;
	this.scale.domain([-1/this.scaling, 1/this.scaling]);
};

Scene.prototype.zoomOut = function() {
	if (this.movie) {return}
	this.scaling = 0.9 * this.scaling;
	this.scale.domain([-1/this.scaling, 1/this.scaling]);
}

Scene.prototype.reset = function() {
	this.scaling = 1;
	this.scale.domain([-1,1]);
	this.drawGalaxy();
};

Scene.prototype.resize = function(width, heigth) {
	this.size = d3.min(width, heigth);

	this.scale.range([0, this.size]);
};