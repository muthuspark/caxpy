var query_table_name;
var dataTable;
var isDirty = false;
var report = new Report();
var allReports = [];
var allGroups = { 0 : {"id" : 0 , name : "General" , desc : "Generic"} };
function openReport(report_name) {
	NProgress.start();
	$.ajax({
		url : "data/service/report",
		type : "GET",
		data : {
			"reportid" : report_name.split("-")[0]
		}
	}).done(function(data) {
		report = new Report();
		hideAlertMessage();
		showQueryBox();
		if(report.connectionType == 'csv' || report.connectionType == 'url'){
			//hide query box in case the connection is not of type sql
			hideQueryBox();
		}
		report.setData(data);
		//Highlight
		var report_id=report_name.split("-")[0];
		var $report=$("#" + report_id);
		$('#reports-container').find("a").removeClass("activereport");
		$report.addClass("activereport");
		
		$("#query").val(data.query);
		$(".dropper_col").html('');
		$(".dropper_row").html('');
		for (var i = 0; i < report.chart_cols.length; i++) {
			$(".dropper_col").append("<div class='alert alert-info column_boxes sortable' role='alert'>" + report.chart_cols[i] + "</div>");
		}
		for (var i = 0; i < report.chart_rows.length; i++) {
			$(".dropper_row").append("<div class='alert alert-info column_boxes sortable' role='alert'>" + report.chart_rows[i] + "</div>");
		}
		// populate the query parameters
		populateParametersDialogue();
//		if(data.query){
//			openReportExecuteQuery(data.query);
//		}else{
		$('#columns').html('');// clear the old values
		$.each(report.query_colums, function(index, value) {
			var skip = false;
			if (report.chart_cols && report.chart_cols.indexOf(value) > -1) {
				skip = true;
			}
			if (report.chart_rows && report.chart_rows.indexOf(value) > -1) {
				skip = true;
			}
			if (!skip) {
				$('#columns').append("<li class='alert alert-info column_boxes sortable' role='alert'>" + value + "</li>");
			}
		});
		initDragDrop();
//		}
		show(report.charttype);
		NProgress.done();
	}).fail(function() {
		showAlertMessage("alert-error", "Failed to open the report");
		NProgress.done();
	});
}
function dataFilters(){
	var conditions = "<select><option value='eq'>Equals</option><option value='ne'>Does not equal</option><option value='gt'>Greater than</option><option value='gte'>Greater than or Equal to</option><option value='lt'>Less than</option><option value='lte'>Less than or Equal to</option><option value='bw'>Between</option></select>";
	report.chart_rows.forEach(function(val){
		var html = "<tr><td>"+val+"</td><td>"+conditions+"</td><td><input type='text' value=''></td></tr>";
		$("#filtersbody").append(html);
	});
	$("#dataFilters").modal('show');
}
function populateParametersDialogue() {
	if (report.query_params && report.query_params.length > 0) {
		$("#paramcount").val(report.query_params.length);
		$("#params").html('');
		$(report.query_params).each(
				function(index, val) {
					var paramhtml = '<tr id="parameter' + (index + 1) + '"><td class="form-group">Parameter</td><td><input type="text" class="form-control" id="param' + (index + 1)
							+ '" placeholder="Name" value="' + val.name + '"></td><td class="form-group">Value</td><td><input type="text" class="form-control" id="value' + (index + 1)
							+ '" placeholder="Value" value="' + val.value + '"></td><td class="form-group"><span onclick="deleteParameter(' + (index + 1) + ')">&times;</span></td></tr>';
					$("#params").append(paramhtml);
				});

	}
}

function openReportExecuteQuery(query) {
	NProgress.start();
	report.query = query ? query : $("#query").val();
	$.ajax({
		url : "data/service/execute",
		type : "GET",
		data : {
			"query" : getExecutableQuery(),
			"db" : report.connection ? report.connection :  $("#connections").val()
		}
	}).done(function(data) {
		// pre process data
		var dotdot = false;
		// sometimes data is huge, so need to show only a minimum not all
		if (data.length > 1000 && report.chartProperties.showall == false) {
			showAlertMessage("alert-warning", "The data is huge, so showing only 1000 records");
			dotdot = true;
			data = data.slice(0, 999);// i dont want million records to be
										// rendered on my page.
		}
		report.chartData = data;
		report.chartDataBackup = data;
		$('#columns').html('');// clear the old values
		report.query_colums = [];
		$.each(report.chartData[0], function(key, value) {
			report.query_colums.push(key);// got the column headers
		});
		$.each(report.query_colums, function(index, value) {
			var skip = false;
			if (report.chart_cols && report.chart_cols.indexOf(value) > -1) {
				skip = true;
			}
			if (report.chart_rows && report.chart_rows.indexOf(value) > -1) {
				skip = true;
			}
			if (!skip) {
				$('#columns').append("<li class='alert alert-info column_boxes sortable' role='alert'>" + value + "</li>");
			}
		});
		initDragDrop();
		generateTable(report.chartData, dotdot);
		NProgress.done();
		if (report.realtime) {
			setTimeout(regenerateReport, 3000);
		}
	}).fail(function(jqXHR, textStatus, error) {
		showAlertMessage("alert-error", jqXHR.responseText);
		NProgress.done();
	});
}

