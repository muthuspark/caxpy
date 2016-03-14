/**
 * 
 */
var xaxisname = null, xtitle = null, yaxisname = null, svg = null;
function renderStackeColumnChart(containorid, reportjson){
		var w = $("#" + containorid).width(), h = $("#" + containorid).height();
		var margin = {
			top : h/9.708,
			right : w/9.708,
			bottom : h/9.708,
			left : w/9.708
		};

		setTitles(reportjson);
		var data = reportjson.chartData;
		var chartrows = reportjson.chart_rows;
		var chartcolumns = [];
		chartrows.forEach(function(k) {
			var arr = [ k ];
			data.forEach(function(v) {
				arr.push(v[k]);
			});
			chartcolumns.push(arr);
		});

		var chartcols = reportjson.chart_cols;
		var chartlabels = [ "x" ];
		data.forEach(function(j) {
			var l = '';
			chartcols.forEach(function(k) {
				l += j[k] + '-';
			});
			l = l.substring(0, l.length - 1);
			chartlabels.push(l);
		});
		chartcolumns.push(chartlabels);
		// create filters
		createDataFilters(containorid,reportjson);

		reportjson.chart = c3.generate({
			bindto : '#' + containorid,
			data : {
				x : "x",
				columns : chartcolumns,
				groups : [ chartrows ],
				type : 'bar'
			},
			padding : {
				top : margin.top,
				right : margin.right,
				bottom : margin.bottom,
				left : margin.left,
			},
			legend : {
				position : 'right'
			},
			zoom : {
				enabled : true
			},
			axis : {
				x : {
					type : 'category',
					label : xtitle,
					position : 'outer-center'
				},
				y : {
					label : yaxisname
				}
			},
			bar : {
				width : {
					ratio : 0.3,
				// max: 30
				},
			}
		});
		renderChartTitles(reportjson);
}
function createStackedColumnChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderStackeColumnChart(containorid, reportjson);
}

function renderFunnelChart(containorid, reportjson){
	var data = [] ;
	reportjson.chartData.forEach(function(val){ 
		data.push([ val[reportjson.chart_cols[0]] + '' , parseFloat( val[reportjson.chart_rows[0]]) ])
	});
	//sort the data
	var data = data.sort(function(a,b){   return parseFloat(a[1]) - parseFloat(b[1]);  });
	data.reverse();
    var options = {
    		chart: {
    			bottomPinch: 1
    		}
    };
    
    var chart = new D3Funnel('#'+containorid);
    chart.draw(data, options);
}

function createFunnelChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderFunnelChart(containorid, reportjson);
}

function renderBarChart(containorid, reportjson) {
		var w = $("#" + containorid).width(), h = $("#" + containorid).height();
		var margin = {
			top : h/9.708,
			right : w/9.708,
			bottom : h/9.708,
			left : w/9.708
		};

		setTitles(reportjson);
		var data = reportjson.chartData;
		var chartrows = reportjson.chart_rows;
		var chartcolumns = [];
		chartrows.forEach(function(k) {
			var arr = [ k ];
			data.forEach(function(v) {
				arr.push(v[k]);
			});
			chartcolumns.push(arr);
		});

		var chartcols = reportjson.chart_cols;
		var chartlabels = [ "x" ];
		data.forEach(function(j) {
			var l = '';
			chartcols.forEach(function(k) {
				l += j[k] + '-';
			});
			l = l.substring(0, l.length - 1);
			chartlabels.push(l);
		});
		chartcolumns.push(chartlabels);
		// create filters
		createDataFilters(containorid,reportjson);

		reportjson.chart = c3.generate({
			bindto : '#' + containorid,
			data : {
				x : "x",
				columns : chartcolumns,
				type : 'bar'
			},
			padding : {
				top : margin.top,
				right : margin.right,
				bottom : margin.bottom,
				left : margin.left,
			},
			legend : {
				position : 'right'
			},
			zoom : {
				enabled : true
			},
			axis : {
				rotated : true,
				x : {
					type : 'category',
					label : xtitle,
					position : 'outer-center'
				},
				y : {
					label : yaxisname
				}
			},
			bar : {
				width : {
					ratio : 0.3,
				// max: 30
				},
			}
		});
		renderChartTitles(reportjson);
}
function createBarChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderBarChart(containorid, reportjson);
}

