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
    }
  },
  "click .off": function(e) {
    e.preventDefault();
    var element = $(e.target);
    var shortcode = element.val();
    var well = Wells.findOne({shortcode: shortcode});
    if (well.status != "broken") {
      Wells.update({_id: well._id}, {"$set": {status: "broken"}});
    }
  }
});
