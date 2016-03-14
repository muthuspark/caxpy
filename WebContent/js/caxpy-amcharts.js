function createColumnChart(){
	var graphData = [];
	
	$.each(report.chart_rows, function(key,value){
		var linedata = 
			{"useNegativeColorIfDown":true,
		        "balloonText": "[[category]]<br><b>[[value]]</b>",
		        "fillAlphas": 0.8,
		        "lineAlpha": 0.2,
		        "type": "column",
		        "title": value,
		        "valueField":value 
		    };
		graphData.push(linedata);
	});
	
	var chartJson = {
		    "type": "serial",
		    "theme": "none",
		    "pathToImages": "/caxpy/amcharts/amcharts/images/",
		    "legend": {
		        "useGraphSettings": true
		    },
		    "dataProvider": report.chartData,
		    "graphs": graphData,
		    "chartScrollbar": {},
		    "chartCursor": {
		        "cursorPosition": "mouse"
		    },
		    "categoryField": report.chart_cols[0]
	};
	report.charttype = "column_chart";
	AmCharts.makeChart("column_chart", chartJson);
}

function createLineChart(){
	var graphData = [];
	
	$.each(report.chart_rows, function(key,value){
		var linedata = 
			{"useNegativeColorIfDown":true,
		        "balloonText": "[[category]]<br><b>[[value]]</b>",
		        "bullet": "round",
		        "bulletBorderAlpha": 1,
		        "bulletBorderColor": "#FFFFFF",
		        "hideBulletsCount": 50,
		        "lineThickness": 2,
		        "lineColor": "#fdd400",
		        "title": value,
		        "negativeLineColor": "#67b7dc",
		        "valueField":value 
		    };
		graphData.push(linedata);
	});
	
	
	var chartJson = {
		    "theme": "none",	
		    "type": "serial",
		    "pathToImages": "amcharts/amcharts/images/",
		    "dataProvider": report.chartData,
		    "legend": {
		        "useGraphSettings": true
		    },
		    "graphs": graphData,
		    "chartScrollbar": {
		    },
		    "chartCursor": {
		        "valueLineEnabled":true,
		        "valueLineBalloonEnabled":true
		    },
		    "categoryField": report.chart_cols[0]
	};
	
	report.charttype = "line_chart";
	AmCharts.makeChart("line_chart", chartJson);
}

function createBarChart(){
	var graphData = [];
	
	$.each(report.chart_rows, function(key,value){
		var linedata = 
			{"useNegativeColorIfDown":true,
		        "balloonText": "[[category]]<br><b>[[value]]</b>",
		        "fillAlphas": 0.8,
		        "lineAlpha": 0.2,
		        "type": "column",
		        "title": value,
		        "valueField":value 
		    };
		graphData.push(linedata);
	});
	
	
	var chartJson = {
		    "theme": "none",	
		    "type": "serial",
		    "rotate": true,
			"startDuration": 1,
		    "pathToImages": "amcharts/amcharts/images/",
		    "dataProvider": report.chartData,
		    "legend": {
		        "useGraphSettings": true
		    },
		    "graphs": graphData,
		    "chartScrollbar": {},
		    "chartCursor": {
		    	"cursorPosition": "mouse"
		    },
		    "categoryField": report.chart_cols[0],
		    "categoryAxis": {
				"gridPosition": "start",
				"position": "left"
			},
	};
	report.charttype = "bar_chart";
	AmCharts.makeChart("bar_chart", chartJson);
}
/**
 * 
 */