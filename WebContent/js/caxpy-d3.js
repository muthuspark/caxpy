var d3colors = [ '#E67A77', '#D9DD81', '#79D1CF', '#c7b570', '#c6cdc7',
		'#335c64', '#768935', '#507282', '#5c4a56', '#aa7455', '#574109',
		'#837722', '#73342d', '#0a5564', '#9c8f57', '#7895a4', '#4a5456',
		'#b0a690', '#0a3542' ];
function createChordChart() {
	showAlertMessage("alert-info","Chord Diagram is build using 2 Text columns and 1 Number column.  <a href='http://caxpy.com/blog/what-is-a-d3js-chord-diagram-what-can-you-visualize-using-it-and-how/' title='What is a D3jS Chord diagram? What can you visualize using it and how?' target='_blank'>Read more about Chord Diagrams</a> ");
	var chordx = [];
	var chordy = [];
	var chordvals = [];
	$(report.chartData).each(function(index, value) {
		var yval = value[report.chart_cols[0]];
		if (chordy.indexOf(yval) == -1) {
			chordy.push(yval);
		}
		var xval = value[report.chart_cols[1]];
		if (chordx.indexOf(xval) == -1) {
			chordx.push(xval);
		}
	});

	var tempMatrix = [];
	// create the data matrix
	$(report.chartData)
			.each(
					function(index, value) {
						var m = {};
						m[value[report.chart_cols[0]] + "-"
								+ value[report.chart_cols[1]]] = value[report.chart_rows[0]];
						tempMatrix.push(m);
						chordvals.push(value[report.chart_rows[0]]);
					});

	var indices = [];
	for (var i = 0; i < chordx.length; i++) {
		for (var j = 0; j < chordy.length; j++) {
			indices.push(chordy[j] + "-" + chordx[i]);
		}
	}

	var data_matrix = [];
	var s = 0;
	for (var i = 0; i < chordy.length; i++) {
		data_matrix[i] = [];
		for (var j = 0; j < chordx.length; j++) {
			data_matrix[i][j] = chordvals[s++];
		}
	}

	var chord = d3.layout.chord().padding(.05).sortSubgroups(d3.descending)
			.matrix(data_matrix);

	var width = 960, height = 700, innerRadius = Math.min(width, height) * .35, outerRadius = innerRadius * 1.1;

	var fill = d3.scale.ordinal().domain(d3.range(4)).range(d3colors);

	var svg = d3.select("#chord_chart").append("svg").attr("width", width)
			.attr("height", height).append("g").attr("transform",
					"translate(" + width / 2 + "," + height / 2 + ")");

	svg.append("g").selectAll("path").data(chord.groups).enter().append("path")
			.style("fill", function(d) {
				return fill(d.index);
			}).style("stroke", function(d) {
				return fill(d.index);
			}).attr(
					"d",
					d3.svg.arc().innerRadius(innerRadius).outerRadius(
							outerRadius));

	var ticks = svg.append("g").selectAll("g").data(chord.groups).enter()
			.append("g").selectAll("g").data(groupTicks).enter().append("g")
			.attr(
					"transform",
					function(d) {
						return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
								+ "translate(" + outerRadius + ",0)";
					});

	ticks.append("line").attr("x1", 1).attr("y1", 0).attr("x2", 5)
			.attr("y2", 0).style("stroke", "#000");

	ticks.append("text").attr("x", 15).attr("dy", ".35em").attr("transform",
			function(d) {
				return d.angle > Math.PI ? "rotate(180)translate(-16)" : null;
			}).style("text-anchor", function(d) {
		return d.angle > Math.PI ? "end" : null;
	}).text(function(d) {
		return d.label;
	});

	svg.append("g").attr("class", "chord").selectAll("path").data(chord.chords)
			.enter().append("path").attr("d",
					d3.svg.chord().radius(innerRadius)).style("fill",
					function(d) {
						return fill(d.target.index);
					}).style("opacity", 1);

	// Returns an array of tick angles and labels, given a group.
	function groupTicks(d) {
		var k = (d.endAngle - d.startAngle) / d.value;
		return d3.range(0, d.value, 1000).map(function(v, i) {
			return {
				angle : v * k + d.startAngle,
				label : i % 5 ? null : v / 1000 + "k"
			};
		});
	}
//	var crd = svg.selectAll(".chord");
//	function mouseover(d, i) {
//		
//		crd.classed("fade", function(p) {
//	        return p.source.index != i
//	            && p.target.index != i;
//	      });
//	}
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