function deleteReport() {
	apprise('Are you sure you want to delete the report " <strong> ' + report.report_name.split(/-(.+)/)[1] + ' </strong>", the report might be embedded somewhere?', {
		'verify' : true
	}, function(r) {
		if (r) {
			// delete the currently active report
			$.ajax({
				url : "data/service/delete",
				type : "GET",
				data : {
					"report_name" : report.report_name
				},
				statusCode : {
					200 : function() {
						var temp = report.report_id;
						$('#reports-container').find("a").removeClass("activereport");
						// remove active
						// $("#"+temp).parent().prev().find("a").addClass("activereport");//select
						// previous
						// $("#"+temp).parent().prev().find("a").click();
						$("#" + temp).remove();// removes
						newReport();// clear everything
					}
				}
			});
		} else {
			return false;
		}
	});
}

function newReport() {
	// resetting report object
	$('#reports-container').find("a").removeClass("activereport");
	report = new Report();
}

function newRealTimeReport() {
	// resetting report object
	$('#reports-container').find("a").removeClass("activereport");
	// resetting report object
	report = new Report();
	report.realtime = true;
}

function queryParameters() {
	$("#queryParamsDialog").modal('show');
}

function deleteParameter(id) {
	report.removeQueryParameter(id);
}

function addNewParameter() {
	var paramcount = parseInt($("#paramcount").val()) + 1;
	$("#paramcount").val(paramcount);
	var paramhtml = '<tr id="parameter' + paramcount + '"><td class="form-group">Parameter</td><td><input type="text" class="form-control" id="param' + paramcount
			+ '" placeholder="Name"></td><td class="form-group">Value</td><td><input type="text" class="form-control" id="value' + paramcount
			+ '" placeholder="Value"></td><td class="form-group"><span onclick="deleteParameter(' + paramcount + ')">&times;</span></td></tr>';
	$("#params").append(paramhtml);
}

function saveParameters() {
	var paramcount = parseInt($("#paramcount").val()) + 1;
	report.query_params = [];
	for (var i = 1; i <= paramcount; i++) {
		var param = {};
		param.name = $("#param" + i).val();
		param.value = $("#value" + i).val();
		if (param.name) {
			report.addQueryParameters(param);
		}
	}
	regenerateReport(null);
	$("#queryParamsDialog").modal('hide');
	save();
}

function save() {
	if (!report.connection) {
		if (!currentConnection) {
			currentConnection = $("#connections option:first").val();
		}
		report.connection = currentConnection;
		setChartPropertiesToModal();
	}
	if ((report.query || report.connectionType!='sql') && report.report_name ) {
		NProgress.start();
		var reportx = $.extend(true, {} , report);//deep copy by report object
		delete reportx.chart;//not needed
		var gpname = $.trim($("#group_name").val())==""? 0 : $.trim($("#group_name").val());
		$.ajax({
			url : "data/service/save",
			type : "POST",
			data : {
				"report" : JSON.stringify(reportx), 
				"groupid" : gpname
			}
		// save the entire report as a json object in the backend.
		}).done(function(data) {
			if (data.status == 'success') {
				report.report_id = data.report.split("-")[0];// get the
																// report id
				report.report_name = data.report;
			}
			$('#saveReport').modal('hide');
			NProgress.done();
			isDirty = false;
			getReports();
		});
	} else {
		$('#saveReport').modal('show');
	}
}

function saveReport() {
	if (!report.report_name) {
		report.report_name = $("#report_name").val();
	}
	save();
}

function saveAs() {
	report.report_name = $("#report_name").val();
	save();
}


