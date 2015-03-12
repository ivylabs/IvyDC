/*!
* Copyright 2014 - 2014 Ivy Information Systems Ltd.  All rights reserved.
* 
* This software was developed by Webdetails and is provided under the terms
* of the Mozilla Public License, Version 2.0, or any later version. You may not use
* this file except in compliance with the license. If you need a copy of the license,
* please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
*
* Software distributed under the Mozilla Public License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
* the license for the specific language governing your rights and limitations.
*/
var jQVectorMapComponent = BaseComponent.extend({
	update : function() {
		if(this.vectorMap){
			this.clear();
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
				
				var mapDefinition = {
						map: myself.mapFile,
						series: {
					      regions: [{
					        values: mapData,
					        scale: [myself.mapLowScaleColor, myself.mapHighScaleColor],
					        normalizeFunction: myself.mapNormalizeFunction
					      }]
					    },
					    regionStyle: {
			              initial: {
			                fill: myself.mapColor
			              }
			            },
						backgroundColor: myself.mapBackgroundColor,
						hoverOpacity : myself.mapHoverOpacity,
						onRegionClick: function(event, code){
							if(myself.mapClickFunction){
								myself.mapClickFunction(event, code);
							}
						},
						onRegionLabelShow: function(event, label, code){
							if(myself.mapOnRegionShowFunction){
								var labelString = myself.mapOnRegionShowFunction(event, label.text(), code, mapData);
								
								label.html(labelString);
							};
						}
						
				};

				myself.vectorMap=$("#"+myself.htmlObject).vectorMap(mapDefinition);
				if(myself.mapClickFunction){
					$("#"+myself.htmlObject+" path.jvectormap-region").css("cursor","pointer");
				}
				
			});

		}
	}
	
});