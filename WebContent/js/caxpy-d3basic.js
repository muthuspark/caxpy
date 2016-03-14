//radar chart from http://bl.ocks.org/nbremer/6506614
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
var RadarChart={draw:function(t,a,e){var r={radius:5,w:600,h:600,factor:1,factorLegend:.85,levels:3,maxValue:0,radians:2*Math.PI,opacityArea:.5,ToRight:5,TranslateX:80,TranslateY:30,ExtraWidthX:100,ExtraWidthY:100,color:d3.scale.category10()};if("undefined"!=typeof e)for(var s in e)"undefined"!=typeof e[s]&&(r[s]=e[s]);r.maxValue=Math.max(r.maxValue,d3.max(a,function(t){return d3.max(t.map(function(t){return t.value}))}));var n=a[0].map(function(t){return t.axis}),l=n.length,o=r.factor*Math.min(r.w/2,r.h/2),i=d3.format("%");d3.select(t).select("svg").remove();for(var c,u=d3.select(t).append("svg").attr("width",r.w+r.ExtraWidthX).attr("height",r.h+r.ExtraWidthY).append("g").attr("transform","translate("+r.TranslateX+","+r.TranslateY+")"),f=0;f<r.levels-1;f++){var d=r.factor*o*((f+1)/r.levels);u.selectAll(".levels").data(n).enter().append("svg:line").attr("x1",function(t,a){return d*(1-r.factor*Math.sin(a*r.radians/l))}).attr("y1",function(t,a){return d*(1-r.factor*Math.cos(a*r.radians/l))}).attr("x2",function(t,a){return d*(1-r.factor*Math.sin((a+1)*r.radians/l))}).attr("y2",function(t,a){return d*(1-r.factor*Math.cos((a+1)*r.radians/l))}).attr("class","line").style("stroke","grey").style("stroke-opacity","0.75").style("stroke-width","0.3px").attr("transform","translate("+(r.w/2-d)+", "+(r.h/2-d)+")")}for(var f=0;f<r.levels;f++){var d=r.factor*o*((f+1)/r.levels);u.selectAll(".levels").data([1]).enter().append("svg:text").attr("x",function(){return d*(1-r.factor*Math.sin(0))}).attr("y",function(){return d*(1-r.factor*Math.cos(0))}).attr("class","legend").style("font-family","sans-serif").style("font-size","10px").attr("transform","translate("+(r.w/2-d+r.ToRight)+", "+(r.h/2-d)+")").attr("fill","#737373").text(i((f+1)*r.maxValue/r.levels))}series=0;var h=u.selectAll(".axis").data(n).enter().append("g").attr("class","axis");h.append("line").attr("x1",r.w/2).attr("y1",r.h/2).attr("x2",function(t,a){return r.w/2*(1-r.factor*Math.sin(a*r.radians/l))}).attr("y2",function(t,a){return r.h/2*(1-r.factor*Math.cos(a*r.radians/l))}).attr("class","line").style("stroke","grey").style("stroke-width","1px"),h.append("text").attr("class","legend").text(function(t){return t}).style("font-family","sans-serif").style("font-size","11px").attr("text-anchor","middle").attr("dy","1.5em").attr("transform",function(){return"translate(0, -10)"}).attr("x",function(t,a){return r.w/2*(1-r.factorLegend*Math.sin(a*r.radians/l))-60*Math.sin(a*r.radians/l)}).attr("y",function(t,a){return r.h/2*(1-Math.cos(a*r.radians/l))-20*Math.cos(a*r.radians/l)}),a.forEach(function(t){dataValues=[],u.selectAll(".nodes").data(t,function(t,a){dataValues.push([r.w/2*(1-parseFloat(Math.max(t.value,0))/r.maxValue*r.factor*Math.sin(a*r.radians/l)),r.h/2*(1-parseFloat(Math.max(t.value,0))/r.maxValue*r.factor*Math.cos(a*r.radians/l))])}),dataValues.push(dataValues[0]),u.selectAll(".area").data([dataValues]).enter().append("polygon").attr("class","radar-chart-serie"+series).style("stroke-width","2px").style("stroke",r.color(series)).attr("points",function(t){for(var a="",e=0;e<t.length;e++)a=a+t[e][0]+","+t[e][1]+" ";return a}).style("fill",function(){return r.color(series)}).style("fill-opacity",r.opacityArea).on("mouseover",function(){z="polygon."+d3.select(this).attr("class"),u.selectAll("polygon").transition(200).style("fill-opacity",.1),u.selectAll(z).transition(200).style("fill-opacity",.7)}).on("mouseout",function(){u.selectAll("polygon").transition(200).style("fill-opacity",r.opacityArea)}),series++}),series=0,a.forEach(function(t){u.selectAll(".nodes").data(t).enter().append("svg:circle").attr("class","radar-chart-serie"+series).attr("r",r.radius).attr("alt",function(t){return Math.max(t.value,0)}).attr("cx",function(t,a){return dataValues.push([r.w/2*(1-parseFloat(Math.max(t.value,0))/r.maxValue*r.factor*Math.sin(a*r.radians/l)),r.h/2*(1-parseFloat(Math.max(t.value,0))/r.maxValue*r.factor*Math.cos(a*r.radians/l))]),r.w/2*(1-Math.max(t.value,0)/r.maxValue*r.factor*Math.sin(a*r.radians/l))}).attr("cy",function(t,a){return r.h/2*(1-Math.max(t.value,0)/r.maxValue*r.factor*Math.cos(a*r.radians/l))}).attr("data-id",function(t){return t.axis}).style("fill",r.color(series)).style("fill-opacity",.9).on("mouseover",function(t){newX=parseFloat(d3.select(this).attr("cx"))-10,newY=parseFloat(d3.select(this).attr("cy"))-5,c.attr("x",newX).attr("y",newY).text(i(t.value)).transition(200).style("opacity",1),z="polygon."+d3.select(this).attr("class"),u.selectAll("polygon").transition(200).style("fill-opacity",.1),u.selectAll(z).transition(200).style("fill-opacity",.7)}).on("mouseout",function(){c.transition(200).style("opacity",0),u.selectAll("polygon").transition(200).style("fill-opacity",r.opacityArea)}).append("svg:title").text(function(t){return Math.max(t.value,0)}),series++}),c=u.append("text").style("opacity",0).style("font-family","sans-serif").style("font-size","13px")}};var chartCreated = false;
var d3colors = d3.scale.category20();
var xaxisname = null, xtitle = null, yaxisname = null, svg = null;
var x0,x,x1,y,xAxis,yAxis,state;
var columns = null;
function createColumnChart(containorid, reportxml) {
	var data = reportxml.chartData;
	var margin = {
		top : 60,
		right : 20,
		bottom : 50,
		left : 40
	}, width = $("#"+containorid).width() - margin.left - margin.right, height = $("#"+containorid).height() - margin.top - margin.bottom;
	if(width <=0){
		width = 600;
	}
	if(height <=0){
		height = 500;
	}
	var d3colors = d3.scale.category20();
	var chartCols = reportxml.chart_cols, chartRows = reportxml.chart_rows;
	var labels = [];
	var max=0;
	data.forEach(function(d){
	  var l = '';
	  chartCols.forEach(function(k){
	    l+=d[k]+'-';
	  });
	  d.columnlabel = l.substring(0,l.length-1);
	  labels.push(d.columnlabel);
	  chartRows.forEach(function(k){
	    val = parseFloat(d[k]);
	    if( val > max){
	       max = val; 
	     }
	  });
	  d.columnvalues = chartRows.map(function(name) {
		return {
			name : name,
			value : +d[name]
		};
	  });
	});
	if (reportxml.realtime && chartCreated) {
		
		//ranges
		x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
		x = d3.scale.ordinal();
		y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		x.domain(chartRows).rangeRoundBands([ 0, x0.rangeBand() ]);
		y.domain([0, max+10]);

		//axis
		xAxis = d3.svg.axis().scale(x0).orient("bottom");
		yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));
		
		svg = d3.select("#"+containorid).transition();
		svg.select(".x.axis") // change the x axis
	            .duration(750)
	            .call(xAxis);
		svg.select(".y.axis") // change the y axis
			    .duration(750)
			    .call(yAxis);
		
		svg.attr("");
		
		var columns =  d3.select("body").selectAll(".bars")
			.data(data);

		columns.selectAll("rect")
			.data(function(d) {
					return d.columnvalues;
				})
			.transition()
			.duration(1000)
			.attr("width", x.rangeBand())
			.attr("x", function(d) {
					return x(d.name);
			})
			.attr("y", function(d) {
					return y(d.value);
			}).attr("height", function(d) {
					return height - y(d.value);
			}).style("fill", function(d,i) {
					return d3colors(chartRows[i]);
			});

	} else {
		setTitles(reportxml);
		//ranges
		x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
		x = d3.scale.ordinal();
		y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		x.domain(chartRows).rangeRoundBands([ 0, x0.rangeBand() ]);
		y.domain([0, max+10]);

		//tick axis
		xAxis = d3.svg.axis().scale(x0).orient("bottom");
		yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		//creating the chart container
		svg = d3.select("#"+containorid)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("class","chart")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

		addXYTitles(svg,xtitle,yaxisname,xAxis,yAxis,width,height);

		//initialize tooltipa
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d,i) {
				 console.log(labels);
				 console.log(i);
				  var tip ='<strong>' + labels[i] + '</strong><br>';
					  tip+='<strong>' + d.name + '</strong>:'+d.value+'<br>';
				  return tip;
			});
		svg.call(tip);
		
		//create chart
		columns = svg.selectAll(".chart")
			.data(data)
			.enter().append("g").attr("class", "g bars").attr("transform", function(d) {
			      return "translate(" + x0(d.columnlabel) + ",0)";
			});
		
		columns.selectAll("rect")
		    	.data(function(d) {
					return d.columnvalues;
				})
				.enter()
				.append("rect")
				.attr("width", x.rangeBand())
				.attr("x", function(d) {
					return x(d.name);
				})
				.attr("y", function(d) {
					return y(d.value);
				})
				.attr("height", function(d) {
					return height - y(d.value);
				})
				.style("fill", function(d,i) {
					return d3colors(chartRows[i]);
				})
				.on('mouseover', tip.show)
			    .on('mouseout', tip.hide);

        //add chart titles and subtitles
	    if(reportxml.chartProperties){
			var cp = reportxml.chartProperties;
			if(cp.chartTitle && $.trim(cp.chartTitle)!=''){
			    svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -30).attr("font-size", "20px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartTitle);
		    }
			if(cp.chartSubTitle && $.trim(cp.chartSubTitle)!=''){
		    	svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -15).attr("font-size", "10px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartSubTitle);
		    }
		}
	    //add legends
	    addLegend(svg,chartRows,d3colors,  width);
	    addWaterMark(svg, width, height,margin);
		chartCreated = true;
	}
}