function openSettings() {
	$.ajax({
		url : "data/service/mailsettings",
		type : "GET"
	}).done(function(data) {
		$("#hostname").val(data.hostname);
		$("#hostport").val(data.hostport);
		$("#mailusername").val(data.mailusername);
		$("#mailpassword").val(data.mailpassword);
		$("#servertype").val(data.servertype);
		$("#fromemail").val(data.fromemail);
		$("#fromname").val(data.fromname);
		$("#usestarttls").val(data.usestarttls);
		$("#usessl").val(data.usessl);
		$('#settingsDialog').modal('show');
	});
}

function saveSettings() {
	var settings = {
		"mailsettings" : {
			hostname : $("#hostname").val(),
			hostport : $("#hostport").val(),
			mailusername : $("#mailusername").val(),
			mailpassword : $("#mailpassword").val(),
			servertype : $("#servertype").val(),
			fromemail : $("#fromemail").val(),
			fromname : $("#fromname").val(),
			usestarttls : $("#usestarttls").val(),
			usessl : $("#usessl").val()
		}
	};
	$.ajax({
		url : "data/service/savesettings",
		type : "POST",
		data : {
			"settings" : JSON.stringify(settings)
		},
		statusCode : {
			200 : function() {
				$('#settingsDialog').modal('hide');
			}
		}
	});
}

function share() {
	if (report.report_name) {
		// the report is saved already
		if (!report.report_id) {
			report.report_id = report.report_name.split("-")[0];
		}
		$("#embed-code").text("");
		$("#embed-code").text(
				"<div class='caxpy-report' reportid=\"r" + report.report_id + "\" data-params='" + JSON.stringify(report.query_params) + "' ></div><script type=\"text/javascript\" src=\""
						+ window.location.origin + "/caxpy/embed.js\"></script>");
		/*
		 * $("#embed-code-svg").text('');
		 * $("#embed-code-svg").text($("#"+report.charttype).html());
		 */
		$('#shareReport').modal('show');

	} else {
		// not saved yet, so lets save it
		$('#saveReport').modal('show');
	}
}

function saveReportAs() {
	$('#saveReport').modal('show');
}

function getExecutableQuery() {
	var querytoexecute = report.query;
	if (report.query_params && report.query_params.length > 0) {
		// parameters exist
		$(report.query_params).each(function(index, value) {
			var find = "<" + value.name + ">";
			var re = new RegExp(find, 'g');
			querytoexecute = querytoexecute.replace(re, value.value);
		});
	}
	return querytoexecute;
}
var executeQuery = function(query) {
	NProgress.done();
	NProgress.start();
	report.query = query ? query : $("#query").val();
	$.ajax({
		url : "data/service/execute",
		type : "GET",
		data : {
			"query" : getExecutableQuery(),
			"db" : report.connection ? report.connection : $("#connections").val()
		}
	}).done(function(data) {
		hideAlertMessage();
		if (data.length == 0) {
			showAlertMessage("alert-warning", "No data available for the query");
			NProgress.done();
			return false;
		}
		report.chart_rows = [];
		report.chart_cols = [];
		report.query_colums = [];

		// clear dom elements
		$('#columns').html('');
		$(".reports").html('');
		$(".dropper_col").html('');
		$(".dropper_row").html('');

		// pre process data
		var dotdot = false;
		// sometimes data is huge, so need to show only a minimum not all
		if (data.length > 1000 && report.chartProperties.showall == false) {
			showAlertMessage("alert-warning", "The data is huge, so showing only 1000 records");
			dotdot = true;
			data = data.slice(0, 999);// i dont want million records to be
										// rendered on my page.
		}
		report.chartData = data;
		report.chartDataBackup = data;
		$('#columns').html('');// clear the old values
		$('.drop_zone').html('');
		report.chart_cols = [];
		report.chart_rows = [];
		report.query_colums = [];
		$.each(report.chartData[0], function(key, value) {
			report.query_colums.push(key);// got the column headers
		});
		$.each(report.query_colums, function(index, value) {
			$('#columns').append("<li class='alert alert-info column_boxes sortable' role='alert'>" + value + "</li>");
		});

		initDragDrop();
		generateTable(report.chartData, dotdot);
		NProgress.done();
		if (report.realtime) {
			setTimeout(regenerateReport, 3000);
		}
	}).fail(function(jqXHR, textStatus, error) {
		showAlertMessage("alert-error", jqXHR.responseText);
		NProgress.done();
	});
};

/**
 * This method is where the queries are created using the columns and rows
 * dropped on the drop containers
 */
