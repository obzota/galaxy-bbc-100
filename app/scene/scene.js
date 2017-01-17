function Scene(movies, critics) {
	this.filterManager = new filterManager();
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
	this.moviesSelected=[];
}

Scene.prototype.drawGalaxy = function() {
	this.movie = null;
	var that = this;
	var selectGenre = true;

	$("#critics").hide();

	var solarSystems = this.d3GalaxySelect(movies); // = d3.select('#movies').selectAll('circle').data(movies, keyFunc)
	var enter = solarSystems.enter().append('circle'); // append new circles for movies
	enter
	.classed('movie', true)
	.style('fill', function(movie) {return movie.color(selectGenre)})
	//TODO: pass the value of the radio button of the matrix
    .attr('r', 3) // TODO: compute radius/choose data for radius ?
    .attr('cx', function(movie) {return that.scale(movie.pos().farX)})
    .attr('cy', function(movie) {return that.scale(movie.pos().farY)});

    enter.merge(solarSystems)
    .on('click', function(movie) {that.selectMovie(movie)})
    .on('mouseenter', function(movie) {that.displayMovieInfo(movie)})
    .on('mouseleave', function(movie) {that.hideMovieInfo(movie)})
    .attr('data-title', function(movie) {return movie.title})
    .transition().duration(1000)
		.attr('r', 3)
    .attr('cx', function(movie) {return that.scale(movie.pos().x)})
    .attr('cy', function(movie) {return that.scale(movie.pos().y)});
}

Scene.prototype.drawSystem = function(movie) {
	this.movie = movie;
	Scene.prototype.displayMovieInfo(movie);

	var that = this;
	var solarSystems = this.d3GalaxySelect([movie]);

	$("#critics").show();

	solarSystems
	.transition()
	.duration(1000)
	.attr('cx', this.scale(0))
	.attr('cy', this.scale(0))
	.attr('r', 12);

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

	// critics
	var my_critics = d3.select('#critics').selectAll('circle').data(movie.rankings);
	var enter = my_critics.enter().append('circle');
	enter.merge(my_critics)
		.attr('r', 4)
		.attr('cx', (ranking) => (that.scale(ranking.posX())) )
		.attr('cy', (ranking) => (that.scale(ranking.posY())) )
		.style('fill', '#000000')
};

Scene.prototype.d3GalaxySelect = function(data) {
	var key = function(movie, index) {
		return movie.imdbid;
	}
	return this.galaxy.selectAll('circle').data(data, key);
};

Scene.prototype.selectMovie = function(movie) {
	this.movie = movie;
	this.displayMovieInfo(movie);
	this.moviesSelected.push(movie);
	this.drawCircleAround(movie);
};

Scene.prototype.displayMovieInfo = function(movie)
{

	/*
		render movie info
	*/
	var template = $("#template")[0].innerHTML;
	var output = Mustache.render(template, movie);
	$("#movie_info")[0].innerHTML = output;

	/*
		render movie rating histogram
	*/
	var data = [0,0,0,0,0,0,0,0,0,0];
	movie.histogram.map((bucket) => (data[bucket[0]-1] = bucket.length));

	var width = 300,
	height = 100;

	var y = d3.scaleLinear()
	.domain([0, d3.max(data)])
	.range([height-2, 0]);

	var chart = d3.select(".chart")
	.attr("width", width)
	.attr("height", height);

	var barWidth = width / data.length;

	chart.selectAll("g").data(data).enter() // bind data + one time build dom element <g><rect></rect></g>
		.append("g").attr("transform", function(d, index) { return "translate(" + index * barWidth + ",0)"; })
		.append("rect");

	chart.selectAll("rect").data(data)
		.transition().duration(200)
	    .attr('x', 0)
	    .attr('y', (d) => (y(d)))
	    .attr('width', barWidth-2)
	    .attr('height', function (d) {return height - y(d);});

	// bar.append("text")
	// .attr("x", barWidth / 2)
	// .attr("y", function(d) { return y(d) + 3; })
	// .attr("dy", ".75em")
	// .text(function(d) { return d; });

	var x = d3.scaleLinear()
		.domain([0, d3.max(data)])
		.range([0, 100]);

	$("#svgHisto").show();
}

Scene.prototype.hideMovieInfo = function(movie)
{
	if(!this.movie)
	{
		$("#movie_info")[0].innerHTML = null;
		$("#svgHisto").hide();
		return;
	}
	if (this.movie !== movie) {
		this.displayMovieInfo(this.movie);
	}
}

Scene.prototype.displayCriticInfo = function(critic) {

}

Scene.prototype.hideCriticInfo = function(critic) {

}



updateColorMapping = function() {
	// Check if we should map genre to color and update Galaxy
	var genreSelected = document.getElementById("genreSelect").checked;
	d3.select('#movies').selectAll('circle')
		.style('fill', function(movie) {return movie.color(genreSelected)});
}


Scene.prototype.drawCircleAround = function(movie)
{
	var previousMoviesSelected = d3.select('#moviesSelected').selectAll('.movieSelected')
		.data(this.moviesSelected).style('stroke','lightgray');
	
	previousMoviesSelected.enter().append('circle')
		.style('stroke', '#FF0000')
		.style('fill', 'transparent')
    .attr('r', 10) 
	.attr('class','movieSelected')
    .attr('cx', this.scale(movie.pos().x))
    .attr('cy', this.scale(movie.pos().y));
}