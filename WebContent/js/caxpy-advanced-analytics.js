/**
 * Mahout Algorithms
 */
function stockanalysis() {
	$(".reports").hide();
	$("#stock_analysis").show();

}
function getStockData() {
	fetchData();
}

var width = 900;
var height = 500;
String.prototype.format = function() {
	var formatted = this;
	for (var i = 0; i < arguments.length; i++) {
		var regexp = new RegExp('\\{' + i + '\\}', 'gi');
		formatted = formatted.replace(regexp, arguments[i]);
	}
	return formatted;
};

var dateFormat = d3.time.format("%Y-%m-%d");
var data = [];

function min(a, b) {
	return a < b ? a : b;
}

function max(a, b) {
	return a > b ? a : b;
}

function buildChart(data) {
	width = $("#candlestick").width() - 20;
	var margin = 50;
	var chart = d3.select("#candlestick").append("svg:svg").attr("class",
			"chart").attr("width", width).attr("height", height);
	var y = d3.scale.linear().domain([ d3.min(data.map(function(x) {
		return x["Low"];
	})), d3.max(data.map(function(x) {
		return x["High"];
	})) ]).range([ height - margin, margin ]);

	var x = d3.scale.linear().domain([ d3.min(data.map(function(d) {
		return dateFormat.parse(d.Date).getTime();
	})), d3.max(data.map(function(d) {
		return dateFormat.parse(d.Date).getTime();
	})) ]).range([ margin, width - margin ]);

	chart.selectAll("line.x").data(x.ticks(10)).enter().append("svg:line")
			.attr("class", "x").attr("x1", x).attr("x2", x).attr("y1", margin)
			.attr("y2", height - margin).attr("stroke", "#ccc");

	chart.selectAll("line.y").data(y.ticks(10)).enter().append("svg:line")
			.attr("class", "y").attr("x1", margin).attr("x2", width - margin)
			.attr("y1", y).attr("y2", y).attr("stroke", "#ccc");

	chart.selectAll("text.xrule").data(x.ticks(10)).enter().append("svg:text")
			.attr("class", "xrule").attr("x", x).attr("y", height - margin)
			.attr("dy", 20).attr("text-anchor", "middle").text(function(d) {
				var date = new Date(d * 1000);
				return (date.getMonth() + 1) + "/" + date.getDate();
			});

	chart.selectAll("text.yrule").data(y.ticks(10)).enter().append("svg:text")
			.attr("class", "yrule").attr("x", width - margin).attr("y", y)
			.attr("dy", 0).attr("dx", 20).attr("text-anchor", "middle").text(
					String);

	chart.selectAll("rect").data(data).enter().append("svg:rect").attr("x",
			function(d) {
				return x(dateFormat.parse(d.Date).getTime());
			}).attr("y", function(d) {
		return y(max(d.Open, d.Close));
	}).attr("height", function(d) {
		return y(min(d.Open, d.Close)) - y(max(d.Open, d.Close));
	}).attr("width", function(d) {
		return 0.5 * (width - 2 * margin) / data.length;
	}).attr("fill", function(d) {
		return d.Open > d.Close ? "red" : "green";
	}).attr("class", "pane").attr("width", width).attr("height", height);

	x.domain([ new Date($("#startstockdate").val()), new Date($("#endstockdate").val()) ]);
	y.domain([ 0, d3.max(data, function(d) {
		return d.value;
	}) ]);
	
	chart.selectAll("line.stem").data(data).enter().append("svg:line").attr(
			"class", "stem").attr(
			"x1",
			function(d) {
				return x(dateFormat.parse(d.Date).getTime()) + 0.25
						* (width - 2 * margin) / data.length;
			}).attr(
			"x2",
			function(d) {
				return x(dateFormat.parse(d.Date).getTime()) + 0.25
						* (width - 2 * margin) / data.length;
			}).attr("y1", function(d) {
		return y(d.High);
	}).attr("y2", function(d) {
		return y(d.Low);
	}).attr("stroke", function(d) {
		return d.Open > d.Close ? "red" : "green";
	});
}