function createBubbleChart(containorid, reportxml) {
	var data = reportxml.chartData;
	var margin = {
		top : 60,
		right : 20,
		bottom : 50,
		left : 40
	},  width = $("#"+containorid).width() - margin.left - margin.right, height = $("#"+containorid).height() - margin.top - margin.bottom;
	if(width <=0){
		width = 600;
	}
	if(height <=0){
		height = 500;
	}
	var d3colors = d3.scale.category20();
	var chartCols = reportxml.chart_cols, chartRows = reportxml.chart_rows;
	var labels = [];
	var max=0;
	data.forEach(function(d){
	  d.columnlabelvar = d[chartCols[0]];
	  d.columnlabel = d[chartCols[0]];
	  var l = '';
	  for(var ind=(chartCols.length-1);ind>=0;ind--){
		 l+=d[chartCols[ind]]+'<br>';
	  }
	  d.displaylabel = l.substring(0,l.length-1);
	  labels.push(d.columnlabel);
	  chartRows.forEach(function(k){
	    val = parseFloat(d[k]);
	    if( val > max){
	       max = val; 
	     }
	  });
	  d.columnvalues = chartRows.map(function(name) {
		return {
			name : name,
			value : +d[name]
		};
	  });
	});
	
	if (reportxml.realtime && chartCreated) {

	} else {
		setTitles(reportxml);
		//ranges
		x0 = d3.scale.ordinal().rangeRoundBands([ 0, width], .1);
		y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		y.domain([0, max+10]);

		//tick axis
		xAxis = d3.svg.axis().scale(x0).orient("bottom");
		yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		//creating the chart container
		svg = d3.select("#"+containorid)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("class","chart")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

		addXYTitles(svg,xtitle,yaxisname,xAxis,yAxis,width,height);

		//initialize tooltipa
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d,i) {
				  var tip ='<strong>' + d.displaylabel+ '</strong><br>';
				  d.columnvalues.forEach(function(k){
					  tip+='<strong>' + k.name + '</strong>:'+k.value+'<br>';
				  });
				  return tip;
			});
		svg.call(tip);

		var xaxisranges = [];
		$(".x .tick").each(function(){ xaxisranges.push(parseInt($(this).attr("transform").split("(")[1].split(",")[0])); });
		
		var r = d3.scale.linear().range([3,height/6]);
		var circles = svg.selectAll("circle").data(data);
		var radiusAvailable = false;
		if(reportxml.chart_rows.length > 1){
			radiusAvailable = true;
		}
		r.domain([0, max]);
		
		circles
	        .enter()
	        .insert("circle")
	        .attr("cx", function (d,i) { return x0(labels[i]); /*xaxisranges[i];*/ })
	        .attr("cy", function (d) {  return y(d[reportxml.chart_rows[0]]); })
	        .attr("r", function (d) {
	        	if(radiusAvailable){
	        		return r(parseFloat(d[reportxml.chart_rows[1]])); 
	        	}else{
	        		return r(parseFloat(d[reportxml.chart_rows[0]])); 
	        	}
	        })
	        .attr("class","bubble")
	        .style("fill", function(d,i) { return d3colors(labels[i]); }).on('mouseover', tip.show)
		      .on('mouseout', tip.hide);
		
		//add chart titles and subtitles
	    if(reportxml.chartProperties){
			var cp = reportxml.chartProperties;
			if(cp.chartTitle && $.trim(cp.chartTitle)!=''){
			    svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -30).attr("font-size", "20px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartTitle);
		    }
			if(cp.chartSubTitle && $.trim(cp.chartSubTitle)!=''){
		    	svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -15).attr("font-size", "10px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartSubTitle);
		    }
		}
		chartCreated = true;
	}
}

