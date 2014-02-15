seedPhoneNumbers = [971507549227, 971508982573, 971505968509, 971507992693,
971504826000, 971509824554, 971505000194, 971509415359, 971503244243,
971503579110, 971501162011, 971505258746];

// utility function for generating gaussian distributed data
function rnd(mean, stdev) {
  return Math.round(((Math.random()*2-1) + (Math.random()*2-1) +
  (Math.random()*2-1)) * stdev+mean);
}

function seed() {
  // The well seeding
  if (Wells.find().count() === 0) {
    var demoWells = [
      {
        name: "University Well",
        shortcode: "UW12",
        lng: 44.055991,
        lat: 13.565088,
        ph: seedPhoneNumbers[0]
      },
      {
        name: "Old City Well",
        shortcode: "OC31",
        lng: 44.059875,
        lat: 13.567424,
        ph: seedPhoneNumbers[1]
      },
      {
        name: "Park Well",
        shortcode: "PW10",
        lng: 44.064918,
        lat: 13.566799,
        ph: seedPhoneNumbers[2]
      },
      {
        name: "Digital Well",
        shortcode: "DW63",
        lng: 44.064617,
        lat: 13.561354,
        ph: seedPhoneNumbers[3]
      },
      {
        name: "Outskirt Well",
        shortcode: "OW19",
        lng: 44.056377,
        lat: 13.559435,
        ph: seedPhoneNumbers[3]
      },
      {
        name: "Dog Well",
        shortcode: "DW13",
        lng: 44.060304,
        lat: 13.563378,
        ph: seedPhoneNumbers[4]
      },
      {
        name: "Falcon Well",
        shortcode: "FW73",
        lng: 44.060905,
        lat: 13.560291,
        ph: seedPhoneNumbers[5]
      },
      {
        name: "Spinner's Well",
        shortcode: "SW26",
        lng: 44.059145,
        lat: 13.556306,
        ph: seedPhoneNumbers[6]
      },
      {
        name: "Sheraton Well",
        shortcode: "SW42",
        lng: 44.067450,
        lat: 13.557016,
        ph: seedPhoneNumbers[7]
      },
      {
        name: "Movenpick Well",
        shortcode: "MW15",
        lng: 44.063823,
        lat: 13.558851,
        ph: seedPhoneNumbers[8] },
      {
        name: "Education Well",
        shortcode: "EW74",
        lng: 44.063888,
        lat: 13.562648,
        ph: seedPhoneNumbers[9]
      },
      {
        name: "Electric Well",
        shortcode: "EW31",
        lng: 44.060240,
        lat: 13.564108,
        ph: seedPhoneNumbers[10]
      },
      {
        name: "Airway Well",
        shortcode: "AW92",
        lng: 44.065347,
        lat: 13.563461,
        ph: seedPhoneNumbers[11]
      }
    ];
    for (var i=0; i< demoWells.length; i++) {
      demoWells[i].status = "working";
      Wells.insert(demoWells[i]);
    }
  }

  // The seeding for the reports
  if (Reports.find().count() === 0) {
    var start = moment().subtract(3, "months").startOf("day");
    var now = moment();
    var wellcodes = Wells.find().map(function(well){ return well.shortcode;});
    seedBetween(wellcodes, start, now);
  }
}
seed();

Meteor.methods({
  reseed: function() {
    console.log("Reseed called");
    Wells.remove({});
    Reports.remove({});
    seed();
  },
  extendSeed: function() {
    var lastReports = Meteor.call("mostRecent");
    for (var shortcode in lastReports) {
      var start = moment(lastReports[shortcode]);
      if (!start) start = moment().subtract(3, "months");
      var end = moment();
      seedBetween([shortcode], start, end);
    }
  }
});

function seedBetween(wellcodes, begin, end) {
  // The relative amounts of different time periods
  // Repeat this process for each well
  for (var j=0; j < wellcodes.length; j++) {
    var offsets = [0.2, 0.4, 0.6, 0.8, 0.9, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4];
    // Make a random number between one and one hundred as a coefficient for the
    // popularity of the well generally
    var historicalAverage = Math.floor(Math.random() * 25);
    // make a std for this type of well from the historical average
    var stdDev = Math.random() *  historicalAverage * 0.5;
    var offset = 0;
    var currentWell = wellcodes[j];
    console.log("j = " + j);
    while (begin < end) {
      // Multiply by the offset to get the current standard deviation
      var baseMean = historicalAverage * offsets[offset];
      var baseStdDev = stdDev * offsets[offset];
      // the number of wells that are to be generated in this time block
      var wellUseCount = Math.abs(rnd(baseMean, baseStdDev));
      var endTime = begin.clone().add(2, "hours").subtract(1, "minute");
      if (endTime > end) endTime = end;
      // seconds difference between end and start time
      var diff = endTime.diff(begin, "seconds");
      for (var reportNum = 0; reportNum < wellUseCount; reportNum++) {
        var timestamp = begin.clone().add(Math.random() * diff, "seconds");
        Reports.insert({
          timestamp: timestamp.toDate(),
          wellCode: currentWell
        });
      }
      // increment current time by 2 hours
      begin.add(2, "hours");
      offset++;
      offset %= 12;
    }
  }

}
