wellHandler = Meteor.subscribe("wells");
reportHandler = Meteor.subscribe("latestReport");
Deps.autorun(function() {
  var wellcode = Session.get("activeWell");
  Meteor.subscribe("comments", wellcode);
});
Deps.autorun(function() {
  Reports.findOne();
  Meteor.call("mostRecent", function(err, resp) {
    Session.set("lastReports", resp);
  });
});
