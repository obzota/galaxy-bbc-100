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
	var selectGenre = true;

	var solarSystems = this.d3GalaxySelect(movies); // = d3.select('#movies').selectAll('circle').data(movies, keyFunc)
	var enter = solarSystems.enter().append('circle'); // append new circles for
	movies
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
    .attr('cx', function(movie) {return that.scale(movie.pos().x)})
    .attr('cy', function(movie) {return that.scale(movie.pos().y)});
}

Scene.prototype.drawSystem = function(movie) {
	this.movie = movie;
	Scene.prototype.displayMovieInfo(movie);

	var that = this;
	var solarSystems = this.d3GalaxySelect([movie]);

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

Scene.prototype.d3GalaxySelect = function(data) {
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

Scene.prototype.selectMovie = function(movie) {
	this.movie = movie;
	this.displayMovieInfo(movie);
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


Scene.prototype.drawColorButtons = function() {
	// Radio buttons for encoding color
	var genreSelected = true;
	var body = d3.select("body")
	var form = body.append('form');
	form.append('input')
	.attr('type', 'radio')
	.attr('value', 'Genre')
	.attr('name', 'toggle')
	.on('click', function () {
		genreSelected = true;
	});
	form.append('label')
	.html('Genre');

	form.append('input')
	.attr('type', 'radio')
	.attr('value', 'Nat')
	.attr('name', 'toggle')
	.on('click', function () {
		genreSelected = false;
	});
	form.append('label')
	.html('Nationality');

	return genreSelected;
}
