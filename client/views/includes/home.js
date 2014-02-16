Template.home.rendered = function() {
  if (this.find("#main-map-canvas")) {
    if (mapsLoaded) {
      createMainMap();
    } else {
      google.maps.event.addDomListener(window, 'load', createMainMap);
    }
  }
};

Session.setDefault("wellsLoaded", false);
window.mainMarkers = null;
window.changeMarker = null;
function createMainMap() {
  if (wellHandler.ready() && !Session.get("wellsLoaded")) {
    console.log("Starting the main draw");
    console.log(Wells.find().fetch());
    result = generateMap("main-map-canvas", function(marker) {
      Meteor.Router.to("/well/" + marker.title);
      changeMarker(marker.title);
    });
    if (result) mainMarkers = result.markers;
    Session.set("wellsLoaded", true);
  } else if (!Session.get("waitingOnLoad")) {
    waitForMap();
  }
}
Session.setDefault("waitingOnLoad", false);
function waitForMap() {
  Session.set("waitingOnLoad", true);
  Deps.autorun(function() {
    console.log("trying to redraw the map");
    Wells.find();
    createMainMap();
  });
}


Deps.autorun(function() {
  var latestReport = Reports.findOne({}, {sort: {timestamp: -1}});
  if (latestReport) {
    var latestWell = Wells.findOne({shortcode: latestReport.wellCode});
    if (latestWell) {
      changeMarker(latestWell.shortcode);
    }
  }
});

// on well change, redo all wells
Deps.autorun(function() {
  if (window.changeMarker) {
    Wells.find({}).forEach(function(well) {
      changeMarker(well.shortcode);
    });
  }
});