function createScatterChart(containorid, reportxml) {
	var data = reportxml.chartData;
	var margin = {
		top : 60,
		right : 20,
		bottom : 50,
		left : 40
	}, width = $("#"+containorid).width() - margin.left - margin.right, height = $("#"+containorid).height() - margin.top - margin.bottom;
	if(width <=0){
		width = 600;
	}
	if(height <=0){
		height = 500;
	}
	var d3colors = d3.scale.category10();
	var chartCols = reportxml.chart_cols, chartRows = reportxml.chart_rows;
	var labels = [];
	var max=0;
	data.forEach(function(d){
	  d.columnlabelvar = d[chartCols[0]];
	  d.columnlabel = d[chartCols[0]];
	  var l = '';
	  for(var ind=(chartCols.length-1);ind>=0;ind--){
		 l+=d[chartCols[ind]]+'<br>';
	  }
	  d.displaylabel = l.substring(0,l.length-1);
	  labels.push(d.columnlabel);
	  chartRows.forEach(function(k){
	    val = parseFloat(d[k]);
	    if( val > max){
	       max = val; 
	     }
	  });
	  d.columnvalues = chartRows.map(function(name) {
		return {
			name : name,
			value : +d[name]
		};
	  });
	});
	
	if (reportxml.realtime && chartCreated) {

	} else {
		setTitles(reportxml);
		//ranges
		x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
		x = d3.scale.ordinal();
		y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		x.domain(chartRows).rangeRoundBands([ 0, x0.rangeBand() ]);
		y.domain([0, max+10]);

		//tick axis
		xAxis = d3.svg.axis().scale(x0).orient("bottom");
		yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		//creating the chart container
		svg = d3.select("#"+containorid)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("class","chart")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");

		addXYTitles(svg,xtitle,yaxisname,xAxis,yAxis,width,height);

		//initialize tooltipa
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d,i) {
				  var tip ='<strong>' + d.displaylabel+ '</strong><br>';
				  d.columnvalues.forEach(function(k){
					  tip+='<strong>' + k.name + '</strong>:'+k.value+'<br>';
				  });
				  return tip;
			});
		svg.call(tip);
		var xaxisranges = [];
		$(".x .tick").each(function(){ xaxisranges.push(parseInt($(this).attr("transform").split("(")[1].split(",")[0])); });
		
		var circles = svg.selectAll("circle").data(data);
		circles
	        .enter()
	        .insert("circle")
	        .attr("cx", function (d,i) { return xaxisranges[i]; })
	        .attr("cy", function (d) {  return y(d[reportxml.chart_rows[0]]); })
	        .attr("r", function (d) {
        		return 5; 
	        })
	        .attr("class","bubble")
	        .style("fill", function(d,i) { return d3colors(2); }).on('mouseover', tip.show)
		      .on('mouseout', tip.hide);
		
		//add chart titles and subtitles
	    if(reportxml.chartProperties){
			var cp = reportxml.chartProperties;
			if(cp.chartTitle && $.trim(cp.chartTitle)!=''){
			    svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -30).attr("font-size", "20px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartTitle);
		    }
			if(cp.chartSubTitle && $.trim(cp.chartSubTitle)!=''){
		    	svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -15).attr("font-size", "10px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartSubTitle);
		    }
		}
		chartCreated = true;
	}
}

