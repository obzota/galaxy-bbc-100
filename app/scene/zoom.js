function initializeZoomEvents() {
	function zoomed() {
		d3.select("#movies").attr("transform", d3.event.transform);
		d3.select("#critics").attr("transform", d3.event.transform);
		d3.select("#moviesSelected").attr("transform", d3.event.transform);
		d3.select("#rank").attr("transform", d3.event.transform);
	}

	d3.select("#scene")
	.style("pointer-events", "all")
	.call(d3.zoom()
		.scaleExtent([1 / 2, 4])
		.on("zoom", zoomed));
}
