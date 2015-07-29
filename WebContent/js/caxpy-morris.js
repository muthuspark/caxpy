var chart;
var chartCreated = false;
/*function createColumnChart(containorid, reportxml){
	if(reportxml.realtime && chartCreated){
		chart.setData(reportxml.chartData);
	}else{
		chart = Morris.Bar({
			  element: containorid,
			  data: reportxml.chartData,
			  xkey: reportxml.chart_cols,
			  parseTime:false,
			  ykeys: reportxml.chart_rows,
			  barColors:['#E67A77','#D9DD81','#79D1CF'],
			  labels: reportxml.chart_rows
		});
		chartCreated = true;
	}
}*/

/*function createLineChart(containorid, reportxml){
	if(reportxml.realtime && chartCreated){
		chart.setData(reportxml.chartData);
	}else{
		chart = Morris.Line({
			  element: containorid,
			  data: reportxml.chartData,
			  xkey: reportxml.chart_cols,
			  ykeys: reportxml.chart_rows,
			  parseTime:false,
			  smooth : false,
			  labels: reportxml.chart_rows
		});
		chartCreated = true;
	}
}*/

function createAreaChart(containorid, reportxml){
	if(reportxml.realtime && chartCreated){
		chart.setData(reportxml.chartData);
	}else{
		chart = Morris.Area({
			  element: containorid,
			  data: reportxml.chartData,
			  xkey: reportxml.chart_cols,
			  parseTime:false,
			  smooth : false,
			  ykeys: reportxml.chart_rows,
			  labels: reportxml.chart_rows
		});
		chartCreated = true;
	}
}

/*function createPieChart(containorid, reportxml){
	var cdata = reportxml.chartData;
	var piedata = [];
	var valind = reportxml.chart_rows[0];
	var labind = reportxml.chart_cols;
	$.each(cdata, function(index, val){
		var label_val = "";
		$.each(labind, function(index, value){
			label_val += val[value] + " - ";
		});
		var pd = {label : label_val.substring(0, label_val.length-2), value : val[valind]};
		piedata.push(pd);
	});
	if(reportxml.realtime && chartCreated){
		chart.setData(piedata);
	}else{
		chart = Morris.Donut({
			  element: containorid,
			  data: piedata,
			  labelColor: '#1fb5ac',
			  colors: [
			           '#E67A77','#D9DD81','#79D1CF','#95D7BB'
			       ]
		});chartCreated = true;
	}
}*/