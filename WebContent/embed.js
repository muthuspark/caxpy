/**
 * Author: Muthukrishnan<br>
 * Caxpy Embed Charts
 */
(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src","js/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else {
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/***Load Apprise***/
/*
 * <script type="text/javascript" src="http://www.amcharts.com/lib/3/amcharts.js"></script>
<script type="text/javascript" src="http://www.amcharts.com/lib/3/serial.js"></script>
 */
/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    main();
}

function main() { 
    jQuery(document).ready(function() {
    	createEmbeddedReport();
    });
}
function createEmbeddedReport(){
	jQuery('.caxpy-report').each(function(){
		var reportid = jQuery(this).attr('reportid') || jQuery(this).attr('id');
		var containerid = "c"+(new Date().getTime());
		if(reportid){
			jQuery(this).attr('id', containerid);
			jQuery(this).attr('reportid', reportid);
		}
		var params = jQuery(this).attr('data-params');
		var jsonp_url = window.location.origin+"/caxpy/report";
		$.ajax({
			  url: jsonp_url,
			  type: "GET",
			  data: {"reportid" : reportid.substring(1, reportid.length) , "params" : params}
		}).done(function(data) {
			var type = data.charttype;
			if(type == 'line_chart'){
				createLineChart(containerid, data);
			}else if(type == 'column_chart'){
				createColumnChart(containerid, data);
			}else if(type == 'area_chart'){
				createAreaChart(containerid, data);
			}else if(type == 'pie_chart'){
				createPieChart(containerid, data);
			}else if(type == 'doughnut_chart'){
				createDoughnutChart(containerid, data);
			}else if(type == 'radar_chart'){
				createRadarChart(containerid, data);
			}else if(type == 'bubble_chart'){
				createBubbleChart(containerid, data);
			}else if(type == 'scatter_chart'){
				createScatterChart(containerid, data);
			}else if(type == 'chord_chart'){
				createChordChart(containerid, data);
			}else if(type == 'funnel_chart'){
				createFunnelChart(containerid, data);
			}else if(type == 'table'){
				var tabledata = data.chartData;
				var table_html = "<table class='table table-striped'><thead><tr>";
				$.each(data.chart_cols, function (index, value) {
					table_html+="<th>"+value+"</th>";
				});
				$.each(data.chart_rows, function (index, value) {
					table_html+="<th>"+value+"</th>";
				});
				table_html+="</tr></thead><tbody>";
				$.each(tabledata, function (index, value) {  
					table_html+="<tr>";
					data.chart_cols.forEach(function(val){
						table_html+="<td>"+tabledata[index][val]+"</td>";
					});
					data.chart_rows.forEach(function(val){
						table_html+="<td>"+tabledata[index][val]+"</td>";
					});
					table_html+="</tr>";
				});
				table_html+="</tbody></table>";
				$("#"+containerid).html(table_html);
			}
		});
	});
}
})(); // We call our anonymous function immediately