function createLineChart(containorid, reportxml) {
	if (reportxml.realtime && chartCreated) {

	} else {
		var data = reportxml.chartData;
		setTitles(reportxml);
		var margin = {
				top : 60,
				right : 20,
				bottom : 50,
				left : 40
			}, width = $("#"+containorid).width() - margin.left - margin.right, height = $("#"+containorid).height() - margin.top - margin.bottom;
		if(width <=0){
			width = 600;
		}
		if(height <=0){
			height = 500;
		}
		var d3colors = d3.scale.category20();
		var chartCols = reportxml.chart_cols, chartRows = reportxml.chart_rows;
		var linevalues = [];
		var labels = [];
		var max=0;
		/*
		data.forEach(function(d){
		  var l = '';
		  chartCols.forEach(function(k){
		    l+=d[k]+'-';
		  });
		  d.columnlabel = l.substring(0,l.length-1);
		  var l = '';
		  for(var ind=(chartCols.length-1);ind>=0;ind--){
			 l+=d[chartCols[ind]]+'<br>';
		  }
		  d.displaylabel = l.substring(0,l.length-1);
		  labels.push(d.columnlabel);
		  chartRows.forEach(function(k){
		    val = parseFloat(d[k]);
		    if( val > max){
		       max = val; 
		     }
		  });
		  
		  d.columnvalues = chartRows.map(function(name) { 
		     var obj = {
		        label : d.columnlabel,
						name : name,
						value : +d[name]
					};
		    	linevalues.push(obj);
					return obj;
				}); 
		});

		//ranges
		var x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
		var y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		y.domain([0, max+10]);

		//tick axis
		var xAxis = d3.svg.axis().scale(x0).orient("bottom");
		var	yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		var svg = d3.select("#"+containorid).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("class","chart").attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");

		addXYTitles(svg,xtitle,yaxisname,xAxis,yAxis,width,height);

		var lineGen = d3.svg.line()
			.interpolate("linear")   
		  .x(function(d, i) {
		    return x0(d.label) + margin.right;
		  }).y(function(d, i) {
		    return y(d.value);
		  });

		var dataNest = d3.nest()
		        .key(function(d) { return d.name;})
		        .entries(linevalues);
		// Loop through each symbol / key
		dataNest.forEach(function(d,i) {
		  svg.append('svg:path')
		    .attr('d', lineGen(d.values))
		    .attr('stroke', d3colors(chartRows[i]))
		    .attr('stroke-width', 2)
		    .attr('fill', 'none');
		});
		
		// dataplotting ends here
		var maketip = function (d) {			               
			var tip ='<p class="tip3">' + '<strong>' + d.displaylabel+ '</strong><br>';
			  d.columnvalues.forEach(function(k){
				  tip+='<strong>' + k.name + '</strong>:'+k.value+'<br>';
			  });
			  tip +='</p>';
			return tip;
	    };
		
	    for(var j=0;j<chartRows.length;j++){
	    	svg .selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","tipcircle")
			.attr("cx", function(d,i){return (x0(labels[i]) + margin.right);})
	        .attr("cy", function (d) {  return y(d[reportxml.chart_rows[j]]); })
			.attr("r",12)
			.style('opacity',50)//1e-6
			.attr ("title", maketip);
	    }
	    $('circle').tipsy({opacity:.9, gravity:'n', html:true});
		//add chart titles and subtitles
	    if(reportxml.chartProperties){
			var cp = reportxml.chartProperties;
			if(cp.chartTitle && $.trim(cp.chartTitle)!=''){
			    svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -30).attr("font-size", "20px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartTitle);
		    }
			if(cp.chartSubTitle && $.trim(cp.chartSubTitle)!=''){
		    	svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -15).attr("font-size", "10px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartSubTitle);
		    }
		}
	    //add legends
		addLegend(svg, chartRows, d3colors, width);
		chartCreated = true;
		
		*/
		
		//new formatted data
		var formatteddata = { 
			chartlabels : [],
			chartvalues : {}
		};
		
		//the logic given below is used to make sure that I get proper formatted data for my charts
		data.forEach(function(d){
			//extract labels
			var l = ''; 
			report.chart_cols.forEach(function(k){
				l+=d[k]+'-';  
			}); 
			l =  l.substring(0,l.length-1); 
			formatteddata.chartlabels.push(l);
			
			//extract values
			report.chart_rows.forEach(function(k){
				if(!formatteddata.chartvalues[k]){ 
					formatteddata.chartvalues[k] = []; 
				}
				
				//values as a pair or x and y axis values
				formatteddata.chartvalues[k].push({
					label : l , 
					value : d[k] 
				});
				
				//find Max
				var val = parseFloat(d[k]);
			    if( val > max){
			       max = val; 
			    }
			});
		});
		
		var w = width, h = height;
		var maxDataPointsForDots = 50,
       	transitionDuration = 1000;
        
		var svg = null,
       	yAxisGroup = null,
       	xAxisGroup = null,
       	dataCirclesGroup = null,
       	dataLinesGroup = null;

       	data = formatteddata;
       	var margin = 40;
       	var min = 0;
       	var pointRadius = 4;
       	//var x = d3.time.scale().range([0, w - margin * 2]).domain([data[0].date, data[data.length - 1].date]);
       	var x = d3.scale.ordinal().rangeRoundBands([ 0, w ], .1).domain(formatteddata.chartlabels);
       	var y = d3.scale.linear().range([h - margin * 2, 0]).domain([min, max]);
        
       	var xAxis = d3.svg.axis().scale(x).orient('bottom');//tickSize(h - margin * 2).tickPadding(10).ticks(7);
       	var yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(d3.format(".2s"));
       	
       	var t = null;
		                
	   	svg = d3.select('#'+containorid).select('svg').select('g');
	   	if (svg.empty()) {
	   		svg = d3.select('#'+containorid)
	   			.append('svg:svg')
	   				.attr('width', w)
	   				.attr('height', h)
	   				.attr('class', 'viz')
	   			.append('svg:g')
	   				.attr('transform', 'translate(' + margin + ',' + margin + ')');
	   	}
	    
	   	t = svg.transition().duration(transitionDuration);
		                
       	// y ticks and labels
       	if (!yAxisGroup) {
       		yAxisGroup = svg.append('svg:g')
       			.attr('class', 'yTick')
       			.call(yAxis);
       	}
       	else {
       		t.select('.yTick').call(yAxis);
       	}
        
       	// x ticks and labels
       	if (!xAxisGroup) {
       		xAxisGroup = svg.append('svg:g')
       			.attr('class', 'xTick')
       			//.attr("transform", "translate(0," + h + ")")
       			.call(xAxis);
       	}
       	else {
       		t.select('.xTick').attr("transform", "translate(0," + h + ")").call(xAxis);
       	}
        
       	// Draw the lines
       	if (!dataLinesGroup) {
       		dataLinesGroup = svg.append('svg:g');
       	}
        
       	var dataLines = dataLinesGroup.selectAll('.data-line')
       			.data([data]);
        
       	var line = d3.svg.line()
       		// assign the X function to plot our line as we wish
       		.x(function(d,i) { 
       			// verbose logging to show what's actually being done
       			console.log(d);
       			console.log('Plotting X value for date: ' + d + ' using index: ' + i + ' to be at: ' + x(d) + ' using our xScale.');
       			// return the X coordinate where we want to plot this datapoint
       			//return x(i); 
       			return x(d.label); 
       		})
       		.y(function(d) { 
       			// verbose logging to show what's actually being done
       			//console.log('Plotting Y value for data value: ' + d.value + ' to be at: ' + y(d.value) + " using our yScale.");
       			// return the Y coordinate where we want to plot this datapoint
       			//return y(d); 
       			return y(d.value); 
       		})
       		.interpolate("linear");
        
       	var garea = d3.svg.area()
       		.interpolate("linear")
       		.x(function(d) { 
       			// verbose logging to show what's actually being done
       			return x(d.label); 
       		})
            .y0(h - margin * 2)
       		.y1(function(d) { 
       			// verbose logging to show what's actually being done
       			return y(d.value); 
       		});
       	report.chart_rows.forEach(function(k){
       		var chartxy = formatteddata.chartvalues[k];
       		dataLines.enter().append('path')
     		 .attr('class', 'data-line')
     		 .style('opacity', 0.3)
     		 .attr("d", line(chartxy));
      
	      	/*dataLines.transition()
	      		.attr("d", line)
	      		.duration(transitionDuration)
	      			.style('opacity', 1)
	                              .attr("transform", function(d) { return "translate(" + x(d.label) + "," + y(d.value) + ")"; });
	       
	      	dataLines.exit()
	      		.transition()
	      		.attr("d", line)
	      		.duration(transitionDuration)
	                              .attr("transform", function(d) { return "translate(" + x(d.label) + "," + y(0) + ")"; })
	      			.style('opacity', 1e-6)
	      			.remove();*/
       	});
      /* 	dataLines
       		.enter()
       		.append('svg:path')
                   	.attr("class", "area")
                   	.attr("d", garea(data));
        */
        
       /*	d3.selectAll(".area").transition()
       		.duration(transitionDuration)
       		.attr("d", garea(data));
        */
       	// Draw the points
       	if (!dataCirclesGroup) {
       		dataCirclesGroup = svg.append('svg:g');
       	}
        
       	var circles = dataCirclesGroup.selectAll('.data-point')
       		.data(data);
        
       	circles
       		.enter()
       			.append('svg:circle')
       				.attr('class', 'data-point')
       				.style('opacity', 1e-6)
       				.attr('cx', function(d) { return x(d.date) })
       				.attr('cy', function() { return y(0) })
       				.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
       			.transition()
       			.duration(transitionDuration)
       				.style('opacity', 1)
       				.attr('cx', function(d) { return x(d.date) })
       				.attr('cy', function(d) { return y(d.value) });
        
       	circles
       		.transition()
       		.duration(transitionDuration)
       			.attr('cx', function(d) { return x(d.date) })
       			.attr('cy', function(d) { return y(d.value) })
       			.attr('r', function() { return (data.length <= maxDataPointsForDots) ? pointRadius : 0 })
       			.style('opacity', 1);
        
       	circles
       		.exit()
       			.transition()
       			.duration(transitionDuration)
       				// Leave the cx transition off. Allowing the points to fall where they lie is best.
       				//.attr('cx', function(d, i) { return xScale(i) })
       				.attr('cy', function() { return y(0) })
       				.style("opacity", 1e-6)
       				.remove();
        
	     $('svg circle').tipsy({ 
	       gravity: 'w', 
	       html: true, 
	       title: function() {
	         var d = this.__data__;
	         return 'Date: Value: '; 
	       }
	     });

        
       function generateData() {
       	var data = [];
       	var i = Math.max(Math.round(Math.random()*100), 3);
        
       	while (i--) {
       		var date = new Date();
       		date.setDate(date.getDate() - i);
       		date.setHours(0, 0, 0, 0);
       		data.push({'value' : Math.round(Math.random()*1200), 'date' : date});
       	}
       	return data;
       }
		                
	}
}

