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
(function (window) {

	var opts = {
		width: 600,
		height: 400,
		gap: 4,
		labelRelief: 15,
		colorScheme: 20,
		showValue: true,
		showPercent: true,
		labelSpan: 1,
		tooltip: true,
		onTooltip: function (data) {
			return data.label + ": " + data.value;
		},
		showLabel: true,
		valueColor: "#fff",
		percentColor: "#fff",
		labelColor: true,
		areaColors: [],
		areaMouseOver: true,
		opacityColorMouseOver: 0.9,
		areaOnClick: null,
		formatValue: null
	};

	/**
	 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
	 * @param obj1
	 * @param obj2
	 * @returns obj3 a new object based on obj1 and obj2
	 */
	function _mergeOptions(obj1, obj2){
	    var obj3 = {};
	    for (var attrname in obj1) { if(obj1[attrname]!=undefined) obj3[attrname] = obj1[attrname]; }
	    for (var attrname in obj2) { if(obj2[attrname]!=undefined) obj3[attrname] = obj2[attrname]; }
	    return obj3;
	}


	_processFunnelChartData = function(data){
		var chartData=[];
		for(var i=0;i<data.resultset.length;i++){
			chartData.push({ "label": data.resultset[i][0], "value": data.resultset[i][1] });
		}
		chartData.sort(function(a, b){return b.value-a.value});
		return chartData;
	};

	FunnelChart = function(options) {
		this.options = _mergeOptions(opts, options||opts);
		if(!this.options.data){ console.log("No data found!"); throw "No data found!";}
		this.options.formattedData = _processFunnelChartData(this.options.data);
		this.dataField = [this.options.data.metadata[0].colName,this.options.data.metadata[1].colName];
		this._createTooltipEl();
	}

	FunnelChart.prototype.update = function (options) {
		if(options) this.options = _mergeOptions(this.options, options||this.options);
		window.document.getElementById(this.options.htmlObjectChart).textContent = "";
		this.render();
	};

	FunnelChart.prototype.render = function () {
		var myself = this;
		var options = this.options;
	    
		this.chartFunnel = Raphael(this.options.htmlObjectChart, options.width, options.height);  

		this.wf = options.width / 406.01;
		this.hf = options.height / 325.01;
		this.fc = 139 * (options.width / (options.showLabel?406.1:287)) + 5;   
	    

	    //this.convertData(this);
	    
	    var total = 0;
	    
	    for (var i = 0; i < options.formattedData.length; i++) {
	        total += options.formattedData[i]["value"];
	    }
	    
	    var funnelHeightRatio = (options.height  - options.gap * (options.formattedData.length - 1) - options.labelRelief * options.formattedData.length) / total;        

	    var colors = this.generateColors(options.formattedData.length, options.colscheme);
	    if(options.areaColors.length>0){
		    colors=options.areaColors;
	    	if(options.areaColors.length<options.formattedData.length){
	    		var missingColor=(options.formattedData.length/options.areaColors.length)-1;
	    		for (var i = 0; i < missingColor; i++) {
	    			colors.push.apply(colors, options.areaColors);
	    		};
	    	}
	    }
	    
	    var is_label_visible = false,
	        leave_timer;
	    
	    var currY = 0;
	    var df = myself._traverseToDataField(this.data, options.dataField);    
	    if (df instanceof Array) {
	        df = df;
	    }
	    else {
	        df = [df];
	    }
	    
	    var first;
	    
	    for (i = 0; i < options.formattedData.length; i++) {
	        var crect;
	        if (i != 0) {
	            this.chartFunnel.rect(0, currY, options.width, options.gap).attr({fill:"#fff", stroke:"#fff"});          
	            crect = this.chartFunnel.rect(0, currY + options.gap, options.width, funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief).attr({fill:colors[i], stroke:"#fff"});
	            currY += options.gap + funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief;                
	        }
	        else {
	            crect = this.chartFunnel.rect(0, 0, options.width, funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief).attr({fill:colors[i], stroke:"#fff"});
	            currY += funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief;           
	            first = options.formattedData[i]["value"];    
	        }

	        if (options.areaMouseOver) {
                $(crect.node).hover(function (e) {
                	$(e.target).attr({opacity:options.opacityColorMouseOver});
                },function (e) {
                	$(e.target).removeAttr("opacity");
                });
	        }

	        if(typeof options.areaOnClick == "function"){
	            (function (data, lbl, func, org) {
	                $(crect.node).hover(function (e) {
	                	$(e.target).css({cursor:"pointer"});
	                },function (e) {
	                	$(e.target).css({cursor:"auto"});
	                });
	                $(crect.node).click(function (e) {
	                    func({label:lbl, value:data, total:total, first:first, raw:org});
	                });
	            })(options.formattedData[i]["value"], options.formattedData[i]["label"], options.areaOnClick, df[i]);
	        }
	        
	        if (options.tooltip) {
	            (function (data, lbl, func, org) {
	                $(crect.node).hover(function (e) {
	                    clearTimeout(leave_timer);
	                    var tip = func({label:lbl, value:data, total:total, first:first, raw:org});
	                    myself._tooltipShow(e.pageX, e.pageY, tip);
	                    is_label_visible = true;
	                }, function () {
	                    leave_timer = setTimeout(function () {
	                        myself._tooltipHide();
	                        is_label_visible = false;
	                    }, 2);
	                });
	            })(options.formattedData[i]["value"], options.formattedData[i]["label"], options.onTooltip, df[i]);
	            
	            (function (data, lbl, func, org) {
	                $(crect.node).mousemove(function (e) {
	                    if (is_label_visible) {
	                        clearTimeout(leave_timer);
	                        var tip = func({label:lbl, value:data, total:total, first:first, raw:org});
	                        myself._tooltipShow(e.pageX, e.pageY, tip);
	                    }
	                });
	            })(options.formattedData[i]["value"], options.formattedData[i]["label"], options.onTooltip, df[i]);
	        }
	    }   
		

	    if(!options.showLabel){
		    var el1 = this.chartFunnel.ellipse(-560 * this.wf + 5 + 663 * this.wf / 2, -136 * this.hf + 1007.9 * this.hf / 2, 700 * this.wf / 2, 1007.9 * this.hf / 2);
		    var el2 = this.chartFunnel.ellipse(293 * this.wf + 5 + 663 * this.wf / 2, -136 * this.hf + 1007.9 * this.hf / 2, 700 * this.wf / 2, 1007.9 * this.hf / 2); 
	    
		    el1.attr({fill:"#fff", opacity:1, stroke:"#fff"});
		    el2.attr({fill:"#fff", opacity:1, stroke:"#fff"});
	    }else{
		    var el1 = this.chartFunnel.ellipse(-560 * this.wf + 5 + 663 * this.wf / 2, -136 * this.hf + 1007.9 * this.hf / 2, 663 * this.wf / 2, 1007.9 * this.hf / 2);
		    var el2 = this.chartFunnel.ellipse(173 * this.wf + 5 + 663 * this.wf / 2, -136 * this.hf + 1007.9 * this.hf / 2, 663 * this.wf / 2, 1007.9 * this.hf / 2); 
		    el1.attr({fill:"#fff", opacity:0.8, stroke:"#fff"});
		    el2.attr({fill:"#fff", opacity:0.8, stroke:"#fff"});
		}
	    
	    currY = 0;
	    for (i = 0; i < options.formattedData.length; i++) {
	        var t2;
	        if (i != 0) {
	            var t = this.chartFunnel.text(options.width, currY + options.gap + funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief, options.showLabel?options.formattedData[i]["label"]:"").attr({fill:options.labelColor?options.labelColor:colors[i]});
	            t.attr({"font-size":12});              
	            var bbox = t.getBBox();
	            t.translate(-bbox.width/2 - 2 * options.labelSpan, -bbox.height/2 - options.labelSpan);
	            var str = options.showValue?options.formattedData[i]["value"]:"";
	            if ((options.formattedData[0]["value"] != 0) && options.showPercent) {
	                str += "(" + (options.formattedData[i]["value"] * 100/ options.formattedData[0]["value"]).toFixed() + "%)";
	            }
	            if(typeof options.formatValue == "function"){
	            	str = options.formatValue(options.formattedData[i]["value"] , (options.formattedData[i]["value"] * 100/ options.formattedData[0]["value"]).toFixed(), options.formattedData[i], options);
	            }
	            t2 = this.chartFunnel.text(this.fc, currY + options.gap + funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief, str).attr({fill:options.valueColor});
	            t2.attr({"font-size":10});
	            bbox = t2.getBBox();
	            t2.translate(0, -bbox.height/2 - options.labelSpan);
	            currY += options.gap + funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief;                
	        }
	        else {
	            var t = this.chartFunnel.text(options.width, funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief, options.showLabel?options.formattedData[i]["label"]:"").attr({fill:options.labelColor?options.labelColor:colors[i]});            
	            t.attr({"font-size":12});  
	            var bbox = t.getBBox();
	            t.translate(-bbox.width/2 - 2 * options.labelSpan, -bbox.height/2 - options.labelSpan);            
	            var str = options.showValue?options.formattedData[i]["value"]:"";
	            if ((options.formattedData[0]["value"] != 0) && options.showPercent) {
	                str += "(" + (options.formattedData[i]["value"] * 100/ options.formattedData[0]["value"]).toFixed() + "%)";
	            }
	            if(typeof options.formatValue == "function"){
	            	str = options.formatValue(options.formattedData[i]["value"] , (options.formattedData[i]["value"] * 100/ options.formattedData[0]["value"]).toFixed(), options.formattedData[i], options);
	            }
	            t2 = this.chartFunnel.text(this.fc, funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief, str).attr({fill:options.valueColor});
	            t2.attr({"font-size":10});
	            bbox = t2.getBBox();
	            t2.translate(0, -bbox.height/2 - options.labelSpan);
	            currY += funnelHeightRatio * options.formattedData[i]["value"] + options.labelRelief;                
	        }
	    }   
	    this.chartFunnel.rect(0, 0, options.width-1, options.height-1);
	};

	FunnelChart.prototype._createTooltipEl = function () {
	    this.tooltipEl = document.createElement('div');
	    this.tooltipEl.setAttribute('id', 'ttipRRR'); // a random name to avoid conflicts. 
	    this.tooltipEl.style.display = 'none';
	    this.tooltipEl.style.width = 'auto';
	    this.tooltipEl.style.height = 'auto';
	    this.tooltipEl.style.margin = '0';
	    this.tooltipEl.style.padding = '5px';
	    this.tooltipEl.style.backgroundColor = '#ffffff';
	    this.tooltipEl.style.borderStyle = 'solid';
	    this.tooltipEl.style.borderWidth = '1px';
	    this.tooltipEl.style.borderColor = '#444444';
	    this.tooltipEl.style.opacity = 0.85;
	    
	    this.tooltipEl.style.fontFamily = 'Fontin-Sans, Arial';
	    this.tooltipEl.style.fontSize = '12px';
	    
	    this.tooltipEl.innerHTML = "<b>IvyDC</b> tooltip demo <br/> works damn fine!";
	    document.body.appendChild(this.tooltipEl);    
	};

	FunnelChart.prototype._getWindowWidth = function (){
	    var innerWidth;
	    if (navigator.appVersion.indexOf('MSIE')>0) {
		    innerWidth = document.body.clientWidth;
	    } 
	    else {
		    innerWidth = window.innerWidth;
	    }
	    return innerWidth;	
	};

	FunnelChart.prototype._getWindowHeight = function (){
	    var innerHeight;
	    if (navigator.appVersion.indexOf('MSIE')>0) {
		    innerHeight = document.body.clientHeight;
	    } 
	    else {
		    innerHeight = window.innerHeight;
	    }
	    return innerHeight;	
	};

	FunnelChart.prototype._tooltipShow = function (x, y, content) {
		var w = this.tooltipEl.style.width;
		var h = this.tooltipEl.style.height;
		var deltaX = 15;
	    var deltaY = 15;
		
		if ((w + x) >= (this._getWindowWidth() - deltaX)) { 
			x = x - w;
			x = x - deltaX;
		} 
		else {
			x = x + deltaX;
		}
		
		if ((h + y) >= (this._getWindowHeight() - deltaY)) { 
			y = y - h;
			y = y - deltaY;
		} 
		else {
			y = y + deltaY;
		} 
		
		this.tooltipEl.style.position = 'absolute';
		this.tooltipEl.style.top = y + 'px';
		this.tooltipEl.style.left = x + 'px';	
		if (content != undefined) 
		    this.tooltipEl.innerHTML = content;
		this.tooltipEl.style.display = 'block';
		this.tooltipEl.style.zindex = 1000;
	};

	FunnelChart.prototype._tooltipHide = function () {
	    this.tooltipEl.style.display = 'none';
	};

	FunnelChart.prototype._traverseToDataField =function (object, dataFieldArray) {
	    var a = object;
	    try { //Try catch outside the loop TODO
	        for (var i = 0; i < dataFieldArray.length; i++) {
	            a = a[dataFieldArray[i]];
	        }
	    }
	    catch (e) {
	        //this.updateMessageDiv(this.messageInterceptFunction());
	        console.log(e);
	    }
	    return a;
	} 

	FunnelChart.prototype.generateColors = function (count, scheme) {
	    function hexNumtoHexStr(n) {
	        function toHexStr(N) {
	             if (N==null) return "00";
	             N=parseInt(N); if (N==0 || isNaN(N)) return "00";
	             N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
	             return "0123456789ABCDEF".charAt((N-N%16)/16)
	                  + "0123456789ABCDEF".charAt(N%16);
	        }
	        
	        return "#" + toHexStr((n & 0xFF0000)>>>16) + toHexStr((n & 0x00FF00)>>>8) + toHexStr((n & 0x0000FF));
	    }
	        
	    function generateInterpolatedColorArray(count, colors) {
	        function interpolateColors(color1, color2, f) {
	            if (f >= 1)
	                return color2;
	            if (f <= 0)
	                return color1;
	            var fb = 1 - f;
	            return ((((color2 & 0xFF0000) * f)+((color1 & 0xFF0000) * fb)) & 0xFF0000)
	                   +((((color2 & 0x00FF00) * f)+((color1 & 0x00FF00) * fb)) & 0x00FF00)
	                   +((((color2 & 0x0000FF) * f)+((color1 & 0x0000FF) * fb)) & 0x0000FF);                                   
	        }               
	        
	        var len = colors.length;
	        var res = new Array();
	        res.push(hexNumtoHexStr(colors[0]));
	        
	        for (var i = 1; i < count; i++) {
	            var val = i * len / count;
	            var color1 = Math.floor(val);
	            var color2 = Math.ceil(val);
	            res.push(hexNumtoHexStr(interpolateColors(colors[color1], colors[color2], val - color1)));                        
	        }
	        
	        return res;
	    }

	    if (count <= 0) 
	        return null;
	        
	    var a10 = [0x1f77b4, 0xff7f0e, 0x2ca02c, 0xd62728, 0x9467bd,
	        0x8c564b, 0xe377c2, 0x7f7f7f, 0xbcbd22, 0x17becf];
	    var b20 = [0x1f77b4, 0xaec7e8, 0xff7f0e, 0xffbb78, 0x2ca02c,
	          0x98df8a, 0xd62728, 0xff9896, 0x9467bd, 0xc5b0d5,
	          0x8c564b, 0xc49c94, 0xe377c2, 0xf7b6d2, 0x7f7f7f,
	          0xc7c7c7, 0xbcbd22, 0xdbdb8d, 0x17becf, 0x9edae5];
	    var c19 = [0x9c9ede, 0x7375b5, 0x4a5584, 0xcedb9c, 0xb5cf6b,
	          0x8ca252, 0x637939, 0xe7cb94, 0xe7ba52, 0xbd9e39,
	          0x8c6d31, 0xe7969c, 0xd6616b, 0xad494a, 0x843c39,
	          0xde9ed6, 0xce6dbd, 0xa55194, 0x7b4173];
	    var colorScheme;
	    
	    if (scheme == 20) {
	        colorScheme = b20;
	    }
	    else if (scheme == 10) {
	        colorScheme = a10;
	    }
	    else /* any ((scheme === undefined) || (scheme == 19))*/{
	        colorScheme = c19;
	    }
	    
	    if (count <= colorScheme.length) {
	        c = new Array();
	        for (var i = 0; i < count; i++)
	            c.push(hexNumtoHexStr(colorScheme[i]));
	        return c;
	    }
	    
	    return generateInterpolatedColorArray(count, colorScheme);
	} 

   if (typeof (define) === "function" && define.amd) {
    define(function () {
      return FunnelChart;
    });
  } else window.FunnelChart = FunnelChart;

  return FunnelChart;

})(typeof exports === "undefined" ? window : exports);