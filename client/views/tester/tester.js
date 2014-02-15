Template.tester.helpers({
  wells: function() {
    return Wells.find();
  }
});

Template.tester.events({
  "click button": function(e) {
    e.preventDefault();
    var element = $(e.target);
    var shortcode = element.val();
    Reports.insert({
      timestamp: new Date(),
      wellCode: shortcode
    });
  }
});
