var chart;

Template.graph.rendered = function() {
  
  var drawToday = function() {
    chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    Meteor.call('selectADay', 'UW12', new Date().getDate(), function(err, dataResponse){
      drawChart(dataResponse);
    });
  }
  if ($('#chart_div').length > 0) {
    if (isLoaded) {
      drawToday();
    } else {
      google.setOnLoadCallback(drawToday);
    }   
  }
  

var drawChart = function(dataResponse) {
  var dataArray = new Array();
  dataArray.push(['Time of the Day', 'Number of Times Well Used']);
  for (var i=0; i<24; i+=2){
    dataArray.push([i +' - ' + (i+2), dataResponse[i]])
  }
  var data = google.visualization.arrayToDataTable(dataArray);
  var options = {
    title: 'Company Performance',
    hAxis: {title: 'Year', titleTextStyle: {color: 'red'}},
    animation:{
      duration: 1000,
      easing: 'out'
    }
  };
  if (chart)
  chart.draw(data, options);

};
  // var picker = new Pikaday({ field: $('#datepicker')[0] });
  var picker = new Pikaday({
    field: $('#datepicker')[0],
    format: 'D MMM YYYY',
    onSelect: function() {
      //Well ID should be var
        Meteor.call('selectADay', 'UW12', this.getMoment().toDate(), function(err, dataResponse){
          drawChart(dataResponse);
      });
  }});
  window.drawChart = drawChart;
}