function createChordChart(containorid, reportxml) {
	showAlertMessage("alert-info","Chord Diagram is build using 2 Text columns and 1 Number column.  <a href='http://caxpy.com/blog/what-is-a-d3js-chord-diagram-what-can-you-visualize-using-it-and-how/' title='What is a D3jS Chord diagram? What can you visualize using it and how?' target='_blank'>Read more about Chord Diagrams</a> ");
	var chart_cols = reportxml.chart_cols;
	var chart_rows = reportxml.chart_rows;
	var data = reportxml.chartData;
	data.forEach(function(d){
		  var l = '';
		  chart_cols.forEach(function(k){
		    l+=d[k]+'-';
		  });
		  d.columnlabel = l.substring(0,l.length-1);
	});
	
	var margin = {
			top : 60,
			right : 20,
			bottom : 50,
			left : 40
		}, w = $("#"+containorid).width() - margin.left - margin.right, h = $("#"+containorid).height() - margin.top - margin.bottom;
		if(w <=0){
			w = 600;
		}
		if(h <=0){
			h = 500;
		}
	var chordx = [];
	var chordy = [];
	data.forEach(function(value){
	  if(chordx.indexOf(value[chart_cols[0]])==-1){
	    chordx.push(value[chart_cols[0]]);
	  }
	  
	  if(chordy.indexOf(value[chart_cols[1]])==-1){
	    chordy.push(value[chart_cols[1]]); 
	  }
	});

	var chordxy = chordx.concat(chordy);

	var getval = function(label){
	  var retval = 0;
	  data.forEach(function(v){
	    if(v.columnlabel == label){
	      retval = v[chart_rows[0]];
	    }
	  });
	  return retval;
	};
	
	var outer = [];
	var index = 0;
	chordxy.forEach(function(vy){
	  var inner = [];
	  chordxy.forEach(function(vx){
	    if((chordx.indexOf(vx)>-1 && chordx.indexOf(vy)>-1) || (chordy.indexOf(vx)>-1 && chordy.indexOf(vy)>-1) )
	  	{
	      inner.push(0);
	    }	else{
	      if(outer.length < chordx.length){
	        inner.push(getval(vy+'-'+vx));
	      }else{
	        inner.push(getval(vx+'-'+vy));
	      }
	    }
	    index++;
		});
	  outer.push(inner);
	});


	var r1 = h / 2, r0 = r1 - 100;
	var matrix = outer;

    var fill = d3.scale.category20();

    var chord = d3.layout.chord()
        .padding(.02)
        .sortSubgroups(d3.descending)
        .sortChords(d3.descending);

    var arc = d3.svg.arc()
        .innerRadius(r0)
        .outerRadius(r0 + 20);

    var svg = d3.select("#"+containorid).append("svg:svg")
        .attr("width", w)
        .attr("height", h)
      .append("svg:g")
        .attr("id", "circle")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

        svg.append("circle")
            .attr("r", r0 + 20);

    chord.matrix(matrix);

    var g = svg.selectAll("g.group")
        .data(chord.groups())
      .enter().append("svg:g")
        .attr("class", "group")
        .on("mouseover", mouseover)
        .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden"); });

    g.append("svg:path")
        .style("stroke", "black")
        .style("fill", function(d) { return fill(d.index); })
        .attr("d", arc);

    g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "10px")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + (r0 + 26) + ")"
              + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d,i) { return chordxy[i]; });

      var chordPaths = svg.selectAll("path.chord")
            .data(chord.chords())
          .enter().append("svg:path")
            .attr("class", "chord")
            .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
            .style("fill", function(d) { return fill(d.target.index); })
            .attr("d", d3.svg.chord().radius(r0))
            .on("mouseover", function (d) {
              d3.select("#tooltip")
                .style("visibility", "visible")
                .html(chordTip(d))
                .style("top", function () { return (d3.event.pageY - 100)+"px"})
                .style("left", function () { return (d3.event.pageX - 100)+"px";})
            })
            .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden"); });

      function chordTip (d) {
        var p = d3.format(".2%"), q = d3.format(",.3r")
        return d;
      }

      function groupTip (d) {
        var p = d3.format(".1%"), q = d3.format(",.3r")
        return "Hospital Info: <br/>";
      }

      function mouseover(d, i) {
        d3.select("#tooltip")
          .style("visibility", "visible")
          .html("groupTip(rdr(d))")
          .style("top", function () { return (d3.event.pageY - 80)+"px"})
          .style("left", function () { return (d3.event.pageX - 130)+"px";})

        chordPaths.classed("fade", function(p) {
          return p.source.index != i
              && p.target.index != i;
        });
      }
}

