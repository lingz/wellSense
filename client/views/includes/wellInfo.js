Template.wellInfo.helpers({
  activeWell: function() {
    //var activeWellCode = Session.get("activeWell");
    var activeWellCode = Session.get("activeWell");
    if (activeWellCode) {
      return Wells.findOne({shortcode: activeWellCode});
    } else {
      return null;
    }
  }
});
