Meteor.Router.add("/sms/ping", "GET", function() {
  var phoneNumber = this.request.query.phoneNumber;
  var timestamp = new Date();
  var msg = this.request.query.msg;
  console.log("RECEIVED A PING FROM: " + phoneNumber);

  // transform the number
  if (/^05/.test(phoneNumber)) {
    phoneNumber = "+971" + phoneNumber.slice(1);
  }

  var isOn = /on/i.test(msg);
  var well = Wells.findOne({phoneNumber: phoneNumber});
  if (!well) return;


  if (isOn) {
    // report it
    Reports.insert({timestamp: timestamp, wellCode: well.shortcode});
    if (well.status == "broken") {
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now OK.");
      Wells.update({_id: well._id}, {"$set": {status: "working"}});
    }
  } else {
    if (well.status == "working") {
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now BROKEN. Do not use.");
      Wells.update({_id: well._id}, {"$set": {status: "broken"}});
    }
  }
});

Meteor.Router.add("/sms/subscribe", "GET", function() {
  var phoneNumber = this.request.query.phoneNumber;
  var msg = this.request.query.msg;
  if (!/^subscribe  \w{4}$/.test(msg)) 
    return [200, "Sorry we could not understand your query"];

  var wellCode = msg.split(" ")[1];
  var well = Wells.findOne({shortcode: wellCode});

  if (!well)
    return [200, "Sorry, no well with code " + wellCode + " exists."];

  Wells.update({_id: well._id}, {"$addToSet": {phoneNumber: phoneNumber}});
  return [200,
   "Congratulations. You have been successfully subscribed to " +
   well.name + " (" +well.shortcode + ")." ];
});

Meteor.methods({
  "sendSMS": function(recipients, message) {
  }
});

