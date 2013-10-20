var BSButtonGroupComponent = BaseComponent.extend({
  update : function() {
    var myself = this;
    var b = $("<button class='btn' type='button'/>").text(this.label).unbind("click").bind("click", function(){
        return myself.expression.apply(myself,arguments);
    });
    if (typeof this.buttonStyle === "undefined" || this.buttonStyle === "themeroller")
      b.button();
    b.appendTo($("#"+ this.htmlObject).empty());
  }
}); 