var exportData = BaseComponent.extend({

	compsEx: ['ccc','Table'],

	selectCompsTitle: "Select Components to Export",

	update : function() {
		var myself=this;
		
		// get an array of all dashboard components
		var dbComponentsArr = Dashboards.components; // get the array of objects
		
		
		
		// filter dashboards components array
		var validComponents = $.grep(dbComponentsArr,function(obj){
			for (var i = 0; i < myself.compsEx.length; i++) {
				if(obj.type.indexOf(myself.compsEx[i]) >= 0 ){
					return obj;
				}
			};
		});
		
		console.log(validComponents);
		

		// generate popup HTML
		var exportHTML = "";
		exportHTML += "<div id='"+myself.htmlObject+"_DIV_EXPORT' style='display:none;'>";
		exportHTML += "<div id='"+myself.htmlObject+"_DIV_SHOW_EXPORT'>";
		exportHTML += "<div id='"+myself.htmlObject+"_exportForm' style='padding-right: 15px;'>";
		exportHTML += "<div class='clearfix ' style='height:30px;'>";
		exportHTML += "<h2 style='padding-left: 10px;'>"+myself.selectCompsTitle+"</h2> ";
		exportHTML += "</div>";
		
		exportHTML += "<ul id='"+myself.htmlObject+"_chartExportList' class='chartExportList' >";
		
		// loop through each component and generate list HTML
		$.each(validComponents, function(index, obj) {
			
			var componentTitle = "";

			if(obj.chartDefinition.title == undefined){
				componentTitle = "Table Data ("+obj.name.substring(7)+")";
			} else {
				componentTitle = obj.chartDefinition.title+" Chart";
			}

			if(typeof obj.queryState==undefined){
				exportHTML += "<li id='"+myself.htmlObject+"_ex"+index+"' style=''><span>Export "+componentTitle+"</span></li>";
			} else {
				exportHTML += "<li id='"+myself.htmlObject+"_ex"+index+"' style=''><span>Export "+componentTitle+"</span></li>";
			}
		});
		
		// finish popup HTML
		exportHTML += "</ul>"
		
		exportHTML += "</div></div></div></div>";
		
		// append popup HTML to blueprint container
		$('body .container:first').append(exportHTML);
		
		// loop through list items
		$('#'+myself.htmlObject+'_chartExportList > li').each(function(index, value){
			
			// assign a click function to each li
			$(this).click(function(){
				
				// attach execution exportData method to click action
				validComponents[index].queryState.exportData('xls');
			});

		});

		// attach export link to dashboard HTML Object
		$("#"+this.htmlObject).html("<a href='#"+myself.htmlObject+"_DIV_SHOW_EXPORT' id='"+myself.htmlObject+"_exportClick'>"+this.label+"</a>");
		
		$('#'+myself.htmlObject+'_exportClick').fancybox({
    		'autoDimensions'	: false,
    		'padding'			: "0px",
			'width'         	: 500,
			'height'        	: 'auto',
			'autoScale'			: true,
			'transitionIn'		: 'none',
			'transitionOut'		: 'none'
		});
	}
});