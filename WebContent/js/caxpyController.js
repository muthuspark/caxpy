var CaxpyController = angular.module('Caxpy', [])
.controller('CaxpyController' , function($scope, $http){
	$scope.report = report;
	$scope.groups = [];
	$scope.report_name = "";
	
	$http.get('data/service/groups').
	  success(function(data, status, headers, config) {
		  $scope.groups = data;
	  }).
	  error(function(data, status, headers, config) {
	  });
	
	$scope.save = function() {
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
			$.ajax({
				url : "data/service/save",
				type : "POST",
				data : {
					"report" : JSON.stringify(reportx),
					"groupid" : $("#group_name").val()
				}
			// save the entire report as a json object in the backend.
			}).done(function(data) {
				if (data.status == 'success') {
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

	$scope.saveReport = function() {
		if (!report.report_name) {
			report.report_name = $scope.report_name;
		}
		save();
	};

	$scope.saveAs = function() {
		report.report_name = $scope.report_name;
		save();
	};
	
});