var generateQuery = function() {
	var col = "";
	var row = "";
	for (var i = 0; i < report.chart_cols.length; i++) {
		col += report.chart_cols[i] + ",";
	}

	for (var i = 0; i < report.chart_rows.length; i++) {
		row += "sum(" + report.chart_rows[i] + ") as " + report.chart_rows[i] + ",";
	}

	if (report.chart_cols.length > 0 && report.chart_rows.length > 0) {
		col = col.substring(0, col.length - 1);
		row = row.substring(0, row.length - 1);
		if (!query_table_name) {
			var query = $("#query").val().split(/\s+/);
			for (var i = 0; i < query.length; i++) {
				var q = query[i];
				if ($.trim(q) == 'from' || $.trim(q) == 'FROM' || $.trim(q) == '*from' || $.trim(q) == '*FROM') {
					query_table_name = query[i + 1];
					break;
				}
			}
		}
		var newQuery = "select " + col + "," + row + " from " + query_table_name + " group by " + col;
		regenerateReport(newQuery);
	}
};

function regenerateReport(newQuery) {
	if (!newQuery) {
		newQuery = $("#query").val();
	}
	if (!report.realtime) {
		NProgress.start();
	}
	
	if(!newQuery){
		return false;
	}
	report.query = newQuery;
	$.ajax({
		url : "data/service/execute",
		type : "GET",
		data : {
			"query" : getExecutableQuery(),
			"db" : report.connection ? report.connection : $("#connections").val()
		}
	}).done(function(data) {
		NProgress.done();
		// pre process data
		var dotdot = false;
		// sometimes data is huge, so need to show only a minimum not all
		if (data.length > 1000) {
			showAlertMessage("alert-warning", "The data is huge, so showing only 1000 record");
			dotdot = true;
			data = data.slice(0, 999);// i dont want million records to be
										// rendered on my page.
		}
		report.chartData = data;// this is where the real magic happens
		report.chartDataBackup = data;
		if (report.charttype == 'table') {
			generateTable(report.chartData, dotdot);
		} else {
			show(report.charttype);
		}
		if (report.realtime) {
			setTimeout(regenerateReport, 3000);
		}

	}).fail(function() {
		showAlertMessage("alert-error", "Failed to regenerate report");
		NProgress.done();
	});
}

function refreshDataView() {
	//if ($(".reports").html() != '') {
	if(report.charttype != 'table'){
		// its empty
		show(report.charttype);
	} else {
		// hide all first
		showHideTableColumns();
	}
}

function showHideTableColumns(){
	$("#data_table td").hide();
	$("#data_table th").hide();
	// show whats needed
	$(report.chart_cols).each(function(index, value) {
		//var column = dataTable.column(report.query_colums.indexOf(value));
		//column.visible(true);
		$("#data_table td.td-"+report.query_colums.indexOf(value)).show();
		$("#data_table th.th-"+report.query_colums.indexOf(value)).show();
	});

	$(report.chart_rows).each(function(index, value) {
		//var column = dataTable.column(report.query_colums.indexOf(value));
		//column.visible(true);
		$("#data_table td.td-"+report.query_colums.indexOf(value)).show();
		$("#data_table th.th-"+report.query_colums.indexOf(value)).show();
	});
}