function createTreeLayoutChart(containorid, reportxml) {
	var diameter = 960;

	var tree = d3.layout.tree().size([ 360, diameter / 2 - 120 ]).separation(
			function(a, b) {
				return (a.parent == b.parent ? 1 : 2) / a.depth;
			});

	var diagonal = d3.svg.diagonal.radial().projection(function(d) {
		return [ d.y, d.x / 180 * Math.PI ];
	});

	var svg = d3.select("#" + containorid).append("svg")
			.attr("width", diameter).attr("height", diameter - 150).append("g")
			.attr("transform",
					"translate(" + diameter / 2 + "," + diameter / 2 + ")");

	var arry = reportxml.chartData;
	var colName = reportxml.chart_cols[0];
	function convert(array) {
		var map = {};
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			obj.children = [];
			map[obj.employee_id] = obj;
			var parent = obj.supervisor_id || '-';
			if (!map[parent]) {
				map[parent] = {
					children : []
				};
			}
			map[parent].children.push(obj);
		}
		return map['-'].children;
	}

	var r = convert(arry);

	var root = {
		"full_name" : "Admin",
		"children" : r
	};

	var nodes = tree.nodes(root), links = tree.links(nodes);

	var link = svg.selectAll(".link").data(links).enter().append("path").attr(
			"class", "link").attr("d", diagonal);

	var node = svg.selectAll(".node").data(nodes).enter().append("g").attr(
			"class", "node").attr("transform", function(d) {
		return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
	})

	node.append("circle").attr("r", 4.5);

	node.append("text").attr("dy", ".31em").attr("text-anchor", function(d) {
		return d.x < 180 ? "start" : "end";
	}).attr("transform", function(d) {
		return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
	}).text(function(d) {
		return d.full_name;
	});

	d3.select(self.frameElement).style("height", diameter - 150 + "px");
}

