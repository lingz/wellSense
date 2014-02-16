Template.tester.helpers({
  wells: function() {
    return Wells.find();
  }
});

Template.tester.events({
  "click .on": function(e) {
    e.preventDefault();
    var element = $(e.target);
    var shortcode = element.val();
    Reports.insert({
      timestamp: new Date(),
      wellCode: shortcode
    });
    var well = Wells.findOne({shortcode: shortcode});
    if (well.status == "broken") {
      Wells.update({_id: well._id}, {"$set": {status: "working"}});
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now OK.");
      Comments.insert({shortcode: well.shortcode,
        body: "WellSense has detected this well is OK now.", flag: "repair"});
    }
  },
  "click .off": function(e) {
    e.preventDefault();
    var element = $(e.target);
    var shortcode = element.val();
    var well = Wells.findOne({shortcode: shortcode});
    if (well.status != "broken") {
      Wells.update({_id: well._id}, {"$set": {status: "broken"}});
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now BROKEN. Do not use.");
      Comments.insert({shortcode: well.shortcode,
        body: "WellSense has detected this well broken.", flag: "breakdown"});
    }
  }
});