/*function createAreaChart(containorid, reportxml) {
	if (reportxml.realtime && chartCreated) {

	} else {
		var data = reportxml.chartData;
		setTitles(reportxml);
		var margin = {
				top : 60,
				right : 20,
				bottom : 100,
				left : 40
			},  width = $("#"+containorid).width() - margin.left - margin.right, height = $("#"+containorid).height() - margin.top - margin.bottom;
		if(width <=0){
			width = 600;
		}
		if(height <=0){
			height = 500;
		}
		var d3colors = d3.scale.category20();
		var chartCols = reportxml.chart_cols, chartRows = reportxml.chart_rows;
		var linevalues = [];
		var labels = [];
		var max=0;
		data.forEach(function(d){
		  var l = '';
		  chartCols.forEach(function(k){
		    l+=d[k]+'-';
		  });
		  d.columnlabel = l.substring(0,l.length-1);
		  labels.push(d.columnlabel);
		  chartRows.forEach(function(k){
		    val = parseFloat(d[k]);
		    if( val > max){
		       max = val; 
		     }
		  });
		  
		  d.columnvalues = chartRows.map(function(name) { 
		     var obj = {
		        label : d.columnlabel,
						name : name,
						value : +d[name]
					};
		    	linevalues.push(obj);
					return obj;
				}); 
		});

		//ranges
		var x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
		var x = d3.scale.ordinal();
		var y = d3.scale.linear().range([ height, 0 ]);

		//domains
		x0.domain(labels);
		x.domain(chartRows).rangeRoundBands([ 0, x0.rangeBand() ]);
		y.domain([0, max+10]);

		//tick axis
		var xAxis = d3.svg.axis().scale(x0).orient("bottom");
		var	yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

		
		var svg = d3.select("#"+containorid).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("class","chart").attr("transform",
						"translate(" + margin.left + "," + margin.top + ")");
		//initialize tooltips
		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d,i) {
			  var tip ='<strong>' + labels[i] + '</strong><br>';
				  tip+='<strong>' + d.name + '</strong>:'+d.value+'<br>';
			  return tip;
		});
		svg.call(tip);
		
		addXYTitles(svg,xtitle,yaxisname,xAxis,yAxis,width,height);

		var areaGen = d3.svg.area()
		  .x(function(d, i) {
		    return x0(d.label) + margin.right;
		  }).y0(height).y1(function(d, i) {
		    return y(d.value);
		  });

		var dataNest = d3.nest()
		        .key(function(d) { return d.name;})
		        .entries(linevalues);
		// Loop through each symbol / key
		dataNest.forEach(function(d,i) {
		  svg.append('svg:path')
		    .attr('d', areaGen(d.values))
		    .attr('fill', d3colors(chartRows[i])).attr('opacity', 0.8);
		});
		// dataplotting ends here
		
		//add chart titles and subtitles
	    if(reportxml.chartProperties){
			var cp = reportxml.chartProperties;
			if(cp.chartTitle && $.trim(cp.chartTitle)!=''){
			    svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -30).attr("font-size", "20px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartTitle);
		    }
			if(cp.chartSubTitle && $.trim(cp.chartSubTitle)!=''){
		    	svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (width- margin.left - margin.right)/2).attr("y", -15).attr("font-size", "10px").attr("text-anchor","middle").attr("fill", "#404040").text(cp.chartSubTitle);
		    }
		}
	    //add legends
		addLegend(svg, chartRows, d3colors, width);
		chartCreated = true;
	}
}
*/