function initDragDrop() {

	$("#columns").sortable({
		connectWith : ".column-collectors"
	});
	$("ul.dropper_col").sortable({
		connectWith : ".column-collectors",
		remove : function(event, ui) {
			var index = report.chart_cols.indexOf(ui.item.text());
			if (index > -1) {
				report.chart_cols.splice(index, 1);
			}

			if (report.chart_cols.length > 0 && report.chart_rows.length > 0) {
				// generateQuery();
				refreshDataView();
			} else {
				// clear page html
				$(".reports").html('');
			}
		},
		receive : function(event, ui) {
			if ($.inArray(ui.item.text(), report.query_colums) < 0) {
				// the column is not available yet, so lets add it
				report.query_colums.push(ui.item.text());
			}

			if ($.inArray(ui.item.text(), report.chart_cols) < 0) {
				// the column is not available yet, so lets add it
				report.chart_cols.push(ui.item.text());
			}

			if (report.chart_cols.length > 0 && report.chart_rows.length > 0) {
				// generateQuery();
				refreshDataView();
			}
		}
	});
	$("ul.dropper_row").sortable({
		connectWith : ".column-collectors",
		remove : function(event, ui) {
			$("ul.dropper_row").removeClass("warning");
			hideAlertMessage();
			var x = report.chartData[0];// check first data
			if (report.chart_rows && report.chart_rows.length > 0) {
				$(report.chart_rows).each(function(index, value) {
					var unknown = x[value];
					if (isNaN(unknown)) {
						showAlertMessage("alert-error", "Dropped column doesn't look like a number column.");
						$("ul.dropper_row").addClass("warning");
					}
				});
			}

			var index = report.chart_rows.indexOf(ui.item.text());
			if (index > -1) {// if available then remove from the chart row
								// array
				report.chart_rows.splice(index, 1);
			}

			if (report.chart_cols.length > 0 && report.chart_rows.length > 0) {
				refreshDataView();
			} else {
				// clear page html
				$(".reports").html('');
			}
		}/*
			 * , change: function( event, ui ) { var rows = $( "ul.dropper_row
			 * div" ); report.chart_rows = []; for(var
			 * i=(rows.length-1);i>=0;i--){ var v = rows[i];
			 * if($.trim($(v).text())!=''){ report.chart_rows.push($(v).text()); } } }
			 */,
		receive : function(event, ui) {
			hideAlertMessage();
			$("ul.dropper_row").removeClass("warning");
			var x = report.chartData[0];// check first data
			var unknown = x[ui.item.text()];
			if (!isNaN(unknown)) {
				if ($.inArray(ui.item.text(), report.query_colums) < 0) {
					// the column is not available yet, so lets add it
					report.query_colums.push(ui.item.text());
				}

				if ($.inArray(ui.item.text(), report.chart_rows) < 0) {
					// the column is not available yet, so lets add it
					report.chart_rows.push(ui.item.text());
				}

				if (report.chart_cols.length > 0 && report.chart_rows.length > 0) {
					// generateQuery();
					refreshDataView();
				}
			} else {
				// /need to reject it and send it back to where it came from
				showAlertMessage("alert-error", "Dropped column doesn't look like a number column.");
				$("ul.dropper_row").addClass("warning");
			}

		}
	});
	$("ul.dropper_row, ul.dropper_col, #columns").disableSelection();
}

function generateTable(data, dotdot) {
	var table_html = "<table id='data_table' class='table table-striped'><thead><tr>";
	$.each(data[0], function(index, value) {
		table_html += "<th class='th-"+report.query_colums.indexOf(index)+"'>" + index + "</th>";
	});
	table_html += "</tr></thead><tbody>";
	$.each(data, function(index, value) {
		table_html += "<tr>";
		$.each(data[index], function(index, val) {
			table_html += "<td class='td-"+report.query_colums.indexOf(index)+"'>" + val + "</td>";
		});
		table_html += "</tr>";
	});
	if (dotdot) {
		showAlertMessage("alert-info", "Showing only 1000 Records");
	}
	table_html += "</tbody></table>";
	$("#table").html(table_html);
	showHideTableColumns();
	$("#table").show();
}
function hideAlertMessage() {
	$("#alert-type").hide();
}
function hideQueryBox(){
	$(".queryheader").hide();
	$(".querybox").hide();
}
function showQueryBox(){
	$(".queryheader").show();
	$(".querybox").show();
}
function showAlertMessage(type, message) {
	if(message && $.trim(message)!=''){
		$("#alert-type").addClass(type);
		$("#alert-message").html(message);
		$("#alert-type").show();
	}
}
function show(type) {
	//apply filters if applicable here before it even hits the reports
	/*var table = $("#filtertable");
	datatorender = report.chartData;
	if(table && table.length > 0 && table[0].rows){
		var datafilters = [];
		for (var i=1; i<table[0].rows.length; i++) {
	    	try{
	    		var tableRow = table[0].rows[i];
	            var rowData = {};
	            rowData.field = tableRow.cells[0].innerHTML;
	            rowData.condition = $.parseHTML(tableRow.cells[1].innerHTML)[1].value;
	            rowData.value = $.parseHTML(tableRow.cells[2].innerHTML)[1].value;
	            datafilters.push(rowData);
	    	}catch(e){
	    		//don't do anything
	    	}
	    }
	    report.filters.rowfilters = datafilters;
	    datatorender = [];
		report.chartData.forEach(function(val){
		  var add = 0;
		  datafilters.forEach(function(f){
		      if(f.condition == 'eq' && val[f.field] == f.value){
		        add++;
		      }
		      else if(f.condition == 'gt' && val[f.field] > f.value){
		        add++
		      }
		      else if(f.condition == 'lt' && val[f.field] < f.value){
		        add++
		      }
		      else if(f.condition == 'ne' && val[f.field] != f.value){
		        add++
		      }
		      else if(f.condition == 'lte' && val[f.field] <= f.value){
		        add++
		      }
		      else if(f.condition == 'gte' && val[f.field] >= f.value){
		        add++
		      }
		  });
		  if(add == filter.length-1){
			  datatorender.push(val);
		  }
		});
	}*/
	
	if (report.realtime && report.chart && report.charttype == type) {
		refreshData(report.chartData, report);
		return;
	}
	$(".reports").hide();
	$(".reports").html('');//clear every thing
	if (!type) {
		type = 'table';
	}
	report.charttype = type;
	if (report.chart_cols.length == 0 || report.chart_rows == 0) {
		// empty rows and cols
		showAlertMessage("alert-info", "Columns and Rows are not configured. Please drag and drop appropriate values.");
		return false;
	}
	$("#" + type).show();
	if (type == 'table') {
		generateTable(report.chartData, false);
	} else if (type == 'line_chart') {
		createLineChart(type, report);
	} else if (type == 'column_chart') {
		createColumnChart(type, report);
	} else if (type == 'bar_chart') {
		createBarChart(type, report);
	} else if (type == 'area_chart') {
		createAreaChart(type, report);
	} else if (type == 'pie_chart') {
		createPieChart(type, report);
	} else if (type == 'doughnut_chart') {
		createDoughnutChart(type, report);
	} else if (type == 'radar_chart') {
		createRadarChart(type, report);
	} else if (type == 'bubble_chart') {
		createBubbleChart(type, report);
	} else if (type == 'scatter_chart') {
		createScatterChart(type, report);
	} else if (type == 'chord_chart') {
		createChordChart(type, report);
	} else if (type == 'sunburst_chart') {
		createSunburstChart(type, report);
	} else if (type == 'treelayout_chart') {
		createTreeLayoutChart(type, report);
	} else if(type == 'stacked_chart'){
		createStackedColumnChart(type, report);
	} else if(type == 'funnel_chart'){
		createFunnelChart(type, report);
	}
}

