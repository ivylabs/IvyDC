var gaugeComponent = BaseComponent.extend({

	update : function() {
		var myself=this;

		$("#"+myself.htmlObject).empty();

		if(!myself.queryDefinition){
			console.log("query not defined");
			dataViewerHTML = "<b>We need to set a query with two fields of data!</b>";
		} else {

			Dashboards.log("Datasource has been added");
			
			var query = new Query(myself.queryDefinition);
			
			query.fetchData(myself.parameters, function(values) {
				
				console.log("Data:");
				console.log(values);
				
				var actualValue, minValue, maxValue, title, subtitle;
				
				if(myself.label == undefined){
					title = values.resultset[0][0];
				} else {
					title = myself.label;
				}
				
				if(myself.subTitle == undefined){
					subTitle = "";
				} else {
					subTitle = myself.subTitle;
				}
				
				if(myself.maxValue == undefined){
					minValue = values.resultset[0][2];
				} else {
					minValue = myself.minValue;
				}
				
				if(myself.maxValue == undefined){
					maxValue = values.resultset[0][3];
				} else {
					maxValue = myself.maxValue;
				}
				
				var gageConf = {
					id: myself.htmlObject, 
					value: values.resultset[0][1], 
					min: minValue,
					max: maxValue,
					title: title,
					label:subTitle,
					gaugeWidthScale:myself.gaugeWidthScale,
          			symbol: myself.gaugeSymbol,
        			relativeGaugeSize: true,
        			formatNumber: myself.formatNumber,
        			donut: myself.gaugeType == "doughnut"
				};

				var extension = {};
				if(myself.extensionPoints != undefined && myself.extensionPoints[0] != undefined){
					for(var i = 0; i < myself.extensionPoints.length; i++){
						extension[myself.extensionPoints[i][0]] = typeof myself.extensionPoints[i][1] === 'function'?myself.extensionPoints[i][1]():myself.extensionPoints[i][1];
					}
				}

				gageConf = $.extend({}, gageConf, extension);
				
				var g1 = new JustGage(gageConf);
				if(myself.expression!==undefined){
					$("#"+myself.htmlObject).click(function(e){
						myself.expression(e);
					});
				}
			});
		}
	}
});