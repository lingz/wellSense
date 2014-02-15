Template.admin.rendered = function() {
  if (this.find("#admin-map-canvas")) {
    if (mapsLoaded) {
      createAdminMap();
    } else {
      google.maps.event.addDomListener(window, 'load', createAdminMap);
    }
  }
};

var addMapMarker = null;


function createAdminMap() {
  adminMap = generateMap("admin-map-canvas")[map];
  // add the click handler
  google.maps.event.addListener(adminMap,
    "click", function(event) {
      if (addMapMarker) {
        addMapMarker.setPosition(event.latLng);
      } else {
        addMapMarker = new google.maps.Marker({
          position: event.latLng,
          animation: google.maps.Animation.BOUNCE,
          map: adminMap
        });
      }
    }
  );
}

Template.admin.events({
  "submit form": function(e) {
    e.preventDefault();
    var data = {};
    var dataArray = $(e.target).serializeArray();
    for (var i in dataArray) {
      data[dataArray[i].name] = dataArray[i].value;
    }

    if (!addMapMarker) {
      Meteor.userError.throwError("You need to place the well on the Map");
      return;
    }
    data.lat = addMapMarker.getPosition().lat();
    data.lng = addMapMarker.getPosition().lng();

    // create a map
    Wells.insert(data, function(err, _id) {
      if (!err) {
        Meteor.Router.to("/");
      } else {
        Meteor.userError.throwError(err.reason);
      }
    });
  }
});
