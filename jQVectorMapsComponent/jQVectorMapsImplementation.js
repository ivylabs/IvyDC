var jQVectorMapComponent = BaseComponent.extend({
	update : function() {
		if(this.vectorMap){
	    	$("#"+this.htmlObject).empty();
	    	$(".jvectormap-label").remove();
		}

		var myself=this;
		
		var mapData = {};
		
		if (this.parameters == undefined) {
			this.parameters = [];
		};
		
		// check if the components datasource is set
		if(!myself.queryDefinition){
			console.log("query not defined");
		} else {
			console.log("datasource has been added");
				// create a query object
				var query = new Query(myself.queryDefinition);
				
				// fire the query objects fetchdata method
				// no params and no callback
				query.fetchData(myself.parameters, function(values) {

					mapData = Dashboards.propertiesArrayToObject(values.resultset);
					
				});

		}
		
		var mapDefinition = {
				map: this.mapFile,
				series: {
			      regions: [{
			        values: mapData,
			        scale: [this.mapLowScaleColor, this.mapHighScaleColor],
			        normalizeFunction: this.mapNormalizeFunction
			      }]
			    },
				color: this.mapColor,
				backgroundColor: this.mapBackgroundColor,
			//	hoverColor: this.mapHoverColor,
				// set to fasle at the moment. we need to test for this
				hoverColor: false,
				hoverOpacity : this.mapHoverOpacity,
				onRegionClick: function(event, code){
					myself.mapClickFunction(event, code);
				},
				onRegionLabelShow: function(event, label, code){
					if(myself.mapOnRegionShowFunction){
						var labelString = myself.mapOnRegionShowFunction(event, label.text(), code, mapData);
						
						label.html(labelString);
					};
				}
				
		};

		this.vectorMap=$("#"+this.htmlObject).vectorMap(mapDefinition);
		
	},
	
	renderMap: function(){
		
	}
});