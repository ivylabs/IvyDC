var summaryComp = BaseComponent.extend({

	GUID: function(){
		function S4() { return (((1+Math.random())*0x10000)|0).toString(16).substring(1); };
		return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
	},

	summariesObj: [],

	gridSize: function(rowNum){
		if(rowNum == 1){
			return [1, "col-md-12 span-24"];
		}else if(rowNum > 3){
			return [4, "col-md-3 span-6"];
		}

		return [2, "col-md-6 span-12"];
	},
    template: function(){ 
        return "<div class='summary'>" +
			"<img class='click details' src='"+webAppPath+"/api/repos/IvyDC/resources/components/summaryComponent/click.png' />" +
			"<span class='details'><b>{{label}}</b><span>" +
			"<h2 style='margin:0px;padding-left:20px;'>{{value}} {{valueLabel}}</h2>" +
			"<div class='{{arrowType}} arrow'><b>{{subValue}} {{subValueLabel}}</b></div>" +
			"</div>";
    },

	update : function() {
	
		var myself=this;
		
		if (this.parameters == undefined) {
			this.parameters = [];
		};

		this.label = this.label || "";
		
		var summaryHTML = "";
		
		if(!myself.queryDefinition){
			console.log("Query not defined");
			summaryHTML = "<b>No Data</b>";
			$("#"+myself.htmlObject).html(summaryHTML);
		} else {
			console.log("Datasource has been added");

			var query = new Query(myself.queryDefinition);
			
			
			query.fetchData(myself.parameters, function(values) {
				
				var gridConf = myself.gridSize(values.resultset.length);
				var resultset = values.resultset;	
				
				for(var idx = 0; idx<resultset.length; idx++){
					if(idx==0||idx%gridConf[0]==0){
						currRow = myself.GUID();
						$("#"+myself.htmlObject).append("<div class='row' id ="+currRow+"></div>");
					}

					currCol = myself.GUID();
					$("#"+currRow).append("<div class='"+gridConf[1]+"' id ="+currCol+"></div>");

					var val1 = resultset[idx][1];
					var val2 = resultset[idx][2];
					
					var summaryLabel = myself.label;
					if(summaryLabel==undefined || summaryLabel==""){
						summaryLabel = resultset[idx][0];
					}
					
					var valueLabel = myself.valueLabel;
					if((valueLabel==undefined || valueLabel=="") && resultset[idx][3] != undefined){
						valueLabel = resultset[idx][3];
					}

					var subValueLabel = myself.subValueLabel;
					if((subValueLabel==undefined || subValueLabel=="") && resultset[idx][4] != undefined){
						subValueLabel = resultset[idx][4];
					}
					
					if(myself.valueLabelFormat != undefined){
						val1 = sprintf(myself.valueLabelFormat,resultset[idx][1]);
					}
					
					if(myself.subValueLabelFormat != undefined){
						val2 = sprintf(myself.subValueLabelFormat,resultset[idx][2]);
					}
					
					var arrow = "upgreen";
					decreaseArrow = "up";
					decreaseColor = "green";
					
					if(myself.increaseArrow == "up"){
						decreaseArrow = "down";
					}
					
					if(myself.increaseColor == "green"){
						decreaseColor = "red";
					}
					if(val1 == val2){
						arrow = "equals"
					}else if(val1 > val2){
						arrow = myself.increaseArrow+""+myself.increaseColor;
					} else {
						arrow = decreaseArrow+""+decreaseColor;
					}

					summaryHTML= Mustache.render(myself.template(), {
			            label: summaryLabel || "", 
			            value: val1 || "",
			            valueLabel: valueLabel || "",
			            arrowType: arrow || "",
			            subValue: val2 || "",
			            subValueLabel: subValueLabel || ""
			        });
			        
					$("#"+currCol).html(summaryHTML);
					if(myself.clickActionFunction==undefined){
						$("#"+currCol).find("img.click.details").remove();
					}
					myself.summariesObj[idx] = $("#"+currCol);
					
					if(myself.clickActionFunction!==undefined){
						$("#"+currCol + " .details").click(function(e){
							myself.clickActionFunction(e, myself)
						});
					}
				}
			});
			
		}

	}
});