function createSunburstChart(containorid, reportxml) {

	var arry = reportxml.chartData;
	var colName = reportxml.chart_cols[0];
	function convert(array) {
		var map = {};
		for (var i = 0; i < array.length; i++) {
			var obj = array[i];
			obj.children = [];
			map[obj.employee_id] = obj;
			var parent = obj.supervisor_id || '-';
			if (!map[parent]) {
				map[parent] = {
					children : []
				};
			}
			map[parent].children.push(obj);
		}
		return map['-'].children;
	}

	var r = convert(arry);
	var json = {
		colName : "Parent",
		"children" : r
	};
	// Dimensions of sunburst.
	var width = 750;
	var height = 600;
	var radius = Math.min(width, height) / 2;

	// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
	var b = {
		w : 125,
		h : 30,
		s : 3,
		t : 10
	};

	// Total size of all segments; we set this later, after loading the data.
	var totalSize = 0;

	var vis = d3.select("#sunburst_chart_containor").append("svg:svg").attr(
			"width", width).attr("height", height).append("svg:g").attr("id",
			"container").attr("transform",
			"translate(" + width / 2 + "," + height / 2 + ")");

	var partition = d3.layout.partition()
			.size([ 2 * Math.PI, radius * radius ]).value(function(d) {
				return 100;
			});

	var arc = d3.svg.arc().startAngle(function(d) {
		return d.x;
	}).endAngle(function(d) {
		return d.x + d.dx;
	}).innerRadius(function(d) {
		return Math.sqrt(d.y);
	}).outerRadius(function(d) {
		return Math.sqrt(d.y + d.dy);
	});

	createVisualization(json);
	// Main function to draw and set up the visualization, once we have the
	// data.
	function createVisualization(json) {

		// Basic setup of page elements.
		initializeBreadcrumbTrail();
		drawLegend();
		d3.select("#togglelegend").on("click", toggleLegend);

		// Bounding circle underneath the sunburst, to make it easier to detect
		// when the mouse leaves the parent g.
		vis.append("svg:circle").attr("r", radius).style("opacity", 0);

		// For efficiency, filter nodes to keep only those large enough to see.
		var nodes = partition.nodes(json).filter(function(d) {
			return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
		});

		var path = vis.data([ json ]).selectAll("path").data(nodes).enter()
				.append("svg:path").attr("display", function(d) {
					return d.depth ? null : "none";
				}).attr("d", arc).attr("fill-rule", "evenodd").style(
						"fill",
						function(d) {
							return d3colors[Math
									.floor((Math.random() * 10) + 1)];
						}).style("opacity", 1).on("mouseover", mouseover);

		// Add the mouseleave handler to the bounding circle.
		d3.select("#sunburst_chart_containor").on("mouseleave", mouseleave);

		// Get total size of the tree = value of root node from partition.
		totalSize = path.node().__data__.value;
	}
	;

	// Fade all but the current sequence, and show it in the breadcrumb trail.
	function mouseover(d) {

		var percentage = (100 * d.value / totalSize).toPrecision(3);
		var percentageString = percentage + "%";
		if (percentage < 0.1) {
			percentageString = "< 0.1%";
		}

		d3.select("#percentage").text(percentageString);

		d3.select("#explanation").style("visibility", "");

		var sequenceArray = getAncestors(d);
		updateBreadcrumbs(sequenceArray, percentageString);

		// Fade all the segments.
		d3.selectAll("path").style("opacity", 0.3);

		// Then highlight only those that are an ancestor of the current
		// segment.
		vis.selectAll("path").filter(function(node) {
			return (sequenceArray.indexOf(node) >= 0);
		}).style("opacity", 1);
	}

	// Restore everything to full opacity when moving off the visualization.
	function mouseleave(d) {

		// Hide the breadcrumb trail
		d3.select("#trail").style("visibility", "hidden");

		// Deactivate all segments during transition.
		d3.selectAll("path").on("mouseover", null);

		// Transition each segment to full opacity and then reactivate it.
		d3.selectAll("path").transition().duration(1000).style("opacity", 1)
				.each("end", function() {
					d3.select(this).on("mouseover", mouseover);
				});

		d3.select("#explanation").style("visibility", "hidden");
	}

	// Given a node in a partition layout, return an array of all of its
	// ancestor
	// nodes, highest first, but excluding the root.
	function getAncestors(node) {
		var path = [];
		var current = node;
		while (current.parent) {
			path.unshift(current);
			current = current.parent;
		}
		return path;
	}

	function initializeBreadcrumbTrail() {
		// Add the svg area.
		var trail = d3.select("#sequence").append("svg:svg").attr("width",
				width).attr("height", 50).attr("id", "trail");
		// Add the label at the end, for the percentage.
		trail.append("svg:text").attr("id", "endlabel").style("fill", "#000");
	}

	// Generate a string that describes the points of a breadcrumb polygon.
	function breadcrumbPoints(d, i) {
		var points = [];
		points.push("0,0");
		points.push(b.w + ",0");
		points.push(b.w + b.t + "," + (b.h / 2));
		points.push(b.w + "," + b.h);
		points.push("0," + b.h);
		if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
			points.push(b.t + "," + (b.h / 2));
		}
		return points.join(" ");
	}

	// Update the breadcrumb trail to show the current sequence and percentage.
	function updateBreadcrumbs(nodeArray, percentageString) {

		// Data join; key function combines name and depth (= position in
		// sequence).
		var g = d3.select("#trail").selectAll("g").data(nodeArray, function(d) {
			return d[colName] + d.depth;
		});

		// Add breadcrumb and label for entering nodes.
		var entering = g.enter().append("svg:g");

		entering.append("svg:polygon").attr("points", breadcrumbPoints).style(
				"fill", function(d) {
					return d3colors[Math.floor((Math.random() * 10) + 1)];
				});

		entering.append("svg:text").attr("x", (b.w + b.t) / 2).attr("y",
				b.h / 2).attr("dy", "0.35em").attr("text-anchor", "middle")
				.text(function(d) {
					return d.full_name;
				});

		// Set position for entering and updating nodes.
		g.attr("transform", function(d, i) {
			return "translate(" + i * (b.w + b.s) + ", 0)";
		});

		// Remove exiting nodes.
		g.exit().remove();

		// Now move and update the percentage at the end.
		d3.select("#trail").select("#endlabel").attr("x",
				(nodeArray.length + 0.5) * (b.w + b.s)).attr("y", b.h / 2)
				.attr("dy", "0.35em").attr("text-anchor", "middle").text(
						percentageString);

		// Make the breadcrumb trail visible, if it's hidden.
		d3.select("#trail").style("visibility", "");

	}

	function drawLegend() {

		// Dimensions of legend item: width, height, spacing, radius of rounded
		// rect.
		var li = {
			w : 75,
			h : 30,
			s : 3,
			r : 3
		};

		var legend = d3.select("#legend").append("svg:svg").attr("width", li.w)
				.attr("height", d3.keys(d3colors).length * (li.h + li.s));

		var g = legend.selectAll("g").data(d3.entries(d3colors)).enter()
				.append("svg:g").attr("transform", function(d, i) {
					return "translate(0," + i * (li.h + li.s) + ")";
				});

		g.append("svg:rect").attr("rx", li.r).attr("ry", li.r).attr("width",
				li.w).attr("height", li.h).style("fill", function(d) {
			return d.value;
		});

		g.append("svg:text").attr("x", li.w / 2).attr("y", li.h / 2).attr("dy",
				"0.35em").attr("text-anchor", "middle").text(function(d) {
			return d.key;
		});
	}

	function toggleLegend() {
		var legend = d3.select("#legend");
		if (legend.style("visibility") == "hidden") {
			legend.style("visibility", "");
		} else {
			legend.style("visibility", "hidden");
		}
	}

	// Take a 2-column CSV and transform it into a hierarchical structure
	// suitable
	// for a partition layout. The first column is a sequence of step names,
	// from
	// root to leaf, separated by hyphens. The second column is a count of how
	// often that sequence occurred.
	function buildHierarchy(csv) {
		var root = {
			"name" : "root",
			"children" : []
		};
		for (var i = 0; i < csv.length; i++) {
			var sequence = csv[i][0];
			var size = +csv[i][1];
			if (isNaN(size)) { // e.g. if this is a header row
				continue;
			}
			var parts = sequence.split("-");
			var currentNode = root;
			for (var j = 0; j < parts.length; j++) {
				var children = currentNode["children"];
				var nodeName = parts[j];
				var childNode;
				if (j + 1 < parts.length) {
					// Not yet at the end of the sequence; move down the tree.
					var foundChild = false;
					for (var k = 0; k < children.length; k++) {
						if (children[k]["name"] == nodeName) {
							childNode = children[k];
							foundChild = true;
							break;
						}
					}
					// If we don't already have a child node for this branch,
					// create it.
					if (!foundChild) {
						childNode = {
							"name" : nodeName,
							"children" : []
						};
						children.push(childNode);
					}
					currentNode = childNode;
				} else {
					// Reached the end of the sequence; create a leaf node.
					childNode = {
						"name" : nodeName,
						"size" : size
					};
					children.push(childNode);
				}
			}
		}
		return root;
	};
}




