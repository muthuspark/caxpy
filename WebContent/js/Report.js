/**
 * Chart Properties
 */
var ChartProperties = function() {
	this.chartTitle = null;
	this.xtitle = null;
	this.ytitle = null;
	this.cache = null;
	this.showall = null;
};
/**
 * Report Class
 */
var Report = function () {
	
	//Class variables
	this.query = null;
	this.chartData = new Array();
	this.charttitle = null;
	this.charttype = 'table';
	this.report_name = null;
	this.chart_rows = [];
	this.rawData = new Array();
	this.chart_cols = [];
	this.query_colums = [];
	this.report_name = null;
	this.group_name = null;
	this.report_id = null;
	this.connection = null;
	this.connectionType = null;
	this.query_params = [];
	this.realtime = false;
	this.chartProperties = new ChartProperties();
	this.chart = null;
	this.dataKey = null;
	this.filters = { "colfilters" : {}, "rowfilters" : {}};

	//observers
	watch(this, "connection", function(){
		$("#reportinformation-database").text(" Database : "+ this.connection);
		if(this.connectionType == 'sql' || this.connectionType == 'csv'){
		    $("#databases li").removeClass("active");
			$("#"+this.connection).addClass("active");
			regenerateReport(null);
	    }
	});
	
	watch(this, "report_name", function(){
		$("#reportinformation-name").text(this.report_name.split(/-(.+)/)[1]);
	});
	
	watch(this, "connectionType", function(){
		if(this.connectionType == 'csv' || this.connectionType == 'url'){
			hideQueryBox();
		}else{
			showQueryBox();
		}
	});
	
	//initializations
	var paramcount = 1;
	$("#paramcount").val(paramcount);
	var paramhtml = '<tr id="parameter'+paramcount+'"><td class="form-group">Parameter</td><td><input type="text" class="form-control" id="param'+paramcount+'" placeholder="Name"></td><td class="form-group">Value</td><td><input type="text" class="form-control" id="value'+paramcount+'" placeholder="Value"></td><td class="form-group"><span onclick="deleteParameter('+paramcount+')">&times;</span></td></tr>';
	$("#params").html(paramhtml);
	// clear dom elements
	$("#alert-type").hide();
	$("#select-filters").html('');
	$("#query").val('');
	$('#columns').html('');
	$(".reports").html('');
	$(".dropper_col").html('');
	$("#filtersbody").html('');
	$(".dropper_row").html('');
};

Report.prototype.setData = function (data) {
	this.query = data.query;
	this.chartData = data.chartData;
	this.charttitle = data.charttitle ;
	this.charttype = data.charttype;
	this.report_name = data.report_name;
	this.chart_rows = data.chart_rows;
	this.rawData = data.rawData;
	this.chart_cols = data.chart_cols;
	this.query_colums = data.query_colums;
	this.report_name = data.report_name;
	this.group_name = data.group_name;
	this.report_id = data.report_id ;
	this.dataKey = data.dataKey;
	this.connection = data.connection;
	this.connectionType = data.connectionType;
	this.query_params = data.query_params;
	this.realtime = data.realtime ;
	this.chartProperties = data.chartProperties;
	this.filters = data.filters? data.filters : this.filters;
};

Report.prototype.addQueryParameters = function(param){
	this.query_params.push(param);
};

Report.prototype.removeQueryParameter = function (index){
	delete this.query_params[(index-1)];
	$("#parameter"+id).remove();
};

