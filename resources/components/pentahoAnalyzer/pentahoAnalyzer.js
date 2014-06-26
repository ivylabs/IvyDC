var PentahoAnalyzerComponent = BaseComponent.extend({

  update: function(){

    this.clear();

    if (this.analyzerFilePath && this.analyzerFilePath.substr(0,1) != "/") {
      this.analyzerFilePath = "/" + this.analyzerFilePath;
    }

    var options = this.getOptions();
    var url = webAppPath + '/api/repos/';
    var myself=this;

    if(this.viewMode==="new" && !this.urlParametersDefinition.catalog && this.urlParametersDefinition.catalog != "" && !this.urlParametersDefinition.cube && this.urlParametersDefinition.cube != ""){
    	url += "xanalyzer/service/selectSchema";
    }else if (this.viewMode==="new"){
    	url += "xanalyzer/editor";
    }else if (this.viewMode==="view"){
    	url += this.analyzerFilePath.replace(/\//g, ":") + "/viewer";
    }else{
    	url += this.analyzerFilePath.replace(/\//g, ":") + "/editor";
    }

    var height = this.height?this.height : "480px";
    var width = this.width? this.width : $("#"+this.htmlObject).parent().width() - 30 + "px";

    var iFrameHTML = this.generateIframe(this.htmlObject,url,options,height,width);
    $("#"+this.htmlObject).html(iFrameHTML);

    // Work around for responsive purposes
    myself.reRenderSlider = function (){ 
      $("#"+myself.htmlObject+ " iframe").attr("width", $("#"+myself.htmlObject).parent().width() - 30 + "px");
    }

    var timer;
    $(window).bind('resize', function(){
      timer && clearTimeout(timer);
      timer = setTimeout(myself.reRenderSlider, 150);
    });

  },

  getOptions: function() {
    
    var myself = this;

    var options = {
      showFieldList: this.urlParametersDefinition.showFieldList == undefined? false: this.urlParametersDefinition.showFieldList,
      showRepositoryButtons: this.urlParametersDefinition.showRepositoryButtons == undefined? false: this.urlParametersDefinition.showRepositoryButtons,
      cube: this.urlParametersDefinition.cube,
      catalog: this.urlParametersDefinition.catalog
    };

	var extension = {};
	if(myself.extensionPoints != undefined && myself.extensionPoints[0] != undefined){
		for(var i = 0; i < myself.extensionPoints.length; i++){
			extension[myself.extensionPoints[i][0]] = typeof myself.extensionPoints[i][1] === 'function'?myself.extensionPoints[i][1]():myself.extensionPoints[i][1];
		}
	}

	options = $.extend({}, options, extension);

    // process params and update options
    $.map(this.parameters,function(k){
      options[k[0]] = k.length==3?k[2]: Dashboards.getParameterValue(k[1]);
    });

    return options;
  },

  generateIframe: function(htmlObject,url,parameters,height,width) {
    var iFrameHTML = '<iframe id="iframe_'+ htmlObject + '"' +
    ' frameborder="0"' +
    ' height="' + height + '"' +
    ' width="' + width + '"' +
    ' src="' + url + "?";

    iFrameHTML += $.param(parameters, true);
    iFrameHTML += "\"></iframe>";
    
    return iFrameHTML;
  }
});
