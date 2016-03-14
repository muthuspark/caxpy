/*GLOBALS*/
var currentConnection;
var databasestore;
var allConnections;
var Databases = function (){
	this.sql = [];
	this.csv = [];
	watch(this, ["sql", "csv"], function(){
		updateDatabaseRelatedUI();
	});
};

var updateDatabaseRelatedUI = function(){
	var sql = databasestore.sql;
	var csv = databasestore.csv;
	$("#connections").html('');
	$("#databases").html('');
	$(sql).each(function(index, value) {
		$("#connections").append("<option value='" + value.connectionname + "'>" + value.connectionname + "</option>");
		$("#databases").append("<li id='" + value.connectionname + "' onclick='selectDatabase(\"sql\", \"" + value.connectionname + "\");'><a href=\"#\">" + value.connectionname + "</a></li>");
	});
	// need to initialize the connection name
	var selectedDb = sessionStorage.getItem("selectedDB");
	if (selectedDb) {
		$('#connections option[value="' + selectedDb + '"]').prop('selected', true);
		report.connection = selectedDb;
	} else {
		if (report.connection) {
			$("#connections option[value='" + report.connection + "']").attr("selected", "selected");
		} else {
			$("#connections").val($("#connections option:first").val());
			report.connection = $("#connections").val();
		}
	}

	$("#connections").change(function() {
		var con = $("#connections").val();
		selectDatabase(null, con);
	});
	
	if (csv && csv.length > 0) {
		$("#databases").append("<li class=\"divider\"></li>");
		$(csv).each(function(index, value) {
			$("#csvdata").append("<option value='" + value.id + "'>" + value.filename + "</option>");
			$("#databases").append("<li id='file-" + value.id + "' onclick='selectCSVdb(\"csv\", \"" + value.id + "\")'><a href=\"#\">" + value.filename + "</a></li>");
		});
	}
	$("#databases").append("<li class=\"divider\"></li>");
	$("#databases")
			.append(
					"<li onclick=''><a title=\"Add database\" href=\"#\" data-toggle=\"modal\" onclick=\"databases();return false\"><i class=\"fa  fa-database fa-2x\" aria-hidden=\"true\"></i>Add Database</a></li>");
};
/**
 * handles database related work
 */
function databases(){
	var dbtype = report.connectionType || sessionStorage.getItem("selectedDBType");
	var db = report.connection || sessionStorage.getItem("selectedDB");
	$("#dbtypes").val(dbtype);
	toggleDBTypeViews();
	$('#connectionsDialog').modal('show');
	resetButtonState();
	if (dbtype == 'csv'){
		$("#csvdata").val(db);
	}else if (dbtype == 'sql'){
		$("#connections").val(db);
	}else if(dbtype == 'url'){
		$("#dataURL").val(report.connection || '');
		$("#dataKey").val(report.dataKey || '');
	}
}

function editSelectedConnection() {
	var selectedOption = $("#connections").val();
	if (selectedOption) {
		$('#newConnectionsDialog').modal('show');
	} else {
		return false;
	}
}

function saveDatabaseConnection() {
	$("#save_spinner").show();
	$.ajax({
		url : "data/service/saveconnection",
		type : "POST",
		data : $("#connectionDataForm").serialize(),
		statusCode : {
			200 : function(res) {
				databasestore.sql.push(res);
				$("#save_spinner").hide();
				$('#newConnectionsDialog').modal('hide');
				$("#addDbHelpTooltip").hide();
			},
			403 : function(xhr) {
				apprise(xhr.responseText);
			}
		}
	});
}

function createNewConnection() {
	$('#newConnectionsDialog').modal('show');
}

function testDatabaseConnection() {
	$("#test_spinner").show();
	$.ajax({
		url : "data/service/testconnection",
		type : "GET",
		data : $("#connectionDataForm").serialize(),
		statusCode : {
			200 : function() {
				apprise("Connection Successfull!");
				$("#test_spinner").hide();
			},
			403 : function(xhr) {
				apprise("Connection Failed! <br> " + xhr.responseText);
				$("#test_spinner").hide();
			}
		}
	}).fail(function() {
		$("#test_spinner").hide();
	});
}

function resetButtonState() {
	var valueSelected = $("#connections option:selected").val();
	if (valueSelected) {
		$("#editConnection").prop('disabled', false); // TO ENABLE
		$("#deleteConnection").prop('disabled', false); // TO ENABLE
	} else {
		$("#editConnection").prop('disabled', true);
		$("#deleteConnection").prop('disabled', true);
	}
}

function deleteSelectedConnection() {
	var selected = $("#connections option:selected").val();
	apprise('Are you sure you want to delete connection <strong>' + selected + '</strong>, the connection might be used by your reports?', {
		'verify' : true
	}, function(r) {
		if (r) {
			$.ajax({
				url : "data/service/deleteconnection",
				type : "GET",
				data : {
					connection : selected
				},
				statusCode : {
					200 : function() {
						$(databasestore.sql).each(function(index, obj){
							if(obj.connectionname == selected)
								databasestore.sql.splice(index, 1)
						});
						resetButtonState();
					}
				}
			});
		} else {
			return false;
		}
	});
}

function clearProgressBar() {
	$('#progress .bar').html('');
	$('#progress .bar').css('width', '0%');
}

