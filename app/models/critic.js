/*
	All instances of this class needs to be build and gathered in an array before
	instanciating any movie.
	This is necessary so we can build all the links between movies and critics in
	the Movie constructor.
*/
function Critic(
	object
) {
	this.country = object.country
	this.critic_id = object.critic_id
	this.media = object.media
	this.name = object.name
	this.topTen = [null,null,null,null,null,null,null,null,null,null]; // is filled in movie constructor, 10 elmts
}

Critic.prototype.getData = function() {
	let data = [this.name, this.country, this.media];
	return data;
};

Critic.prototype.getTopTen = function() {
	return this.topTen;
}