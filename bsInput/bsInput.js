var BSInputComponent = BaseComponent.extend({
	update : function() {
		var myself = this;	
		var ph = $("#" + this.htmlObject);
		
		if(!this.label){
			this.label="";
		}

		var inputHTML = "<input type='"+this.inputType+"' value='"+Dashboards.getParameterValue(this.parameter)+"' class='form-control' id='"+this.name+"'>";
		
		ph.html(inputHTML);
			
		$("body").on('change', ph, function(){
			Dashboards.processChange(myself.name);
		});  

	},
	getValue : function() {
		return $("#"+this.name).val();
	}
}); 