function createPieChart(containorid, reportxml) {
	var cdata = reportxml.chartData;
	$("#"+containorid).html('');
	var className = "col-md-12";
	if(reportxml.chart_rows.length == 2){
		className = "col-md-6";
	}else if(reportxml.chart_rows.length > 2){
		className = "col-md-4";
	}
	for(var i=0;i<reportxml.chart_rows.length;i++){
		$("#"+containorid).append("<div id='"+containorid+""+i+"' class='"+className+"' ></div>");
	}
	$(reportxml.chart_rows).each(function(index,valind){
		var piedata = [];
		cdata.forEach(function(d, i) {
			var labind = '';
			reportxml.chart_cols.forEach(function(v){
				labind+=d[v]+'-';
			});
			piedata.push({
				label : labind.substring(0, labind.length-1),
				value : d[valind]
			});
		});
		var margin = {
				top : 60,
				right : 20,
				bottom : 50,
				left : 40
		}, width = $("#"+containorid+index).width() - margin.left - margin.right, height = $("#"+containorid+index).height() - margin.top - margin.bottom;
		if(width <=0){
			width = 500;
		}
		if(height <=0){
			height = 500;
		}
		var chartitle = reportxml.chartProperties? (reportxml.chartProperties.chartTitle? reportxml.chartProperties.chartTitle : reportxml.chart_rows[index]) : reportxml.chart_rows[index];
		if (reportxml.realtime && chartCreated) {

		} else {
			new d3pie(containorid+index, {
				labels : {
					inner : {
						format : "none"
					}
				},
				header: {
					"title": {
						"text":chartitle,
						"fontSize": 24
					},
					"subtitle": {
						"text":  reportxml.chart_rows[index]!=chartitle? reportxml.chart_rows[index] : "",
						"color": "#999999",
						"fontSize": 16
					}
				},
				data : {
					content : piedata
				},
				tooltips: {
					"enabled": true,
					"type": "placeholder",
					"string": "{label}: {value}"
				},
				effects: {
					"pullOutSegmentOnClick": {
						"effect": "linear",
						"speed": 400,
						"size": 8
					}
				}, 
				size : {
					"canvasHeight": height,
					"canvasWidth": width
				}
			});
			chartCreated = true;
		}
	});
}

