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
	
	function draw() {
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
	
	function addFilter(filter) {
		if(isFilterActive(filter)) return;
		
		filterList.push(filter);
		draw();
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
		draw();
	}
	
	// # Execution
	constructor()
}