function renderColumnChart(containorid, reportjson) {
	var w = $("#" + containorid).width(), h = $("#" + containorid).height();
	var margin = {
		top : h/9.708,
		right : w/9.708,
		bottom : h/9.708,
		left : w/9.708
	};
	setTitles(reportjson);
	var data = reportjson.chartData;
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);

	// create filters
	createDataFilters(containorid,reportjson);

	reportjson.chart = c3.generate({
		bindto : '#' + containorid,
		data : {
			x : "x",
			columns : chartcolumns,
			type : 'bar'
		},
		padding : {
			top : margin.top,
			right : margin.right,
			bottom : margin.bottom,
			left : margin.left,
		},
		legend : {
			position : 'right'
		},
		zoom : {
			enabled : true
		},
		axis : {
			x : {
				type : 'category',
				label : xtitle,
				position : 'outer-center'
			},
			y : {
				label : yaxisname
			}
		},
		bar : {
			width : {
				ratio : 0.3,
			// max: 30
			},
		}
	});
	renderChartTitles(reportjson);
}

function createColumnChart(pcontainorid, reportjson) {
	// create diffferent containers for different purposes
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderColumnChart(containorid, reportjson);
}

function renderLineChart(containorid, reportjson){
	var w = $("#" + containorid).width(), h = $("#" + containorid).height();
	var margin = {
		top : h/9.708,
		right : w/9.708,
		bottom : h/9.708,
		left : w/9.708
	};
	
	var data = reportjson.chartData;
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);
	// create filters
	createDataFilters(containorid,reportjson);

	reportjson.chart = c3.generate({
		bindto : '#' + containorid,
		data : {
			x : "x",
			columns : chartcolumns,
			type : 'line'
		},
		padding : {
			top : margin.top,
			right : margin.right,
			bottom : margin.bottom,
			left : margin.left,
		},
		legend : {
			position : 'right'
		},
		zoom : {
			enabled : true
		},
		axis : {
			x : {
				type : 'category'
			}
		}
	});
	renderChartTitles(reportjson);
}

function createLineChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderLineChart(containorid, reportjson);
}

function renderAreaChart(containorid, reportjson) {
	var w = $("#" + containorid).width(), h = $("#" + containorid).height();
	var margin = {
		top : h/9.708,
		right : w/9.708,
		bottom : h/9.708,
		left : w/9.708
	};
	
	var data = reportjson.chartData;
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);
	// create filters
	createDataFilters(containorid,reportjson);

	reportjson.chart = c3.generate({
		bindto : '#' + containorid,
		data : {
			x : "x",
			columns : chartcolumns,
			type : 'area'
		},
		padding : {
			top : margin.top,
			right : margin.right,
			bottom : margin.bottom,
			left : margin.left,
		},
		legend : {
			position : 'right'
		},
		zoom : {
			enabled : true
		},
		axis : {
			x : {
				type : 'category'
			}
		}
	});
	renderChartTitles(reportjson);
}

function createAreaChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderAreaChart(containorid, reportjson);
}

