Template.comments.helpers({
  wasBroadcast: function() {
    return (this.broadcast == "on");
  },
  comments: function() {
    return Comments.find({shortcode: this.shortcode}, {sort: {timestamp: -1}});
  }
});