function editReportName(reportid){
	allReports.forEach(function(val){
		if(val.reportid == reportid){
			$("#ereport_name").val(val.reportname);
			$("#egroup_name").val(val.groupid);
			$("#ereportid").val(val.reportid);
		}
	});
	$('#editReport').modal('show');
}

function getReports() {
	$.ajax({
		url : "data/service/reports",
		type : "GET",
		context : document.body
	}).done(function(data) {
		allReports = data;
		$("#saved-reports").html('');
		var groups = []; 
		var dataset = {} ; 
		data.forEach(function(val){ 
			if(!dataset[val.groupid]){ 
				groups.push(val.groupid); 
				dataset[val.groupid]  = [];  
			}
			dataset[val.groupid].push(val); 
		});
		
		var html = ""; 
		groups.forEach(function(val){ 
			html+="<li><br/><h4 class='tree-toggler'>"+allGroups[val].name+"</h4><ul class='report-box  tree'>"; 
			dataset[val].forEach(function(rep){ 
				html+="<li ><a href='#' id='" + rep.reportid + "' onclick=\"openReport('" + rep.reportid + "');return false;\" title='" + rep.reportname + "' >" 
				+ rep.reportname +" <span class='pull-right editbtn' onclick='editReportName("+rep.reportid+")'><i class='fa fa-pencil fa-1'></i></span></a></li>"; 
			});  
			html+="</ul></li>";  
		});
		
		$("#saved-reports").append(html);
		
		$('h4.tree-toggler').click(function () {
	        $(this).parent().children('ul.tree').toggle(300);
	    });
		

		$(".report-box li").hover(function(){
			$(this).find(".editbtn").toggle();
		});
		
		// set active report if available
		if (report.report_id) {
			var $report=$("#" + report.report_id);
			$('#reports-container').find("a").removeClass("activereport");
			$report.addClass("activereport");
		}
	});
}

function initializeUIComponents() {
	getGroups();
	initializeConnectionsDialogComponents();
	$("#query").keyup(function() {
		report.query = $(this).val();
		$("#query").val($(this).val());
	});
}

function exportAsPNG() {
	$("svg").attr("xmlns", "http://www.w3.org/2000/svg");
	var svg = $("svg")[0].outerHTML;
	$("#svgforexport").val(svg);
	document.topng.submit();
}

