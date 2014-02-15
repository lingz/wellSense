
Template.graph.rendered = function() {
  console.log("Hello");
<<<<<<< HEAD
  if ($('#chart_div').length > 0) {
  	if (isLoaded) {
  		drawChart();
  	} else {
  		google.setOnLoadCallback(drawChart);
  	}  	
  }
=======
  var dataWeek = [];
>>>>>>> 16dfb24e40a018c42b031d818400aab01ee48d69
};

function drawChart() {
	var data = google.visualization.arrayToDataTable([
	  ['Year', 'Sales', 'Expenses'],
	  ['2004',  1000,      400],
	  ['2005',  1170,      460],
	  ['2006',  660,       1120],
	  ['2007',  1030,      540]
	]);

	var options = {
	  title: 'Company Performance',
	  hAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

window.drawChart = drawChart;
