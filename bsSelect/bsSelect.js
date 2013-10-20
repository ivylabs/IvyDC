 
var BSSelectBaseComponent = InputBaseComponent.extend({
	
//	defaultWrapper: "<div class='btn-group'>"+
//			"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>"+
//			"Select "+
//			"</button>"+
//			"<ul class='dropdown-menu'>"+
//			"</ul>"+
//			"</div>",
			
//	defaultTemplate: "<li><a href='#'>dummy</a></li>",
	
	visible: false,

	draw: function (myArray) {
		var myself = this;
		var $htmlObject = $("#"+this.htmlObject);


		selectHTML = "<div class='btn-group'>";
		//selectHTML += "<a class='btn "+this.buttonType+" "+this.buttonSize+" dropdown-toggle' data-toggle='dropdown' href='#'>";
		
		
		selectHTML += "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' style='width:"+$htmlObject.width()+"px'>"
		selectHTML += "Select ";
		selectHTML += "</button>";
		
		

		var firstVal,
		currentVal = Dashboards.ev(Dashboards.getParameterValue(this.parameter)),
		currentIsValid = false;

		var hasCurrentVal = currentVal != null; //typeof currentVal != undefined;
		//var vid = this.valueAsId == false ? false : true;
		var vid = !!this.valueAsId;
		var hasValueSelected = false;
		var isSelected = false;

		var currentValArray = [];
		if(currentVal instanceof Array || (currentVal != null && typeof(currentVal) == "object" && currentVal.join)) {
			currentValArray = currentVal;
		} else if(typeof(currentVal) == "string"){
			currentValArray = currentVal.split("|");
		}
		
		
	
		selectHTML += "<ul class='dropdown-menu' style='width:"+$htmlObject.width()+"px'>";

		
		
		for (var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i] != null && myArray[i].length > 0) {
				var ivid = vid || myArray[i][0] == null;
				var value, label;
				if (myArray[i].length > 1) {
					value = "" + myArray[i][ivid ? 1 : 0];
					label = "" + myArray[i][1];
				} else {
					value = "" + myArray[i][0];
					label = "" + myArray[i][0];
				}
				if (i == 0) {
					firstVal = value;
					firstLabel = label;
				}
				if (jQuery.inArray(""+ value, currentValArray.map(function (v) {return "" + v;})) > -1) {
					currentIsValid = true;
				}
				selectHTML += "<li><a href='#'>" + Dashboards.escapeHtml(label) + "</a></li>";
			}
		}
		
		
		
		/*
		
		$wrapperTemplate = $(this.defaultWrapper);
		$buttonTemplate = $(this.defaultTemplate);
		
		console.log($wrapperTemplate);
		
		var valIdx = this.valueAsId ? 1 : 0;
		var lblIdx = 1;
		
		
		
		var $buttons = [];
		for (var i = 0, len = myArray.length; i < len; i++){
      			var value = myArray[i][valIdx],
				label = myArray[i][lblIdx];

      			value = (value == null ? null : value.replace('"','&quot;' ));
      			label = (label == null ? null : label.replace('"','&quot;' ));

      			if(i == 0){
		        	firstVal = value;
		      	}

		      	var $newObj = $buttonTemplate.clone();
		      	$newObj.html("<a href='#'></a>");
			$newObj.text(label);
		//      	$newObj.attr("value",value);
		//      	$newObj.attr("content",value);

		      	$buttons.push($newObj);
			
		//	console.log($buttons);

		//     	$htmlObject.append($newObj);
			
			$($wrapperTemplate).find("ul").append($newObj);
			

			
			$htmlObject.append($wrapperTemplate);
      		}
      		
      		console.log($buttons);
		
 		$buttons.each(function(){
 			$(this).bind("click", function(){
 				BootstrapMultiButtonComponent.prototype.clickHandler();
 			});	
 		})

*/
	
		selectHTML += "</ul>"
		selectHTML += "</div>";
		
		
		
		

		$htmlObject.html(selectHTML);

		var replacementValue = (this.defaultIfEmpty)? firstVal : null;
		
		$("select", $htmlObject).val(replacementValue);
		
		Dashboards.setParameter(this.parameter,firstVal);
		Dashboards.processChange(this.name);
		
		var currentParameter = Dashboards.getParameterValue(this.parameter)

		// set the default value to the first item in the data source. This needs to be changed to use the value of the parameter
		$("#" + this.htmlObject+" .btn:first-child").html(currentParameter);

	
		var myself = this;
	
		$(".dropdown-menu li a", $htmlObject).click(function(){
                        var v = $(this).text();
                       
                        // change the default value of the selector
                        $("#" + myself.htmlObject+" .btn:first-child").html(v);
                        // set the value on the component 'cache'
                        myself.setValue(v);
 
                        Dashboards.processChange(myself.name);         
                //      Dashboards.fireChange(myself.parameter,$(this).text());
               
                       
 
                });

	},
	
	_currentValue: undefined,
	
        setValue: function(v){
                this._currentValue = v;
        },
        getValue : function(){
                return this._currentValue;
        }
	
});