function rebuildEverything(json){
	if (json.length == 0) {
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
	if (json.length > 1000 && report.chartProperties.showall == false) {
		showAlertMessage("alert-warning", "The data is huge, so showing only 1000 records");
		dotdot = true;
		json = json.slice(0, 999);// i dont want million records to be
		// rendered on my page.
	}
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
}

function setCSVDbToUI(id, json) {
	if(typeof json == 'object'){
		report.chartData = json;
	}else if(typeof json == 'string'){
		report.chartData = JSON.parse(json);
		json = report.chartData;
	}
	report.connection = "file-" + id;
	report.connectionType = 'csv';
	sessionStorage.setItem("file-" + id, JSON.stringify(json));
	rebuildEverything(json);
}

function setURLDbToUI(json) {
	if(typeof json == 'object'){
		report.chartData = json;
	}else if(typeof json == 'string'){
		report.chartData = JSON.parse(json);
		json = report.chartData;
	}
	report.connectionType = 'url';
	rebuildEverything(json);
}

function selectCSVdb(csvfileid) {
	var data = null;
	if(sessionStorage.getItem("file-" + csvfileid) && sessionStorage.getItem("file-" + csvfileid) != 'undefined'){
		data = JSON.parse(sessionStorage.getItem("file-" + csvfileid));
	}
	NProgress.start();
	if (!data) {
		$.ajax({
			url : "data/service/filedatabase",
			type : "GET",
			data : {
				fileid : csvfileid
			}
		}).done(function(data) {
			setCSVDbToUI(data.id,data.datajson);
		});
	} else {
		setCSVDbToUI(csvfileid,data);
	}
}

function selectURLdb(dataURL){
	$.ajax({
		url : dataURL,
		type : "GET"
	}).done(function(data) {
		var jsondata = $.extend(true, {} , data);
		if(report.dataKey){
			if(report.dataKey.indexOf(".") > -1){
				var keys = report.dataKey.split(".");
				keys.forEach(function(k){
					jsondata = jsondata[k];//loop to our meat where data is
				});
			}else{
				jsondata = jsondata[report.dataKey];
			}
		}
		setURLDbToUI(jsondata);
	});
}

function selectConnection() {
	clearProgressBar();
	newReport();
	report.connectionType = $("#dbtypes").val();
	if (report.connectionType == 'sql') {
		report.connection = $("#connections option:selected").val();
		sessionStorage.setItem("selectedDBType", $("#dbtypes").val());
		sessionStorage.setItem("selectedDB", report.connection);
	} else if (report.connectionType == 'csv') {
		report.connection = $("#csvdata option:selected").val();
	} else if (report.connectionType == 'url') {
		report.connection = $("#dataURL").val();
		report.dataKey = $("#dataKey").val();
	}
	$('#connectionsDialog').modal('hide');
	if (report.connectionType == 'csv') {
		hideAlertMessage();
		if (!$("#csvdata").val()) {
			// nothing is selected
			$('#columns').html('');
			$(".reports").html('');
			$(".dropper_col").html('');
			$('.drop_zone').html('');
			$(".dropper_row").html('');
			showAlertMessage("alert-warning", "No database selected for the query");
			NProgress.done();
			return false;
		}
		selectCSVdb($("#csvdata").val());
		NProgress.done();
	} else if(report.connectionType == 'url') {
		hideAlertMessage();
		// nothing is selected
		$('#columns').html('');
		$(".reports").html('');
		$(".dropper_col").html('');
		$('.drop_zone').html('');
		$(".dropper_row").html('');
		selectURLdb(report.connection);
	}
}

function toggleDBTypeViews() {
	// first hide all
	$(".dbtypes-cont").hide();
	var seldbtype = $("#dbtypes").val();
	$("#" + seldbtype + "-cont").show();
}

function selectDatabase(connectionType, connection) {
	report.connection = connection;
	report.connectionType = connectionType || report.connectionType;
	if (connection == 'datatable') {
		$("#table").show();
	} else {
		sessionStorage.setItem("selectedDB", report.connection);
	}
}

function initializeConnectionsDialogComponents() {
	databasestore = new Databases();
	$.ajax({
		url : "data/service/alldatabases",
		type : "GET"
	}).done(function(data) {
		databasestore.sql = data.sql;// all connections
		databasestore.csv = data.csv;
	});

	toggleDBTypeViews();
	$("#csvdata").change(function() {
		var val = $(this).val();
		getFiledatabaseData(val);
	});

	$("#dbtypes").change(function() {
		toggleDBTypeViews();
	});

	$("#connections").change(function() {
		var valueSelected = $(this).val();
		if (valueSelected) {
			$("#editConnection").prop('disabled', false); // TO ENABLE
			$("#deleteConnection").prop('disabled', false); // TO ENABLE
		} else {
			$("#editConnection").prop('disabled', true);
			$("#deleteConnection").prop('disabled', true);
		}
	});
}

function getFiledatabaseData(val) {
	var file = JSON.parse(sessionStorage.getItem("file-" + val));
	if (!file) {
		$.ajax({
			url : "data/service/filedatabase",
			type : "GET",
			data : {
				fileid : val
			}
		}).done(function(data) {
			report.chartData = data.datajson;
			report.connection = "file-" + data.id;
			sessionStorage.setItem("file-" + val, JSON.stringify(data));
		});
	} else {
		report.chartData = JSON.parse(file).datajson;
		report.connection = "file-" + file.id;
	}
}

function deleteUploadedFile() {
	var csvdataid = $("#csvdata").val();
	if (csvdataid) {
		apprise('Are you sure you want to delete ' + $("#csvdata option:selected").text() + ' file database? <strong> ', {
			'verify' : true
		}, function(r) {
			if (r) {
				$.ajax({
					url : "data/service/deletefiledatabase",
					type : "GET",
					data : {
						fileid : csvdataid
					},
					statusCode : {
						200 : function() {
							$("#csvdata option:selected").remove();
							sessionStorage.removeItem("file-" + csvdataid);
						},
						500 : function() {
							apprise("Failed to delete the file.");
						}
					}
				});
			}
		});
	}
}
