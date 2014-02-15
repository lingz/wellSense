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
  }
});
