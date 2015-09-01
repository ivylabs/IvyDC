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
var IonRangeSliderComponent = BaseComponent.extend({
    value: [],
    update : function() {
        var myself = this;
        $("#" + this.htmlObject).empty();
        this.ph = $("#" + this.htmlObject);


        if(this.parameter != undefined && this.parameter != null){
          var paramVal = Dashboards.getParameterValue(this.parameter);
          if(myself.slideType==="single"){
            myself.value[myself.name] = paramVal[0];
            myself.fromRange = paramVal[0];
          }else{
            myself.value[myself.name] = [paramVal[0], paramVal[1]];
            myself.fromRange = paramVal[0];
            myself.toRange = paramVal[1];
          }
        }
        
        var sliderData = {};
        
        if(myself.queryDefinition && Dashboards.objectToPropertiesArray(this.queryDefinition).length > 0){

            // create a query object
            this.queryState = Dashboards.getQuery(myself.queryDefinition);

            /* The non-paging query handler only needs to concern itself
             * with handling postFetch and calling the draw function
             */
            var success = _.bind(function(data){
                this.rawData = data;
                this.processResponse(data);    
            },this);
            
            this.queryState.setAjaxOptions({async:true});
            this.queryState.fetchData(myself.parameters, success);

        }
    },
    getValue : function() {
        return this.value[this.name];
    },
    processResponse : function(json) {
        if(json.resultset.length>0 && json.resultset[0].length>0){ this.fromRange = json.resultset[0][0]; }
        if(json.resultset.length>0 && json.resultset[0].length>1){ this.toRange = json.resultset[0][1]; }
        if(json.resultset.length>0 && json.resultset[0].length>2){ this.minRange = json.resultset[0][2]; }
        if(json.resultset.length>0 && json.resultset[0].length>3){ this.maxRange = json.resultset[0][3]; }
        
        $("html head:first #skinCss").remove();
        $("html head:first").append("<link rel=\"stylesheet\" href=\""+window.location.protocol+"//"+window.location.host+webAppPath+"/api/repos/IvyDC/resources/components/ionRangeSlider/css/"+this.skins+".css\" id=\"skinCss\" />");

        var inputSlider = $("<input type=\"text\" class=\"form-control\" />");
        
        // Avoid duplicate sliders that happens when this method is called repeatedly.
        if (this.ph.find("input").length == 0) {
            this.ph.append(inputSlider);
        }

        var myself = this;

        var sliderConf = {
            type: this.slideType,
            hideMinMax: this.hideMinMax,
            hideFromTo: this.hideFromTo,
            prettify: this.prettify,
            hasGrid: this.hasGrid,
            onFinish: function (obj) {
                if(myself.slideType==="single"){
                    myself.value[myself.name] = obj.fromNumber;
                }else{
                    myself.value[myself.name] = [obj.fromNumber, obj.toNumber];
                }
                Dashboards.processChange(myself.name);
            }
        };

        if(this.minRange) { sliderConf["min"] = this.minRange; }
        if(this.maxRange) { sliderConf["max"] = this.maxRange; }
        if(this.fromRange) { sliderConf["from"] = this.fromRange; }
        if(this.toRange) { sliderConf["to"] = this.toRange; }
        if(this.stepValue) { sliderConf["step"] = this.stepValue; }
        if(this.prefixValue) { sliderConf["prefix"] = this.prefixValue; }
        if(this.postfixValue) { sliderConf["postfix"] = this.postfixValue; }
        if(this.maxPostfix) { sliderConf["maxPostfix"] = this.maxPostfix; }

        this.sliderConf = sliderConf;

        this.ph.find("input").ionRangeSlider(sliderConf);


        // Work around for responsive purposes
        this.reRenderSlider = function (){ 
            this.update();
        }

        var timer;
        $(window).bind('resize', function(){
         timer && clearTimeout(timer);
         timer = setTimeout(this.reRenderSlider, 150);
        });
    }
});
