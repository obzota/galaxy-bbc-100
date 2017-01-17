function Ranking(critic, rank) {
	this.critic = critic;
	this.rank = rank;
	this.position = getRankingPos(this.rank);
}


Ranking.prototype.posX = function() {
	return this.position.get2DCoords().x;
}


Ranking.prototype.posY = function() {
	return this.position.get2DCoords().y;
}
