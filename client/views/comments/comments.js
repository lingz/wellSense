Template.comments.helpers({
  wasBroadcast: function() {
    return (this.broadcast == "on");
  },
  comments: function() {
    return Comments.find({shortcode: this.shortcode}, {sort: {timestamp: -1}});
  },
  imgSrc: function() {
  	switch (this.flag){
	  	case "General":
	  		return "/icon-general.png"
	  	case "event":
	  		return "/icon-event.png"
	  	case "Breakdown":
	  		return "/icon-breakdown.png"
	  	case "maintenance":
	  		return "/icon-maintenance.png"
	  	case "repair":
	  		return "/icon-repair.png"
  	}
  },
  timeHeader: function(){
    var newTime = moment(this.time).format('MMMM Do, YYYY');
    var flag = this.flag;
    newTime += (' - ' + flag + ' Comment')
    return newTime
  }
});
