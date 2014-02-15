Template.admin.events({
  "submit form": function(e) {
    e.preventDefault();
    var data = {};
    var dataArray = $(e.target).serializeArray();
    for (var i in dataArray) {
      data[dataArray[i].name] = dataArray[i].value;
    }

    // create a map
    Wells.insert(data);
    
  }
});
