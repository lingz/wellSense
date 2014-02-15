var chart;
var latestPicker;
Session.setDefault("activeDate", new Date());

Template.graph.rendered = function() {
  
  var drawToday = function() {
    console.log("draw today started");
    chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    Meteor.call('selectADay', Session.get("activeWell"), Session.get("activeDate"), function(err, dataResponse){
      drawChart(dataResponse);
    });
    if ($("#datepicker").length > 0 && !$("#datepicker").hasClass("rendered")) {
      if (latestPicker) latestPicker.destroy();
      console.log("creating a picker");
      latestPicker = new Pikaday({
        field: $('#datepicker')[0],
        format: 'D MMM YYYY',
        onSelect: function() {
          console.log(this);
          Session.set("activeDate", this.getMoment().toDate());
      }});
      $("#datepicker").addClass("rendered");
    }
  };
  if ($('#chart_div').length > 0) {
    if (isLoaded) {
      drawToday();
    } else {
      google.setOnLoadCallback(function() {
        drawToday();
      });
    }   
  }
};

Template.graph.created = function() {
  setupFunctions();
};

function setupFunctions() {
  var drawChart = function(dataResponse) {
    var dataArray = [];
    dataArray.push(['Time of the Day', 'Number of Times Well Used']);
    for (var i=0; i<24; i+=2){
      dataArray.push([i +' - ' + (i+2), dataResponse[i]]);
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

  window.drawChart = drawChart;
  Deps.autorun(function() {
    console.log("recomputing data");
    var inspectingDate = Session.get("activeDate");
    Meteor.call('selectADay', Session.get("activeWell"), inspectingDate, function(err, dataResponse){
      console.log(dataResponse);
      drawChart(dataResponse);
    });
  });
}
