MATH_PI = 3.14159
randomAngle = d3.randomUniform(0, 2*MATH_PI);

function PolarPosition(radius, angle) {
	this.radius = radius;
	this.angle = angle;
}

function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

PolarPosition.prototype.get2DCoords = function(first_argument) {
	let	x = this.radius * Math.cos(this.angle);
	let y = this.radius * Math.sin(this.angle);
	return new Vec2(x,y);
};

function givePosition(movies) {
	var scoreMax = d3.max(movies, function(movie) {return movie.score});
	var scaling = d3.scaleLog().domain([1,scoreMax]).range([1,0]);

	_.each(movies, function(movie, index) {
		var radius = scaling(movie.score);
		var angle = randomAngle();
		movie.position = new PolarPosition(radius, angle);
		movie.farPosition = new PolarPosition(radius+2, angle);
	});
}