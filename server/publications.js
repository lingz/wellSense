Meteor.publish("wells", function() {
  return Wells.find();
});
