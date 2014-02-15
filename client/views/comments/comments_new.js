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
  }
});
