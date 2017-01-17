function Scene(movies, critics) {
	this.filterManager = new filterManager();
	this.movies = movies;
	this.critics = critics;

	this.movie = null;

	this.scale = d3.scaleLinear()
	.domain([-1,1])
	.range([10,990]);

	givePosition(this.movies);
	computeRank(this.movies);

	this.moviesSelected=[];

	this.colorIsGenre = true;
}

Scene.prototype.renderGalaxy = function() {
	this.drawGalaxy();
	this.drawCircleAround();
	this.displayMovieInfo();
	this.undrawSystem();
};

Scene.prototype.renderSystem = function() {
	this.undrawGalaxy();
	this.drawSystem();
	this.undrawCircleAround();
};

Scene.prototype.drawGalaxy = function() {
	var that = this;

	$("#movieSelected").show();

	var solarSystems = this.d3GalaxySelect(movies); // = d3.select('#movies').selectAll('circle').data(movies, keyFunc)
	var enter = solarSystems.enter().append('circle'); // append new circles for movies
	enter
	.classed('movie', true)
	//TODO: pass the value of the radio button of the matrix
    .attr('r', 3) // TODO: compute radius/choose data for radius ?
    .attr('cx', function(movie) {return that.scale(movie.pos().farX)})
    .attr('cy', function(movie) {return that.scale(movie.pos().farY)});

    enter.merge(solarSystems)
    .on('click', function(movie) {that.selectMovie(movie)})
    .on('mouseenter', function(movie) {that.displayMovieInfo(movie)})
    .on('mouseleave', function(movie) {that.hideMovieInfo(movie)})
    .attr('data-title', function(movie) {return movie.title})
    .style('fill', function(movie) {return movie.color(that.colorIsGenre)})
    .transition().duration(1000)
		.attr('r', 3)
    .attr('cx', function(movie) {return that.scale(movie.pos().x)})
    .attr('cy', function(movie) {return that.scale(movie.pos().y)});
	scene.filterManager.refresh();

	var radius = distance(movies[0],movies[99]);
	d3.select('#rank').append('circle')
			.style('stroke', '#00FF00')
			.style('fill', 'transparent')
		.attr('r', radius * 490)
		.attr('class', 'Rank100Circle')
		.attr('cx', that.scale(movies[0].pos().x))
		.attr('cy', that.scale(movies[0].pos().y));
}

function distance(a,b)
{
	return Math.sqrt(Math.pow((a.pos().x - b.pos().x),2)+Math.pow((a.pos().y - b.pos().y),2));
}


Scene.prototype.undrawGalaxy = function() {
	$("#movieSelected").hide();

	var that = this;
	var solarSystems = this.d3GalaxySelect([this.movie]);

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

	var genreSelected = document.getElementById("genreSelect").checked;
	solarSystems
	.on('click', function() {that.renderGalaxy()});
};

Scene.prototype.drawSystem = function() {
	Scene.prototype.displayMovieInfo(this.movie);

	var that = this;

	$("#critics").show();

	// critics
	var my_critics = d3.select('#critics').selectAll('circle').data(this.movie.rankings);
	var enter = my_critics.enter().append('circle');
	enter.merge(my_critics)
		.attr('r', 4)
		.attr('cx', (ranking) => (that.scale(ranking.posX())) )
		.attr('cy', (ranking) => (that.scale(ranking.posY())) )
		.style('fill', '#000000')

	scene.filterManager.refresh();
};

Scene.prototype.undrawSystem = function() {
	$("#critics").hide();
};

Scene.prototype.d3GalaxySelect = function(data) {
	var key = function(movie, index) {
		return movie.imdbid;
	}
	return d3.select('#movies').selectAll('circle').data(data, key);
};

Scene.prototype.selectMovie = function(movie) {
	this.movie = movie;
	this.moviesSelected.push(movie);
	this.renderGalaxy();
};

Scene.prototype.displayMovieInfo = function()
{
	if(!this.movie) {
		return;
	}

	let movie = this.movie;

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

Scene.prototype.drawCircleAround = function()
{
	$("#moviesSelected").show();
	var previousMoviesSelected = d3.select('#moviesSelected').selectAll('.movieSelected')
		.data(this.moviesSelected).style('stroke','lightgray');

	previousMoviesSelected.enter().append('circle')
		.style('stroke', '#FF0000')
		.style('fill', 'transparent')
	.attr('r', 10)
	.attr('class','movieSelected')

	.attr('cx', (movie) => (this.scale(movie.pos().x)))
	.attr('cy', (movie) => (this.scale(movie.pos().y)));
}

Scene.prototype.undrawCircleAround = function() {
	$("#moviesSelected").hide();
};
