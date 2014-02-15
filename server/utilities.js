Meteor.methods({
  mostRecent: function() {
    var wellcodes = Wells.find().map(function(well){ return well.shortcode;});
    result = {};
    for (var i=0; i < wellcodes.length; i++) {
      var activeCode = wellcodes[i];
      mostRecent = Reports.findOne({wellCode: activeCode}, {sort: {timestamp: -1}});
      result[activeCode] = mostRecent.timestamp;
    }
    return result;
  },
  //start day comes in as Time() object
  selectADay: function(wellID, startDay) {
    var endDay = moment(startDay).clone().add('days', 1).toDate();
    var todayWells = Reports.find({wellCode: wellID, timestamp: {"$gte": startDay, "$lt": endDay}}, {fields: {timestamp: 1}}).fetch();
    console.log(todayWells);
    //maps to an array with only timestamps
    todayWells = todayWells.map(function(report){
      return report.timestamp;
    });
    var frequency = 0;
    var frequencyDict = {};
    var dictKey = 0;
    //Start day should not have hour associated
    var startTime = moment(startDay).clone().toDate();
    var endTime = moment(startTime).clone().add('hours', 2).toDate();
    for (var i=0; i<todayWells.length;i++){
      if (todayWells[i] > startTime && todayWells[i] < endTime){
        frequency++;
      } else {
        frequencyDict[dictKey] = frequency;
        dictKey += 2;
        frequency = 0;
        startTime = moment(startTime).add('hours', 2).toDate();
        endTime = moment(endTime).add('hours', 2).toDate();
      }
    }
    //push last frequency
    frequencyDict[dictKey] = frequency;
    console.log(frequencyDict);
    return frequencyDict;
  }
});
