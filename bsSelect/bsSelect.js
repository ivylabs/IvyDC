 
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
		var width = this.buttonWidth && this.buttonWidth != "" ? this.buttonWidth : $htmlObject.width();
		if (width > 0) {
			width = width + "px";
		} else {
			width = "auto";
		}
		var caret =  "  <span class='caret'></span>";
		selectHTML = "<div class='btn-group'>";
		selectHTML += "<button type='button' class='btn "+this.buttonType+" "+this.buttonSize+" dropdown-toggle' data-toggle='dropdown' href='#' style='width:"+ width +";'>";
		selectHTML += "Select ";
		selectHTML += caret + "</button>";

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
		
		
	
		selectHTML += "<ul class='dropdown-menu' style='width:"+ width +";'>";

		
		var values = {};
		for (var i = 0, len = myArray.length; i < len; i++) {
			if (myArray[i] != null && myArray[i].length > 0) {
				var ivid = vid || myArray[i][0] == null;
				var value, label;
				if (myArray[i].length > 1) {
					value = "" + myArray[i][ivid ? 1 : 0];
					label = "" + myArray[i][1];
					values[value] = label;
				} else {
					value = "" + myArray[i][0];
					label = "" + myArray[i][0];
					values[value] = label;
				}
				if (i == 0) {
					firstVal = value;
					firstLabel = label;
				}
				if (jQuery.inArray(""+ value, currentValArray.map(function (v) {return "" + v;})) > -1) {
					currentIsValid = true;
				}
				selectHTML += "<li><a href='#" + Dashboards.escapeHtml(value) + "'>" + Dashboards.escapeHtml(label) + "</a></li>";
			}
		}
		
		selectHTML += "</ul>"
		selectHTML += "</div>";
		
		
		
		

		$htmlObject.html(selectHTML);

		
		var currentParameter = Dashboards.getParameterValue(this.parameter)

		if (currentParameter) {
			// set the default value to the first item in the data source. This needs to be changed to use the value of the parameter
			$("#" + this.htmlObject+" .btn:first-child").html(values[currentParameter] + caret);
			$("#" + this.htmlObject+" .btn:first-child").attr('#' + currentParameter);
		} else {
			var replacementValue = firstVal;
			var replacementLabel = firstLabel;
			$("#" + this.htmlObject+" .btn:first-child").attr('href', '#' + replacementValue);
			$("#" + this.htmlObject+" .btn:first-child").html(replacementLabel + caret);
			
			Dashboards.fireChange(this.parameter,firstVal);
			
		}

	
		var myself = this;
	
		$("#" + this.htmlObject + " .dropdown-menu li a").click(function(e){
                        var v = $(this).attr('href').replace('#','');
                        var t = $(this).text();
                       
                        // change the default value of the selector
                        $("#" + myself.htmlObject+" .btn:first-child").html(t + caret);
                        // set the value on the component 'cache'
                        myself.setValue(v);
                        Dashboards.processChange(myself.name);         
                //      Dashboards.fireChange(myself.parameter,$(this).text());

                		e.preventDefault();
               
                       
 
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