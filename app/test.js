var db = new Database("../data/movies.csv", "../data/critics.csv", "../data/meta.csv");

function onDbLoaded(db) {
	critics = _.map(db.critics, function (obj, index, critics) {
		return new Critic(obj);
	});

	movies = _.map(db.movies, function (obj, index, movies) {
		return new Movie(obj, db.meta[index], critics);
	});
}