function renderPieChart(containorid, reportjson){
	var cdata = reportjson.chartData;
	$("#" + containorid).html('');
	var className = "col-md-12";
	if (reportjson.chart_rows.length == 2) {
		className = "col-md-6";
	} else if (reportjson.chart_rows.length > 2) {
		className = "col-md-4";
	}
	for (var i = 0; i < reportjson.chart_rows.length; i++) {
		$("#" + containorid).append("<div id='" + containorid + "" + i + "' class='" + className + "' ></div>");
	}
	var h = parseInt($("#" + containorid).height());
	if (reportjson.chart_rows.length > 2) {
		h = h / 2;
	}
	
	// create filters
	createDataFilters(containorid,reportjson);

	reportjson.chart = [];
	$(reportjson.chart_rows).each(function(index, valind) {
		var piedata = [];
		cdata.forEach(function(d, i) {
			var labind = '';
			reportjson.chart_cols.forEach(function(v) {
				labind += d[v] + '-';
			});
			piedata.push([ labind.substring(0, labind.length - 1), d[valind] ]);
		});

		var chart = c3.generate({
			bindto : "#" + containorid + "" + index,
			data : {
				// iris data from R
				columns : piedata,
				type : 'pie'
			},
			size : {
				height : h
			},
			pie: {
				label: {
					 format:function(x){
						   return x;
				     }
		        }
			}
		});
		reportjson.chart.push(chart);
	});
}

function createPieChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderPieChart(containorid, reportjson);
}

function renderDoughnutChart(containorid, reportjson){
	var cdata = reportjson.chartData;
	$("#" + containorid).html('');
	var className = "col-md-12";
	if (reportjson.chart_rows.length == 2) {
		className = "col-md-6";
	} else if (reportjson.chart_rows.length > 2) {
		className = "col-md-4";
	}
	for (var i = 0; i < reportjson.chart_rows.length; i++) {
		$("#" + containorid).append("<div id='" + containorid + "" + i + "' class='" + className + "' ></div>");
	}
	var h = parseInt($("#" + containorid).height());
	if (reportjson.chart_rows.length > 2) {
		h = h / 2;
	}

	// create filters
	createDataFilters(containorid,reportjson);
	reportjson.chart = [];
	$(reportjson.chart_rows).each(function(index, valind) {
		var piedata = [];
		cdata.forEach(function(d, i) {
			var labind = '';
			reportjson.chart_cols.forEach(function(v) {
				labind += d[v] + '-';
			});
			piedata.push([ labind.substring(0, labind.length - 1), d[valind] ]);
		});

		var chart = c3.generate({
			bindto : "#" + containorid + "" + index,
			data : {
				// iris data from R
				columns : piedata,
				type : 'donut'
			},
			size : {
				height : h
			},
			donut: {
				label: {
					 format:function(x){
						   return x;
				     }
		        }
			}
		});
		reportjson.chart.push(chart);
	});
}

function createDoughnutChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderDoughnutChart(containorid, reportjson);
}

function renderBubbleChart(containorid, reportjson){
	var w = $("#" + containorid).width(), h = $("#" + containorid).height();
	var margin = {
		top : h/9.708,
		right : w/9.708,
		bottom : h/9.708,
		left : w/9.708
	};

	setTitles(reportjson);
	var data = reportjson.chartData;
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	var radiusdomain = [];
	data.forEach(function(v) {
		radiusdomain.push(v[chartrows[0]]);
	});

	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);
	// create filters
	createDataFilters(containorid,reportjson);
	var radfun = d3.scale.linear().range([ 3, 50 ]);
	radfun.domain(d3.extent(radiusdomain));
	reportjson.chart = c3.generate({
		bindto : '#' + containorid,
		data : {
			x : "x",
			columns : chartcolumns,
			type : 'scatter'
		},
		padding : {
			top : margin.top,
			right : margin.right,
			bottom : margin.bottom,
			left : margin.left,
		},
		legend : {
			position : 'right'
		},
		axis : {
			x : {
				type : 'category',
				label : xtitle,
				position : 'outer-center'
			},
			y : {
				label : yaxisname
			}
		},
		point : {
			r : function(d) {
				return radfun([ d.value ]);
			}
		}
	});
	renderChartTitles(reportjson);
}

function createBubbleChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderBubbleChart(containorid, reportjson);
}