function createDoughnutChart(containorid, reportxml) {
	
	var cdata = reportxml.chartData;
	$("#"+containorid).html('');
	var className = "col-md-12";
	if(reportxml.chart_rows.length == 2){
		className = "col-md-6";
	}else if(reportxml.chart_rows.length > 2){
		className = "col-md-4";
	}
	for(var i=0;i<reportxml.chart_rows.length;i++){
		$("#"+containorid).append("<div id='"+containorid+""+i+"' class='"+className+"' ></div>");
	}
	$(reportxml.chart_rows).each(function(index,valind){
		var piedata = [];
		cdata.forEach(function(d, i) {
			var labind = '';
			reportxml.chart_cols.forEach(function(v){
				labind+=d[v]+'-';
			});
			piedata.push({
				label : labind.substring(0, labind.length-1),
				value : d[valind]
			});
		});
		var chartitle = reportxml.chartProperties? (reportxml.chartProperties.chartTitle? reportxml.chartProperties.chartTitle : reportxml.chart_rows[index]) : reportxml.chart_rows[index];
		if (reportxml.realtime && chartCreated) {

		} else {
			var margin = {
					top : 60,
					right : 20,
					bottom : 50,
					left : 40
			}, width = $("#"+containorid+index).width() - margin.left - margin.right, height = $("#"+containorid+index).height() - margin.top - margin.bottom;
			if(width <=0){
				width = 500;
			}
			if(height <=0){
				height = 500;
			}
			new d3pie(containorid+index, {
				labels : {
					inner : {
						format : "none"
					}
				},
				data : {
					content : piedata
				},
				header: {
					"title": {
						"text": chartitle,
						"fontSize": 24
					},
					"subtitle": {
						"text":  reportxml.chart_rows[index]!=chartitle? reportxml.chart_rows[index] : "",
						"color": "#999999",
						"fontSize": 16
					},
					"location": "pie-center",
				},
				tooltips: {
					"enabled": true,
					"type": "placeholder",
					"string": "{label}: {value}"
				},
				effects: {
					"pullOutSegmentOnClick": {
						"effect": "linear",
						"speed": 400,
						"size": 8
					}
				},
				size : {
					"canvasHeight": height,
					"canvasWidth": width,
					"pieInnerRadius" : "95%",
					"pieOuterRadius" : "70%"
				}
			});
			chartCreated = true;
		}
	});
}