function appendToData(x) {
	if (data.length > 0) {
		return;
	}
	data = x.query.results.quote;
	for (var i = 0; i < data.length; i++) {
		data[i].timestamp = (new Date(data[i].date).getTime() / 1000);
	}
	data = data.sort(function(x, y) {
		return dateFormat.parse(x.Date).getTime()
				- dateFormat.parse(y.Date).getTime();
	});
	buildChart(data);
}

function buildQuery() {
	var symbol = $("#stocksymbol").val();
	var end = $("#endstockdate").val();
	var start = $("#startstockdate").val();
	if ($.trim(symbol) != '') {
		var query = "select * from yahoo.finance.historicaldata where symbol = \""
				+ symbol
				+ "\" and startDate = \""
				+ start
				+ "\" and endDate = \"" + end + "\"";
		query = encodeURIComponent(query);
		var url = "http://query.yahooapis.com/v1/public/yql?q={0}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=appendToData"
				.format(query);
		return url;
	}
	return "";
}
function fetchData() {
	url = buildQuery();
	scriptElement = document.createElement("SCRIPT");
	scriptElement.type = "text/javascript";
	// i add to the url the call back function
	scriptElement.src = url;
	document.getElementsByTagName("HEAD")[0].appendChild(scriptElement);
}
/**
 * D3 Charts
 */
