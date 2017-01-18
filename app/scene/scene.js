function Scene(movies, critics) {
	this.filterManager = new filterManager();
	this.movies = movies;
	this.critics = critics;

	this.movie = null;
	this.critic = null;

	this.scale = d3.scaleLinear()
	.domain([-1,1])
	.range([0,1000]);

	givePosition(this.movies);
	computeRank(this.movies);
	this.moviesSelected=[];

	this.colorIsGenre = true;
}

Scene.prototype.initialize = function() {
	this.drawRankBounds();
	this.drawOrbits();
};

Scene.prototype.renderGalaxy = function() {
	this.drawGalaxy();

	this.drawCircleAround();
	this.displayMovieInfo();
	this.drawCriticConstellation();
	this.displayCriticInfo();

	this.undrawSystem();
};

Scene.prototype.renderSystem = function() {
	this.drawSystem();

	this.undrawCircleAround();
	this.undrawCriticConstellation();
	this.hideMovieInfo(this.movie);
	this.hideCriticInfo();

	this.undrawGalaxy();
};

Scene.prototype.drawGalaxy = function() {
	var that = this;

	$("#movieSelected").show();
	$("#rank").show();



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
}

Scene.prototype.drawRankBounds = function() {
	let that = this;

	let distance = function(a,b)
	{
		return Math.sqrt(Math.pow((a.pos().x - b.pos().x),2)+Math.pow((a.pos().y - b.pos().y),2));
	}

	var radius_100 = distance(movies[0],movies[99]);
	d3.select('#rank').append('circle')
			.style('stroke', '#6F6F6B')
			.style('fill', 'transparent')
		.attr('r', radius_100 * 490)
		.attr('class', 'Rank100Circle')
		.attr('cx', that.scale(movies[0].pos().x))
		.attr('cy', that.scale(movies[0].pos().y))
		.attr("stroke-dasharray","5,5");

	var radius_10 = distance(movies[0],movies[9]);
		d3.select('#rank').append('circle')
				.style('stroke', '#6F6F6B')
				.style('fill', 'transparent')
			.attr('r', radius_10 * 490)
			.attr('class', 'Rank100Circle')
			.attr('cx', that.scale(movies[0].pos().x))
			.attr('cy', that.scale(movies[0].pos().y))
			.attr("stroke-dasharray","5,5");
}

Scene.prototype.undrawGalaxy = function() {
	$("#movieSelected").hide();
	$("#rank").hide();

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

	solarSystems
	.on('click', function() {that.renderGalaxy()});
};

Scene.prototype.drawSystem = function() {
	Scene.prototype.displayMovieInfo(this.movie);

	var that = this;

	$("#critics").show();
	$("#criticsOrbite").show();
	// critics
	var my_critics = d3.select('#critics').selectAll('circle').data(this.movie.rankings);
	var enter = my_critics.enter().append('circle');
	enter.merge(my_critics)
		.attr('r', 4)
		.attr('cx', (ranking) => (that.scale(ranking.posX())) )
		.attr('cy', (ranking) => (that.scale(ranking.posY())) )

		.style('fill', '#000')
		.on('click', function (ranking){ that.displayCriticInfo(ranking.critic) });

	my_critics.exit().remove();

	scene.filterManager.refresh();
};

Scene.prototype.undrawSystem = function() {
	$("#critics").hide();
	$("#criticsOrbite").hide();
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

Scene.prototype.drawCriticConstellation = function() {
	if (!this.critic) {
		this.undrawCriticConstellation();
		return;
	}

	$("#constellation").show();

	var c = d3.select("#constellation");
	data = this.critic.getTopTen();

	circles = c.selectAll("circle").data(data);
	circles.enter().append("circle").merge(circles)
		.attr('r', 10)
		.attr('cx', (movie) => (this.scale(movie.pos().x)))
		.attr('cy', (movie) => (this.scale(movie.pos().y)))
		.style('fill', 'transparent')
		.style('stroke', 'coral')
		.style('stroke-width', 2);

	c.selectAll("line").remove();
	var s = d3.scaleLinear().domain([1,10]).range(["red", "Navy"])

	for (var i =0; i< 9; i++)
	{
		c.append('line')
			.attr('x1', this.scale(data[i].pos().x))
			.attr('y1', this.scale(data[i].pos().y))
			.attr('x2', this.scale(data[i+1].pos().x))
			.attr('y2', this.scale(data[i+1].pos().y))
			.style('stroke', s(i));
	}

	return true;
};

Scene.prototype.undrawCriticConstellation = function() {
	this.critic = null;
	$("#constellation").hide();
};

Scene.prototype.displayMovieInfo = function(movie)
{
	if(!movie && !this.movie) {
		return;
	}

	if(!movie) {
		movie = this.movie;
	}

	$('#movie_info').show();
	$('#histo').show();

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

	var x = d3.scaleOrdinal()
		.domain([1,2,3,4,5,6,7,8,9,10]);
		
	var chart = d3.select(".chart")
	.attr("width", width)
	.attr("height", height);

	var barWidth = width / data.length;

	var g =chart.selectAll("g").data(data);
	g.enter() // bind data + one time build dom element <g><rect></rect></g>
		.append("g").attr("transform", function(d, index) { return "translate(" + index * barWidth + ",0)"; })
		.append("rect");
		
	g.enter().append("text").attr("transform", function(d, index) { return "translate(" + index * barWidth + ",0)"; })
		.attr("x", barWidth/2)
		.attr("y", height/1.5)
		.classed("value",true)
		.attr("dy", ".75em");
		
		
	g.enter().append("text").attr("transform", function(d, index) { return "translate(" + index * barWidth + ",0)"; })
		.attr("x", barWidth/2)
		.attr("y", height -10)
		.attr("dy", ".75em")
		.classed("axis",true)
		.text(function(d,index) { return index +1; });
		
		chart.selectAll("text.value").data(data)
		.classed("hidden", (d)=>(d==0))
		.text(function(d) {return d; });

	chart.selectAll("rect").data(data)
		.transition().duration(200)
	    .attr('x', 0)
	    .attr('y', (d) => (y(d)))
	    .attr('width', barWidth-2)
	    .attr('height', function (d) {return height - y(d) -12;});
		

	$("#svgHisto").show();
}

Scene.prototype.hideMovieInfo = function(movie)
{
	$("#movie_info").hide();
	$("#histo").hide();

	if (this.movie) {
		this.displayMovieInfo();
	}
}

Scene.prototype.displayCriticInfo = function(critic) {
	if (critic) {
		this.critic = critic;
	}

	if (!this.critic) {
		$("#critic_info").hide();
		return;
	}

	$("#critic_info").show();
	d3.select("#critic_info").selectAll("div").data(this.critic.getData())
	.text((d) => (d));
}

Scene.prototype.hideCriticInfo = function() {
	$("#critic_info").hide();
	this.critic = null;
};

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

Scene.prototype.drawOrbits = function()
{
	let data = [50,100,150,200,250,300,350,400,450,500];
	d3.select('#criticsOrbite').selectAll('circle').data(data).enter().append('circle')
			.style('stroke', 'DarkGrey')
			.style('fill', 'transparent')
		.attr('r', (radius)=>(radius))
		.attr('cx', this.scale(0))
		.attr('cy', this.scale(0));
}
