(function (window) {

	var opts = {
		width: 600,
		height: 400,
		topMargin: 50,
		outerMargin: 15,
		labelSpace: 0,
		gapSpaceBars: 2,
		baseColor: "#8cc63f",
		highlightColor: "#539100",
		dataRange: 29000,
		titleLabel: "",
		titleFont: "bold 10pt Arial,sans-serif",
		showValues: true,
		valuesFont: "bold 8pt Arial,sans-serif",
		formatValues: undefined,
		leftLabel: "",
		leftLabelFont: "bold 8pt Arial,sans-serif",
		rightLabel: "",
		rightLabelFont: "bold 8pt Arial,sans-serif",
		showCategory: true,
		categoryFont: "8pt Arial,sans-serif",
		mouseHoverBars: undefined,
		clickAction: undefined,
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

	_processPyramidChartData = function(data){
		var chartData=[];
		var max = 0;
		for(var i=0;i<data.resultset.length;i++){
			var maxRow = ((data.resultset[i][1]>data.resultset[i][2])?data.resultset[i][1]:data.resultset[i][2]);
			max = max>maxRow?max:maxRow;
			chartData.push({ "sharedLabel": data.resultset[i][0], "barData1": data.resultset[i][1], "barData2": data.resultset[i][2]});
		}
		return [chartData,max];
	};

	function PyramidChart(options) {
		this.options = _mergeOptions(opts, options||opts);
		if(!this.options.data){ console.log("No data found!"); throw "No data found!";}
		var dataProcessed = _processPyramidChartData(this.options.data);
		this.options.chartData = dataProcessed[0];
		this.options.dataRange = dataProcessed[1]*2.5;
	}

	PyramidChart.prototype.update = function(options){
		if(options) this.options = _mergeOptions(this.options, options||this.options);
		window.document.getElementById(this.options.htmlObjectChart).textContent = "";
		this.render();
	};

	PyramidChart.prototype.render = function(){
		if(this.options.leftLabel == "" && this.options.rightLabel == ""){
			this.options.leftLabel = this.options.data.metadata[1].colName;
			this.options.rightLabel = this.options.data.metadata[2].colName;
		}
		if(!this.options.showCategory){
			this.options.labelSpace = 0;
		}
		this.options.innerMargin = (this.options.width/2) + this.options.labelSpace;

		var options = this.options;

		/* edit with care */
		var chartWidth = (options.width-options.innerMargin-options.outerMargin)*2,
			barWidth = (options.height-options.topMargin)/options.chartData.length,
			yScale = pv.Scale.linear(0, options.chartData.length).range(0, options.height-options.topMargin),
			total = pv.Scale.linear(0, options.dataRange).range(0,chartWidth),
			commas = pv.Format.number(),
			activeBar = -1
			currObj = null;

		/* main panel */
		var vis = new pv.Panel().width(options.width).height(options.height).canvas(options.htmlObjectChart)
			.event("mousemove", pv.Behavior.point(Infinity).collapse("x"))
			.event("click", function() {
				if(typeof options.clickAction=="function"){
			    	return options.clickAction(currObj);
				}
				return
			});

			vis.add(pv.Label)
				.top(15)
				.textAlign("center")
				.data([options.titleLabel])
				.font(options.titleFont);
			
			/* barData1 label */
			vis.add(pv.Label)
				.data([options.leftLabel])
				.top(options.topMargin-3)
				.left(options.width-options.innerMargin) 
				.textAlign("right")		
				.font(options.leftLabelFont);
				
			/* barData2 label */
			vis.add(pv.Label)
				.data([options.rightLabel])
				.top(options.topMargin-3)
				.left(options.innerMargin) 
				.font(options.rightLabelFont);
					
			/* left bars and data labels */	
			vis.add(pv.Bar)
				.data(options.chartData)
				.top(function() { return yScale(this.index)+options.topMargin; })
				.width(function(d) { return total(d.barData2); })
				.height(barWidth-options.gapSpaceBars)
				.right(options.innerMargin)
				.event("point", function() { activeBar = this.index; currObj = this.scene[this.index].data; if(typeof options.mouseHoverBars=="function") options.mouseHoverBars([this.scene[this.index].data.barData2,this.scene[this.index].data.barData1], this.scene[this.index].data, this); return vis; })
				.fillStyle(function() { return (activeBar == this.index) ? options.highlightColor : options.baseColor; }) 
				.anchor("left")
				.add(pv.Label)
				.textAlign("right")
				.text(function(d) { return (typeof options.formatValues=="function")?options.formatValues(d.barData2, this.scene[this.index].data):commas(d.barData2); })
				.font(options.valuesFont)
				.textStyle(function() { return options.showValues?"black":(activeBar == this.index) ? "black" : "transparent"; });

			// rigt bars and data labels	
		    vis.add(pv.Bar)
				.data(options.chartData)
				.top(function() { return yScale(this.index)+options.topMargin; })
				.width(function(d) { return total(d.barData1); })
				.height(barWidth-options.gapSpaceBars)
				.left(options.innerMargin)
				.event("point", function() { activeBar = this.index; currObj = this.scene[this.index].data; if(typeof options.mouseHoverBars=="function") options.mouseHoverBars([this.scene[this.index].data.barData2,this.scene[this.index].data.barData1], this.scene[this.index].data, this); return vis; })
				.fillStyle(function() { return (activeBar == this.index) ? options.highlightColor : options.baseColor; }) 
				.anchor("right")
				.add(pv.Label)
				.textAlign("left")
				.text(function(d) { return (typeof options.formatValues=="function")?options.formatValues(d.barData1, this.scene[this.index].data):commas(d.barData1); })
				.font(options.valuesFont)
				.textStyle(function() { return options.showValues?"black":(activeBar == this.index) ? "black" : "transparent"; });

			/* sharedLabels */
			if(options.showCategory)
			vis.add(pv.Bar)
				.data(options.chartData)
				.font(options.categoryFont)
				.top(function(){ return yScale(this.index)+options.topMargin+(parseInt((options.height/options.chartData.length)-2)/2); })
				.height(barWidth-options.ga)
				.left(options.width/2)
				.fillStyle(null)
				.event("point", function() {activeBar = this.index; currObj = this.scene[this.index].data; return vis;})
				.anchor("right")
				.add(pv.Label)
				.text(function(d) { return d.sharedLabel; })
				.left(options.width/2)
				.textAlign("center")
				.textStyle(function() { return (activeBar == this.index) ? "black" : "gray"; });

			// animation panel
			var ap = vis.add(pv.Panel)
				.events("all")
				.event("point", function() { activeBar = this.index; return vis; });
				if(typeof options.clickAction=="function"){
					ap.cursor("pointer")
				}

			vis.render();
	}

   if (typeof (define) === "function" && define.amd) {
    define(function () {
      return PyramidChart;
    });
  } else window.PyramidChart = PyramidChart;

  return PyramidChart;

})(typeof exports === "undefined" ? window : exports);