function setChartProperties() {
	if (report.chartProperties) {
		var cp = report.chartProperties;
		$("#chartTitle").val(cp.chartTitle);
		$("#chartSubTitle").val(cp.chartSubTitle);
		$("#xtitle").val(cp.xtitle);
		$("#ytitle").val(cp.ytitle);
		$("#cache").val(cp.cache);
		if (cp.showall && cp.showall == false) {
			$("#showall").prop("checked", false);
		}
	}
}

function openChartProperties() {
	setChartProperties();
	$("#chartSettingsDialog").modal('show');
}

function setChartPropertiesToModal() {
	var cp = new ChartProperties();
	cp.chartTitle = $("#chartTitle").val();
	cp.chartSubTitle = $("#chartSubTitle").val();
	cp.xtitle = $("#xtitle").val();
	cp.ytitle = $("#ytitle").val();
	cp.cache = $("#cache").val();
	cp.showall = $("#showall").is(':checked');
	report.chartProperties = cp;
}

function saveChartProperties() {
	setChartPropertiesToModal();
	$("#chartSettingsDialog").modal('hide');
	if (report.charttype != 'table') {
		reloadChartProperties();
	}
	save();
}

function getGroups(){
	$.ajax({
		url : "data/service/groups",
		type : "GET",
		context : document.body
	}).done(function(data) {
		$("#egroup_name").html('');
		$("#group_name").html('');
		data.forEach(function(val){ 
			allGroups[val.id] = val;
			$("#group_name").append("<option value='"+val.id+"'>"+val.name+"</option>");
			$("#egroup_name").append("<option value='"+val.id+"'>"+val.name+"</option>");
		});
		$("#group_name").val($("#group_name option:first").val());
		$("#egroup_name").val($("#egroup_name option:first").val());
		getReports();
	});
}

function saveEditedDetails(){
	$("#edit_spinner").show();
	var gpname = $.trim($("#egroup_name").val())==""? 0 : $.trim($("#egroup_name").val());
	$.ajax({
		url : "data/service/saveedits",
		type : "POST",
		data : {
			"reportid" : $("#ereportid").val(), 
			"groupid" : gpname,
			"reportname" : $("#ereport_name").val()
		},
		statusCode : {
			200 : function() {
				getReports();
				$("#edit_spinner").hide();
				$('#editReport').modal('hide');
			}
		}
	});
}

function saveFilters(){
	var table = $("#filtertable");
	if(table && table.length > 0 && table[0].rows){
		var datafilters = [];
		for (var i=1; i<table[0].rows.length; i++) {
	    	try{
	    		var tableRow = table[0].rows[i];
	            var rowData = {};
	            rowData.field = tableRow.cells[0].innerHTML;
	            rowData.condition = $.parseHTML(tableRow.cells[1].innerHTML)[0].value;
	            rowData.value = $.parseHTML(tableRow.cells[2].innerHTML)[0].value;
	            datafilters.push(rowData);
	    	}catch(e){
	    		//don't do anything
	    	}
	    }
	    report.filters.rowfilters = datafilters;
	}
	$("#dataFilters").modal('hide');
}

function fillSelect(url, propVal , propName , containerid){
	$.ajax({
		url : url,
		type : "GET",
		context : document.body
	}).done(function(data) {
		$("#"+containerid).html('');
		data.forEach(function(d){ 
			$("#"+containerid).append("<option value='"+d[propVal]+"'>"+d[propName]+"</option>");
		});
	});
}

$(document).ready(function() {
	initializeUIComponents();
	$("#caxpy-main-container").css("height", ($(window).height()-50) + 'px');
	$("#reports-container").css("max-height", ($(window).height()-120) + 'px');
	$(".reports").css("height", ($(window).height() - 350) + "px");
	$("#caxpy-col-left").resizable({ 
		maxWidth: 550,
	    minWidth: 200
	});
	$( "#caxpy-col-left" ).on( "resize", function( event, ui ) {
    	$('#caxpy-col-middle').css('width', ($('#caxpy-main-container').width() - $( "#caxpy-col-left" ).width()) + 30 );
	});
	$("#demo_video").show();
});

