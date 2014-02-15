Template.status.helpers({
  name: function() {
    return this.name;
  },
  lastUsed: function() {
    var reportDict = Session.get("lastReports");
    var lastReport;
    if (reportDict)
      lastReport = reportDict[Session.get("activeWell")];
    if (lastReport) {
      var now = moment();
      var diff = now.diff(moment(lastReport), "seconds");
      var result;
      if (diff < 61) {
        result = Math.floor(diff) + " seconds";
      } else if (diff < 3601) {
        result = Math.floor(diff / 60) + " minutes";
      } else if (diff < 86401) {
        result = Math.floor(diff / 3600) + " hours";
      } else {
        result = Math.floor(diff / 86400) + " days";
      }
      return result;
    }
  },
  activeWell: function() {
    //var activeWellCode = Session.get("activeWell");
    var activeWellCode = Session.get("activeWell");
    if (activeWellCode) {
      return Wells.findOne({shortcode: activeWellCode});
    } else {
      return null;
    }
  }
});
