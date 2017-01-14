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

// DID: implement/find parser string to array
// "Drama, Western" -> ["Drama", "Western"]
Movie.prototype.parseGenre = function(string) {
	var res = string.split(", "); 
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

	return d3.histogram()(values);
};

compareMovies = function(a,b) {
	return a.score - b.score;
};