function createRadarChart(containorid, reportxml) {
	if (reportxml.realtime && chartCreated) {

	} else {
		var w = 500, h = 500;
		// Legend titles
		var LegendOptions = reportxml.chart_rows;
		var radardata = [];
		reportxml.chart_rows.forEach(function(value) {
			var singularity = [];
			reportxml.chartData.forEach(function(d) {
				singularity.push({
					axis : d[reportxml.chart_cols[0]],
					value : d[value]
				});
			});
			radardata.push(singularity);
		});

		// Options for the Radar chart, other than default
		var mycfg = {
			w : w,
			h : h,
			maxValue : 0.6,
			levels : 8,
			ExtraWidthX : 300
		}

		// Call function to draw the Radar chart
		// Will expect that data is in %'s
		RadarChart.draw("#" + containorid, radardata, mycfg);

		svg = d3.select('#' + containorid).selectAll('svg').append('svg').attr("width", w + 300).attr("height", h)

		// Create the title for the legend
		var text = svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", w - 70).attr("y", 10).attr("font-size", "12px").attr("fill", "#404040").text("chart title");

		// Initiate Legend
		var legend = svg.append("g").attr("class", "legend").attr("height", 100).attr("width", 200).attr('transform', 'translate(90,20)');
		// Create colour squares
		legend.selectAll('rect').data(LegendOptions).enter().append("rect").attr("x", w - 65).attr("y", function(d, i) {
			return i * 20;
		}).attr("width", 10).attr("height", 10).style("fill", function(d, i) {
			return d3colors(i);
		});
		// Create text next to squares
		legend.selectAll('text').data(LegendOptions).enter().append("text").attr("x", w - 52).attr("y", function(d, i) {
			return i * 20 + 9;
		}).attr("font-size", "11px").attr("fill", "#737373").text(function(d) {
			return d;
		});
	}
}


function reloadChartProperties(){
	svg	.selectAll(".xTitle")
	    .transition()
	    .duration(600)
	    .text($("#xtitle").val());
	svg	.selectAll(".yTitle")
	    .transition()
	    .duration(600)
	    .text($("#ytitle").val());
	
	if($("#chartTitle").val()!=null && $.trim($("#chartTitle").val())!=''){
    	svg.selectAll(".title")
    		.transition()
    		.duration(600)
    		.text($("#chartTitle").val());
    }
	if($("#chartSubTitle").val()!=null && $.trim($("#chartSubTitle").val())!=''){
    	svg.selectAll(".subtitle")
		.transition()
		.duration(600)
		.text($("#chartSubTitle").val());
    }
}
//yx titles and scale
function addXYTitles(svg,xTitle,yTitle,xAxis,yAxis,width,height){
	var ticks = svg .append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll('.tick');

	for (var j = 0; j < ticks[0].length; j++) {
		var c = ticks[0][j],
		  n = ticks[0][j+1];
		if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
		continue;
		while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
		d3.select(n).remove();
		j++;
		n = ticks[0][j+1];
		if (!n)
		  break;
		}
	}
	
	/*if(data.length > 7) {
	//rotate the x axis labels
	svg.selectAll(".x text")  // select all the text elements for the xaxis
		    .attr("transform", function(d) {
		           return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
		    });
	}*/
	
	svg .append("g").append("text")
	.attr("transform", "translate(0," + height + ")")
	.attr("x", width / 2)
	.attr("y", 25)
	.attr("dy", ".71em")
	.style("text-anchor","end")
	.text(xtitle)
	.attr("class", "xTitle");
	
	svg	.append("g")
		.attr("class", "y axis")
		.call(yAxis).append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(yaxisname)
		.attr("class","yTitle");
}
// utilities
// function to add legend to my chart
function addLegend(svg, chartRows, d3colors, width) {
	var legend = svg.selectAll(".legend").data(chartRows.slice().reverse()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
		return "translate(0," + i * 20 + ")";
	});
	
	legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", function(d,i) {
		return d3colors(chartRows[i]);
	});
	
	legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
		return d;
	});
}
//set titles method
function setTitles(reportxml){
	yaxisname = reportxml.chartProperties? (reportxml.chartProperties.ytitle? reportxml.chartProperties.ytitle : '') : '';
	if(yaxisname.length==0){
		for (var i = 0; i < reportxml.chart_rows.length; i++) {
			yaxisname += reportxml.chart_rows[i];
			if (i < reportxml.chart_rows.length - 1) {
				yaxisname += ",";
			}
		}
	}
	xaxisname = '';//reset old name
	for (var i = 0; i < reportxml.chart_cols.length; i++) {
		xaxisname += reportxml.chart_cols[i];
		if (i < reportxml.chart_cols.length - 1) {
			xaxisname += "-";
		}
	}
	xtitle = reportxml.chartProperties? (reportxml.chartProperties.xtitle? reportxml.chartProperties.xtitle : xaxisname) : xaxisname;
}

function addWaterMark(svg, width, height,margin){
	//watermark
	svg.append("a").attr("href","http://caxpy.com").append("text").attr("class", "title").attr('transform', 'translate(0,0)').attr("x", width).attr("y", height+margin.bottom-5).attr("font-size", "8px").attr("text-anchor","end").attr("fill", "steelblue").text("www.caxpy.com");
}
