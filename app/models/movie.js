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
	// TODO: compute the global score of the film according to the rankings
	var that = this;
	_.each(critics, function (critic, index, list) {
		var rank = +object[critic.critic_id]; // '+' cast the value from string to integer
		if (rank != 0) { // '0' means not rated by this critic
			that.rankings.push(new Ranking(critic, rank));
			critic.topTen[rank-1] = that;
		}
	});
}

// TODO: implement/find parser string to array
// "Drama, Western" -> ["Drama", "Western"]
Movie.prototype.parseGenre = function(string) {
	return "TODO: implement parser for Genre";
};