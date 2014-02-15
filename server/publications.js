Meteor.publish("wells", function() {
  return Wells.find();
});

Meteor.publish("latestReport", function() {
  return Reports.find({}, {sort: {timestamp: -1}, limit: 1});
});

Meteor.publish("comments", function(shortcode) {
  return Comments.find({shortcode: shortcode});
});
