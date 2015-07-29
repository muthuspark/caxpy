function createColumnChart(containorid, reportxml){
	var svg = dimple.newSvg("#"+containorid, $("#"+containorid).width(), $("#"+containorid).height());
    var chart = new dimple.chart(svg, reportxml.chartData);
//    var orderData = [];
//    $(report.chartData).each(function(index, value){
//      orderData.push(value["months"]); 
//    });
    var x = chart.addCategoryAxis("x", reportxml.chart_cols);
//    x.addOrderRule(orderData);
    chart.addMeasureAxis("y",reportxml.chart_rows);
    chart.addLegend(65, 10, 510, 20, "right");
    chart.addSeries(null, dimple.plot.bar);
    chart.draw();
}

function createLineChart(containorid, reportxml){
	var svg = dimple.newSvg("#"+containorid, $("#"+containorid).width(), $("#"+containorid).height());
    var chart = new dimple.chart(svg, reportxml.chartData);
    chart.addCategoryAxis("x", reportxml.chart_cols);
    chart.addMeasureAxis("y",reportxml.chart_rows);
    chart.addLegend(65, 10, 510, 20, "right");
    chart.addSeries(null, dimple.plot.line);
    chart.draw();
}

function createAreaChart(containorid, reportxml){
	var svg = dimple.newSvg("#"+containorid, $("#"+containorid).width(), $("#"+containorid).height());
    var chart = new dimple.chart(svg, reportxml.chartData);
    chart.addCategoryAxis("x", reportxml.chart_cols);
    chart.addMeasureAxis("y",reportxml.chart_rows);
    chart.addLegend(65, 10, 510, 20, "right");
    chart.addSeries(null, dimple.plot.area);
    chart.draw();
}

function createPieChart(containorid, reportxml){
	var svg = dimple.newSvg("#"+containorid, $("#"+containorid).width(), $("#"+containorid).height());
    var chart = new dimple.chart(svg, reportxml.chartData);
    chart.addMeasureAxis("p",reportxml.chart_rows[0]);
    chart.addLegend(20, 20, 350, $("#"+containorid).height(), "left");
    chart.addSeries(reportxml.chart_cols[0], dimple.plot.pie);
    chart.draw();
}