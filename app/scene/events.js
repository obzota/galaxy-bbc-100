function EventHandler(scene) {
	this.scene = scene;

	this.callbacks = new d3.map();
	this.callbacks.set("r", () => (scene.reset()));
}

EventHandler.prototype.onKeyPressed = function(event) {

};