function renderScatterChart(containorid, reportjson){
	var w = $("#" + containorid).width(), h = $("#" + containorid).height();
	var margin = {
		top : h/9.708,
		right : w/9.708,
		bottom : h/9.708,
		left : w/9.708
	};

	setTitles(reportjson);
	var data = reportjson.chartData;
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);

	// create filters
	createDataFilters(containorid,reportjson);

	reportjson.chart = c3.generate({
		bindto : '#' + containorid,
		data : {
			x : "x",
			columns : chartcolumns,
			type : 'scatter'
		},
		padding : {
			top : margin.top,
			right : margin.right,
			bottom : margin.bottom,
			left : margin.left,
		},
		legend : {
			position : 'right'
		},
		axis : {
			x : {
				type : 'category',
				label : xtitle,
				position : 'outer-center'
			},
			y : {
				label : yaxisname
			}
		},
		point : {
			r : 5
		}
	});
	renderChartTitles(reportjson);
}

function createScatterChart(pcontainorid, reportjson) {
	createRelevantContainers(pcontainorid, reportjson);
	containorid = "chart-cont-" + pcontainorid;
	$("#" + containorid).height($("#" + pcontainorid).height() - 60);
	renderScatterChart(containorid, reportjson);
}

function setTitles(reportjson) {
	yaxisname = reportjson.chartProperties ? (reportjson.chartProperties.ytitle ? reportjson.chartProperties.ytitle : '') : '';
	if (yaxisname.length == 0) {
		for (var i = 0; i < reportjson.chart_rows.length; i++) {
			yaxisname += reportjson.chart_rows[i];
			if (i < reportjson.chart_rows.length - 1) {
				yaxisname += ",";
			}
		}
	}
	xaxisname = '';// reset old name
	for (var i = 0; i < reportjson.chart_cols.length; i++) {
		xaxisname += reportjson.chart_cols[i];
		if (i < reportjson.chart_cols.length - 1) {
			xaxisname += "-";
		}
	}
	xtitle = reportjson.chartProperties ? (reportjson.chartProperties.xtitle ? reportjson.chartProperties.xtitle : xaxisname) : xaxisname;
}

// yx titles and scale
function addXYTitles(svg, xTitle, yTitle, xAxis, yAxis, width, height) {
	var ticks = svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll('.tick');
	for (var j = 0; j < ticks[0].length; j++) {
		var c = ticks[0][j], n = ticks[0][j + 1];
		if (!c || !n || !c.getBoundingClientRect || !n.getBoundingClientRect)
			continue;
		while (c.getBoundingClientRect().right > n.getBoundingClientRect().left) {
			d3.select(n).remove();
			j++;
			n = ticks[0][j + 1];
			if (!n)
				break;
		}
	}
	svg.append("g").append("text").attr("transform", "translate(0," + height + ")").attr("x", width / 2).attr("y", 25).attr("dy", ".71em").style("text-anchor", "end").text(xtitle).attr("class",
			"xTitle");
	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yaxisname).attr("class",
			"yTitle");
}

function addWaterMark(svg, width, height, margin) {
	// watermark
	svg.append("a").attr("href", "http://caxpy.com").append("text").attr("class", "title").attr('transform', 'translate(0,0)').attr("x", width).attr("y", height + margin.bottom - 5).attr("font-size",
			"8px").attr("text-anchor", "end").attr("fill", "steelblue").text("www.caxpy.com");
}

function renderChartTitles(reportjson) {
	var svg = d3.select("svg");
	var w = parseFloat(svg.attr("width"));
	var h = parseFloat(svg.attr("height"));
	if (reportjson.chartProperties) {
		var cp = reportjson.chartProperties;
		if (cp.chartTitle && $.trim(cp.chartTitle) != '') {
			svg.append("text").attr("class", "title").attr('transform', 'translate(90,0)').attr("x", (w) / 2).attr("y", h/9.708).attr("font-size", "20px").attr("text-anchor", "middle").attr("fill",
					"#404040").text(cp.chartTitle);
		}
		if (cp.chartSubTitle && $.trim(cp.chartSubTitle) != '') {
			svg.append("text").attr("class", "subtitle").attr('transform', 'translate(90,0)').attr("x", (w) / 2).attr("y",(h/9.708+20)).attr("font-size", "10px").attr("text-anchor", "middle").attr("fill",
					"#404040").text(cp.chartSubTitle);
		}
	}
}

