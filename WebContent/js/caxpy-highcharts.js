var morris_chart;
function createColumnChart(containerid, reportxml){
	 var seriesdata = [];
	 $(reportxml.chart_rows).each(function(index, value){
		var cob = {
				name:null, 
				data:[]
		}; 
		$(reportxml.chartData).each(function(ind, val){ 
			cob.name=value; cob.data.push(val[value]);  
		}); 
		seriesdata.push(cob);
	 }); 
	 
	 var categorydata = [];
	 $(reportxml.chartData).each(function(index, value){
		 var cat = "";
		 $(reportxml.chart_cols).each(function(ind, val){ 
			 cat+=value[val]+' '; 
		 });
		 categorydata.push(cat);
	 });
	 
	 
	 $('#'+containerid).highcharts({
	        chart: {
	            type: 'column'
	        },
	        xAxis: {
	            categories: categorydata
	        },
	        title: {
	            text: reportxml.report_name? reportxml.report_name.split("-")[1] : ''
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: seriesdata
	    });
}

function createLineChart(containerid, reportxml){
	var seriesdata = [];
	 $(reportxml.chart_rows).each(function(index, value){
		var cob = {
				name:null, 
				data:[]
		}; 
		$(reportxml.chartData).each(function(ind, val){ 
			cob.name=value; cob.data.push(val[value]);  
			 
		}); 
		seriesdata.push(cob);
	 }); 
	 
	 var categorydata = [];
	 $(reportxml.chartData).each(function(index, value){
		 var cat = "";
		 $(reportxml.chart_cols).each(function(ind, val){ 
			 cat+=value[val]+' '; 
		 });
		 categorydata.push(cat);
	 });
	 
	 
	 $('#'+containerid).highcharts({
	        chart: {
	            type: 'line'
	        },
	        xAxis: {
	            categories: categorydata
	        },
	        title: {
	            text: reportxml.report_name? reportxml.report_name.split("-")[1] : ''
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: seriesdata
	    });
}

function createAreaChart(containerid, reportxml){
	var seriesdata = [];
	 $(reportxml.chart_rows).each(function(index, value){
		var cob = {
				name:null, 
				data:[]
		}; 
		$(reportxml.chartData).each(function(ind, val){ 
			cob.name=value; cob.data.push(val[value]);  
			 
		}); 
		seriesdata.push(cob);
	 }); 
	 
	 var categorydata = [];
	 $(reportxml.chartData).each(function(index, value){
		 var cat = "";
		 $(reportxml.chart_cols).each(function(ind, val){ 
			 cat+=value[val]+' '; 
		 });
		 categorydata.push(cat);
	 });
	 
	 
	 $('#'+containerid).highcharts({
	        chart: {
	            type: 'area'
	        },
	        xAxis: {
	            categories: categorydata
	        },
	        title: {
	            text: reportxml.report_name? reportxml.report_name.split("-")[1] : ''
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	                '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        },
	        series: seriesdata
	    });
}

function createPieChart(containerid, reportxml){
	var cdata = reportxml.chartData;
	var piedata = [];
	var valind = reportxml.chart_rows[0];
	var labind = reportxml.chart_cols[0];
	$.each(cdata, function(index, val){
		var pd = {name : val[labind], y : val[valind]};
		piedata.push(pd);
	});
	
	$('#'+containerid).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 1,//null,
            plotShadow: false
        },
        title: {
            text: reportxml.report_name? reportxml.report_name.split("-")[1] : ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: reportxml.chart_rows[0],
            data: piedata
        }]
    });
}