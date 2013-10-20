var BSButtonComponent = BaseComponent.extend({
	update : function() {
		var myself = this;
		
		var ph = $("#" + this.htmlObject);

		var innerButtonHTML = "";

		if(!this.label){
			this.label = "";
		}

		if(this.prependIcon){
			innerButtonHTML += "<i class='"+this.buttonIcon+" icon-white'></i> "+this.label;
		} else {
			innerButtonHTML += this.label+" <i class='"+this.buttonIcon+" icon-white'></i>";
		}
		
		var b = $("<button type='button' class='btn btn-default' style='width:"+ph.width()+"px'>Default</button>").html(innerButtonHTML).unbind("click").bind("click", function(){
			return myself.expression.apply(myself,arguments);
		});

		/*
		var b = $("<button class='btn "+this.buttonType+" "+this.buttonSize+"' type='button'/>").html(innerButtonHTML).unbind("click").bind("click", function(){
			return myself.expression.apply(myself,arguments);
		});
		*/
		
		ph.html(b);
		
		/*
		if (typeof this.buttonStyle === "undefined" || this.buttonStyle === "themeroller"){
			b.button();
			b.appendTo($("#"+ this.htmlObject).empty());
		}
		*/
	}
}); 
