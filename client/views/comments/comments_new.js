Template.commentsNew.events({
  "submit form": function(e) {
    e.preventDefault();
    var dataArray = $(e.target).serializeArray();
    var data = {};
    for (var i in dataArray) {
      data[dataArray[i].name] = dataArray[i].value;
    }
    data.shortcode = Session.get("activeWell");
    data.timestamp = new Date();
    Comments.insert(data);
    var well = Wells.findOne({shortcode: data.shortcode});
    console.log(data);
    if (data.flag == "Breakdown" && well.status == "working") {
      Wells.update({_id: well._id}, {"$set": {status: "broken"}});
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now BROKEN. Do not use.");
    } else if (data.flag == "Repair" && well.status == "broken"){
      Wells.update({_id: well._id}, {"$set": {status: "working"}});
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now OK.");
    }
    $("textarea").val("");
  }
});