function reloadChartProperties() {
	var svg = d3.select("svg");
	svg.selectAll(".c3-axis-x-label").transition().duration(600).text($("#xtitle").val());
	svg.selectAll(".c3-axis-y-label").transition().duration(600).text($("#ytitle").val());

	if ($("#chartTitle").val() != null && $.trim($("#chartTitle").val()) != '') {
		svg.selectAll(".title").transition().duration(600).text($("#chartTitle").val());
	}

	if ($("#chartSubTitle").val() != null && $.trim($("#chartSubTitle").val()) != '') {
		svg.selectAll(".subtitle").transition().duration(600).text($("#chartSubTitle").val());
	}
}

function refreshData(data, reportjson) {
	var chartrows = reportjson.chart_rows;
	var chartcolumns = [];
	chartrows.forEach(function(k) {
		var arr = [ k ];
		data.forEach(function(v) {
			arr.push(v[k]);
		});
		chartcolumns.push(arr);
	});

	var chartcols = reportjson.chart_cols;
	var chartlabels = [ "x" ];
	data.forEach(function(j) {
		var l = '';
		chartcols.forEach(function(k) {
			l += j[k] + '-';
		});
		l = l.substring(0, l.length - 1);
		chartlabels.push(l);
	});
	chartcolumns.push(chartlabels);
	if(reportjson.charttype == 'doughnut_chart' || reportjson.charttype == 'pie_chart'){
		$(reportjson.chart_rows).each(function(index, valind) {
			var piedata = [];
			data.forEach(function(d, i) {
				var labind = '';
				reportjson.chart_cols.forEach(function(v) {
					labind += d[v] + '-';
				});
				piedata.push([ labind.substring(0, labind.length - 1), d[valind] ]);
			});
			reportjson.chart[index].unload();
			reportjson.chart[index].load({
				columns : piedata
			});
		});
	} else {
		reportjson.chart.load({
			columns : chartcolumns
		});
	}
	
}

function createDataFilters(containorid,reportjson) {
	var temp = containorid.split("-");
	containorid = temp[temp.length-1];
	var chartcols = reportjson.chart_cols;
	var data = reportjson.chartData;
	$("#select-filters-" + containorid).html('');// clear all first
	chartcols.forEach(function(k) {
		var filtercolid = "filtercol"+(new Date().getTime());
		var selecthtml = "<select id='"+ filtercolid + "' colname='" + k + "' data-live-search=\"true\" class=\"selectpicker\" title='Filter " + k + "' multiple>";
		var selectopts = [];
		data.forEach(function(s) {
			if (selectopts.indexOf(s[k]) == -1) {
				selectopts.push(s[k]);
			}
		});
		selectopts.sort();
		selectopts.forEach(function(s) {
			selecthtml += "<option value='" + s + "'>" + s + "</option>";
		});
		selecthtml += "</select>";
		$("#select-filters-" + containorid).append(selecthtml);
		$('#'+filtercolid).selectpicker();
		$('#'+filtercolid).change(function() {
			var filtereddata = [];
			var colname = $(this).attr("colname");
			if(colname){
				//this comes when I am calling filter changes
				var selectedvalues = $(this).val();
				// check if the filter already exists
				if (!reportjson.filters.colfilters[colname]) {
					reportjson.filters.colfilters[colname] = [];
					reportjson.filters.colfilters[colname] = selectedvalues;
				} else {
					reportjson.filters.colfilters[colname] = selectedvalues;
				}
				data.forEach(function(k) {
					var add = 0;
					reportjson.chart_cols.forEach(function(s) {
						if(!reportjson.filters.colfilters[s]){
							//nothing is selected in this column
							add++;//hack!
						}
						else if (reportjson.filters.colfilters[s] && reportjson.filters.colfilters[s].indexOf(k[s]) > -1) {
							add++;
						}
					});
					if (add == reportjson.chart_cols.length) {
						filtereddata.push(k);
					}
				});
				refreshData(filtereddata, reportjson);
			}
		});
		
		$("#change-chart-type-"+containorid).change(function(){
			//this gets called when I am calling charttype changes
			var selectedcharttype = $(this).val();
			transformChart(selectedcharttype, reportjson);
		});
	});
}