// Other libraries
!function(n,e){"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():n.NProgress=e()}(this,function(){function n(n,e,t){return e>n?e:n>t?t:n}function e(n){return 100*(-1+n)}function t(n,t,r){var i;return i="translate3d"===c.positionUsing?{transform:"translate3d("+e(n)+"%,0,0)"}:"translate"===c.positionUsing?{transform:"translate("+e(n)+"%,0)"}:{"margin-left":e(n)+"%"},i.transition="all "+t+"ms "+r,i}function r(n,e){var t="string"==typeof n?n:o(n);return t.indexOf(" "+e+" ")>=0}function i(n,e){var t=o(n),i=t+e;r(t,e)||(n.className=i.substring(1))}function s(n,e){var t,i=o(n);r(n,e)&&(t=i.replace(" "+e+" "," "),n.className=t.substring(1,t.length-1))}function o(n){return(" "+(n.className||"")+" ").replace(/\s+/gi," ")}function a(n){n&&n.parentNode&&n.parentNode.removeChild(n)}var u={};u.version="0.1.6";var c=u.settings={minimum:.08,easing:"ease",positionUsing:"",speed:200,trickle:!0,trickleRate:.02,trickleSpeed:800,showSpinner:!0,barSelector:'[role="bar"]',spinnerSelector:'[role="spinner"]',parent:"body",template:'<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'};u.configure=function(n){var e,t;for(e in n)t=n[e],void 0!==t&&n.hasOwnProperty(e)&&(c[e]=t);return this},u.status=null,u.set=function(e){var r=u.isStarted();e=n(e,c.minimum,1),u.status=1===e?null:e;var i=u.render(!r),s=i.querySelector(c.barSelector),o=c.speed,a=c.easing;return i.offsetWidth,l(function(n){""===c.positionUsing&&(c.positionUsing=u.getPositioningCSS()),f(s,t(e,o,a)),1===e?(f(i,{transition:"none",opacity:1}),i.offsetWidth,setTimeout(function(){f(i,{transition:"all "+o+"ms linear",opacity:0}),setTimeout(function(){u.remove(),n()},o)},o)):setTimeout(n,o)}),this},u.isStarted=function(){return"number"==typeof u.status},u.start=function(){u.status||u.set(0);var n=function(){setTimeout(function(){u.status&&(u.trickle(),n())},c.trickleSpeed)};return c.trickle&&n(),this},u.done=function(n){return n||u.status?u.inc(.3+.5*Math.random()).set(1):this},u.inc=function(e){var t=u.status;return t?("number"!=typeof e&&(e=(1-t)*n(Math.random()*t,.1,.95)),t=n(t+e,0,.994),u.set(t)):u.start()},u.trickle=function(){return u.inc(Math.random()*c.trickleRate)},function(){var n=0,e=0;u.promise=function(t){return t&&"resolved"!=t.state()?(0==e&&u.start(),n++,e++,t.always(function(){e--,0==e?(n=0,u.done()):u.set((n-e)/n)}),this):this}}(),u.render=function(n){if(u.isRendered())return document.getElementById("nprogress");i(document.documentElement,"nprogress-busy");var t=document.createElement("div");t.id="nprogress",t.innerHTML=c.template;var r,s=t.querySelector(c.barSelector),o=n?"-100":e(u.status||0),l=document.querySelector(c.parent);return f(s,{transition:"all 0 linear",transform:"translate3d("+o+"%,0,0)"}),c.showSpinner||(r=t.querySelector(c.spinnerSelector),r&&a(r)),l!=document.body&&i(l,"nprogress-custom-parent"),l.appendChild(t),t},u.remove=function(){s(document.documentElement,"nprogress-busy"),s(document.querySelector(c.parent),"nprogress-custom-parent");var n=document.getElementById("nprogress");n&&a(n)},u.isRendered=function(){return!!document.getElementById("nprogress")},u.getPositioningCSS=function(){var n=document.body.style,e="WebkitTransform"in n?"Webkit":"MozTransform"in n?"Moz":"msTransform"in n?"ms":"OTransform"in n?"O":"";return e+"Perspective"in n?"translate3d":e+"Transform"in n?"translate":"margin"};var l=function(){function n(){var t=e.shift();t&&t(n)}var e=[];return function(t){e.push(t),1==e.length&&n()}}(),f=function(){function n(n){return n.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,function(n,e){return e.toUpperCase()})}function e(n){var e=document.body.style;if(n in e)return n;for(var t,r=i.length,s=n.charAt(0).toUpperCase()+n.slice(1);r--;)if(t=i[r]+s,t in e)return t;return n}function t(t){return t=n(t),s[t]||(s[t]=e(t))}function r(n,e,r){e=t(e),n.style[e]=r}var i=["Webkit","O","Moz","ms"],s={};return function(n,e){var t,i,s=arguments;if(2==s.length)for(t in e)i=e[t],void 0!==i&&e.hasOwnProperty(t)&&r(n,t,i);else r(n,s[1],s[2])}}();return u});