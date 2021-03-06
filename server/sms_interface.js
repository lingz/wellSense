Meteor.Router.add("/sms/ping", "GET", function() {
  var phoneNumber = this.request.query.phoneNumber;
  var timestamp = new Date();
  var msg = this.request.query.msg.toUpperCase().replace("%2B", "+");
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
      Comments.insert({shortcode: well.shortcode,
        body: "WellSense has detected this well is OK now.", flag: "repair"});
    }
  } else {
    if (well.status == "working") {
      Meteor.call("sendSMS", well.subscribers,
        well.name + " (" + well.shortcode + ") is now BROKEN. Do not use.");
      Wells.update({_id: well._id}, {"$set": {status: "broken"}});
      Comments.insert({shortcode: well.shortcode,
        body: "WellSense has detected this well broken.", flag: "breakdown"});
    }
  }
  return [200, "RECIEVED"];
});

Meteor.Router.add("/sms/subscribe", "GET", function() {
  var phoneNumber = this.request.query.phoneNumber;
  var msg = this.request.query.msg.toUpperCase().replace("%2B", "+");
  console.log("RECEIVING A SUBSCRIBE REQUEST FROM: " + phoneNumber);
  var wellCode = msg.trim();
  if (!/^\w{4}$/i.test(wellCode)) 
    return [200, "Sorry we could not understand your query"];

  var well = Wells.findOne({shortcode: wellCode});

  if (!well)
    return [200, "Sorry, no well with code " + wellCode + " exists."];

  Wells.update({_id: well._id}, {"$addToSet": {subscribers: phoneNumber}});
  return [200,
   "Congratulations. You have been successfully subscribed to " +
   well.name + " (" +well.shortcode + ")." ];
});

var URL = "http://wellsense.ngrok.com/";
Meteor.methods({
  "sendSMS": function(recipients, message) {
    console.log("SENDING SMS");
    console.log(recipients);
    console.log(message);
    this.unblock();
    for (var i=0; i < recipients.length; i ++) {
      var phoneNumber = recipients[i];
      HTTP.get(URL + "/cgi-bin/sendsms", {
        params: {
          username: "tester",
          password: "foobar",
          to: phoneNumber,
          text: message
        }
      }, function(err, result) {
        if (err) {
          console.log("SMS server error");
        } else {
          console.log("SMS server replied");
          console.log(result.data);
        }
      });
    }
  }
});

Meteor.Router.add("/sms/check", "GET", function() {
  var phoneNumber = this.request.query.phoneNumber;
  var msg = this.request.query.msg.toUpperCase().replace("%2B", "+");
  console.log("RECEIVED A CHECK REQUEST FROM " +
    phoneNumber + " for " + wellCode);
  var wellCode = msg.trim();
  if (!/^\w{4}$/i.test(wellCode))
    return [200, "Sorry, we cannot understand your query"];



  var well = Wells.findOne({shortcode: wellCode});

  if (!well)
    return [200, "The well with code " + wellCode + " does not exist."];

  var lastReport = Reports.findOne({wellCode: well.shortcode},
    {sort: {timestamp: -1}});
  if (!lastReport)
    return [200, "The well with code " + wellCode + " has never been used."];

  if (well.status == "working")
    return [200, well.name + " (" + wellCode + ")" +
      " is working. It was last used on " +  moment().format('DD/MM HH:mm')];
  else
    return [200, well.name + " (" + wellCode + ") is not working."];
    
});

