function Movie(
	object, // raw movie recovered from d3.csv
	meta, // raw meta ...
	critics // array of Critic objects
) {
	// object data
	this.director = object.director;
	this.imdbid = object.imdbid;
	this.title = object.title;
	this.year = object.year;

	// metadata (all fields start with capital letters #thanksCSVfile)
	// TODO: find useful field to add (from meta.csv)
	this.poster = meta.Poster;
	this.genre = this.parseGenre(meta.Genre);
	this.nationality = meta.Country;
	this.rank =0;
	// ...

	this.rankings = [];
	// Loop over the critics for double link 'movie <-> critic'
	var that = this;
	this.score = 1; // avoid '0' for log scale
	_.each(critics, function (critic, index, list) {
		var rank = +object[critic.critic_id]; // '+' cast the value from string to integer
		if (rank != 0) { // '0' means not rated by this critic
			that.rankings.push(new Ranking(critic, rank));
			critic.topTen[rank-1] = that;
			that.score += 11 - rank;
		}
	});

	this.histogram = this.histo();
}

function computeRank(movies)
{
	movies.sort(function(a, b){
    return b.score-a.score
	});

	for (i = 0; i < movies.length; i++)
	{
	   movies[i].rank = i+1;
	}
}

// DONE: implement/find parser string to array
// "Drama, Western" -> ["Drama", "Western"]
Movie.prototype.parseGenre = function(string) {
	var res = string.split(",");
	return res;
};

Movie.prototype.pos = function() {
	if (!this.position || !this.farPosition) {
		console.log("[WARNING] no position found for movie: " + this.title);
		return 0;
	}
	return {
		x: this.position.get2DCoords().x,
		y: this.position.get2DCoords().y,
		farX: this.farPosition.get2DCoords().x,
		farY: this.farPosition.get2DCoords().y
	};
};

Movie.prototype.histo = function() {
	var values = _.map(
		this.rankings,
		(r) => (r.rank)
		);
	//return values;
	var generator = d3.histogram().thresholds([1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5]);
	return generator(values);
};


Movie.prototype.color = function(wantGenre) {
	var color = '#33CCFF';

	// If we need to encode genre with color
	if (wantGenre) {
		var genreMovie = this.genre;
		genreMovie = this.parseGenre(String(this.genre));

		// We only use the first genre to determine color
		switch(genreMovie[0]) {
			case "Drama":
				color = '#000000';
				break;
			case "Comedy":
				color = '#C6CE62';
				break;
			case "Romance":
				color = '#FF00BF';
				break;
			case "Crime": case "Thriller":
				color = '#4940C9';
				break;
			case "Action" : case "Adventure":
				color = '#DF0101';
				break;
			case "Biography": case "History": case "Documentary":
				color = '#31B404';
				break;
			case "Animation":
				color = '#33CCFF';
				break;
			default:
				color = '#7E677F';
		}
	}

	// If we need to encode nationality with color
	else {
		color = "#000000";
		// TODO: check if this nationality is relevant (several countries are mixed)
		var nat = this.nationality;

		if (String(nat).search("China|Japan|Korea|Taiwan|Singapore") != -1) {
			color = '#FF0000';
		}
		if (String(nat).search("USA|Mexico|Peru") != -1) {
			color = '#FFFF00';
		}
		if (String(nat).search("France|Spain|UK|Finland|Germany|Italy|Portugal|Romania|Belgium") != -1) {
			color = '#0000FF';
		}
		if (String(nat).search("Israel|Palestine|Jordan|Iran|Egypt") != -1) {
			color = '#0B610B';
		}
	}

	return color;
}
