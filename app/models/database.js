function Database(movieUrl, criticsUrl, metadataUrl) {
	this.movies = null;
	this.critics = null;
	this.meta = null;

	var that = this;
	d3.csv(movieUrl, function(error, data) {
		that.movies = data;
		console.log("[INFO] movies loaded !");
	});
	d3.csv(criticsUrl, function(error, data) {
		that.critics = data;
		console.log("[INFO] critics loaded !");
	});
	d3.csv(metadataUrl, function(error, data) {
		that.meta = data;
		console.log("[INFO] metadata loaded !");
	});
}

Database.prototype.isReady = function() {
	return !(_.isNull(this.movies) || _.isNull(this.critics) || _.isNull(this.meta));
};
