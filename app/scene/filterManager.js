function filterManager() {
	// # Private attributes
	var _self = this;
	var filterListElem = null;
	var filterList = [];
	
	// # Public attributes
	
	// # Private methods
	function constructor() {
		filterListElem = document.getElementById("filterList");
	}
	
	function drawList() {
		var html = "";
		
		for(var i = 0; i < filterList.length; ++i) {
			html += `
				<div class="filterItem">
					<span>` + filterList[i][0] + `</span>
					<button onclick="scene.filterManager.removeFilter(` + i + `)">
					</button>
				</div>`;
		}
		
		filterListElem.innerHTML = html;
	}
	
	function drawCircles() {
		d3
			.select('#movies')
			.selectAll('circle')
			.style('opacity', _self.isInFilter);
	}
	
	function addFilter(filter) {
		if(isFilterActive(filter)) return;
		
		filterList.push(filter);
		drawList();
		drawCircles();
	}
	
	function isFilterActive(filter) {
		for(var i = 0; i < filterList.length; ++i) {
			if(filter[0] === filterList[i][0] && filter[1] === filterList[i][1])
				return true;
		}
		
		return false;
	}
	
	// # Public methods
	_self.addDirectorFilter = function() {
		addFilter([scene.movie.director, 0]);
	};
	
	_self.addYearFilter = function() {
		addFilter([scene.movie.year, 1]);
	};
	
	_self.addGenreFilter = function() {
		for(var i = 0; i < scene.movie.genre.length; ++i) {
			addFilter([scene.movie.genre[i], 2]);
		}
	};
	
	_self.removeFilter = function(index) {
		filterList.splice(index, 1);
		drawList();
		drawCircles();
	}
	
	_self.isInFilter = function(movie) {
		var genreFilters = 0;
		var genreValid   = 0;
		
		for(var i = 0; i < filterList.length; ++i) {
			if(filterList[i][1] === 0 && filterList[i][0] !== movie.director) {
				return 0.1;
			}
			else if(filterList[i][1] === 1 && filterList[i][0] !== movie.year) {
				return 0.1;
			}
			else if(filterList[i][1] === 2) {
				genreFilters += 1;
				
				for(var j = 0; j< movie.genre.length; ++j) {
					if(filterList[i][0] === movie.genre[j]) {
						genreValid += 1;
					}
				}
			}
		}
		
		if(genreFilters === genreValid)
			return 1;
		else
			return 0.1;
	}
	
	// # Execution
	constructor()
}