function transformChart(selectedcharttype, reportjson){
	if(selectedcharttype == 'line_chart'){
		reportjson.chart.transform('line');
	} else if(selectedcharttype == 'column_chart'){
		reportjson.chart.transform('bar');
	} else if(selectedcharttype == 'area_chart'){
		reportjson.chart.transform('area');
	} else if(selectedcharttype == 'pie_chart'){
		reportjson.chart.transform('pie');
	} else if(selectedcharttype == 'table'){
		reportjson.chart.transform('pie');
	}
}

function addDebugInformation(containorid, reportjson){
	var html = "";
	if($("#"+containorid).attr("debug") != undefined){
		//debug enabled
		html += "<li><div style='background:#FFCC93;height:150px;overflow:scroll;'>";
		html += "connection: " + reportjson.connection 
		+" <br>  query : " + reportjson.query 
		+" <br> report name : " + reportjson.report_name
		+" <br>  query_params : " + reportjson.query_params 		
		+" <br>  chartData : " + JSON.stringify( reportjson.chartData );
		html+="</div></li>";
	}
	return html;
}

function createRelevantContainers(containorid, reportjson) {
	var charttype = reportjson.charttype;
	$("#" + containorid).html(
					"<ul class=\"list-group\" style='list-style:none'> " 
					+ "<li class=\"list-group-item nopadding center-column select-filters\" id=\"select-filters-" + containorid + "\"> </li>"
					+ "<li class=\"list-group-item center-column noborder chart-cont-" + containorid + "\" id=\"chart-cont-" + containorid + "\"></li>"
					/*+ "<li class=\"list-group-item center-column noborder chart-type-cont\" id=\"chart-type-cont-" + containorid + "\">" 
						+ "<select name=\"selectchart\" charttype='CHARTTYPE' id='change-chart-type-"+containorid+"' class=\" selectpicker input-xlarge\">"
							+ "<option value='table' " + (charttype == 'table' ? 'selected=selected' : '') + " >Table</option>" 
							+ "<option value='area_chart' " + (charttype == 'area_chart' ? 'selected=selected' : '') + ">Area</option>" 
							+ "<option value='line_chart' " + (charttype == 'line_chart' ? 'selected=selected' : '') + ">Line</option>" 
							+ "<option value='column_chart' " + (charttype == 'column_chart' ? 'selected=selected' : '') + ">Column</option>" 
							//+ "<option value='stacked_chart' " + (charttype == 'stacked_chart' ? 'selected=selected' : '') + ">Stacked Column</option>" 
							//+ "<option value='bar_chart' " + (charttype == 'bar_chart' ? 'selected=selected' : '') + ">Bar</option>" 
							//+ "<option value='pie_chart' " + (charttype == 'pie_chart' ? 'selected=selected' : '') + ">Pie</option>" 
							//+ "<option value='doughnut_chart' " + (charttype == 'doughnut_chart' ? 'selected=selected' : '') + ">Doughnut</option>" 
						+ "</select>" 
					+ "<li>" */
					+ addDebugInformation(containorid, reportjson)
					+ "</ul>");
	//fix the heights in case its zero for dynamic charts
	var contheight = Math.round($("#chart-cont-" + containorid).height());
	var contwidth =Math.round( $("#chart-cont-" + containorid).width()); 
	var ww = $(window).width(); var wh = $(window).height();
	if(contheight < 100) {
	   if(contwidth > (ww - (ww/12))){
		   $("#chart-cont-" + containorid).height(wh/3);
	   }else if(contwidth > (ww/2)){
		   $("#chart-cont-" + containorid).height(wh/2);
	   }else{
		 //an aspect ratio of 16:9
		 $("#chart-cont-" + containorid).height(Math.round(wh/ww*contwidth));
	   }
	}
	$('.selectpicker').selectpicker();
}
