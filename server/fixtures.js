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
        lng: 44.178987,
        lat: 15.360715,
        ph: seedPhoneNumbers[0]
      },
      {
        name: "Old City Well",
        shortcode: "OC31",
        lng: 44.212503,
        lat: 15.355584,
        ph: seedPhoneNumbers[1]
      },
      {
        name: "Park Well",
        shortcode: "PW10",
        lng: 44.204178,
        lat: 15.326737,
        ph: seedPhoneNumbers[2]
      },
      {
        name: "Digital Well",
        shortcode: "DW63",
        lng: 44.196754,
        lat: 15.345982,
        ph: seedPhoneNumbers[3]
      },
      {
        name: "Outskirt Well",
        shortcode: "OW19",
        lng: 44.165275,
        lat: 15.349604,
        ph: seedPhoneNumbers[3]
      },
      {
        name: "Dog Well",
        shortcode: "DW13",
        lng: 44.166842,
        lat: 15.371557,
        ph: seedPhoneNumbers[4]
      },
      {
        name: "Falcon Well",
        shortcode: "FW73",
        lng: 44.196539,
        lat: 15.372178,
        ph: seedPhoneNumbers[5]
      },
      {
        name: "Spinner's Well",
        shortcode: "SW26",
        lng: 44.208813,
        lat: 15.375322,
        ph: seedPhoneNumbers[6]
      },
      {
        name: "Sheraton Well",
        shortcode: "SW42",
        lng: 44.231558,
        lat: 15.367874,
        ph: seedPhoneNumbers[7]
      },
      {
        name: "Movenpick Well",
        shortcode: "MW15",
        lng: 44.231215,
        lat: 15.360756,
        ph: seedPhoneNumbers[8] },
      {
        name: "Education Well",
        shortcode: "EW74",
        lng: 44.217997,
        lat: 15.381943,
        ph: seedPhoneNumbers[9]
      },
      {
        name: "Electric Well",
        shortcode: "EW31",
        lng: 44.207611,
        lat: 15.392867,
        ph: seedPhoneNumbers[10]
      },
      {
        name: "Airway Well",
        shortcode: "AW92",
        lng: 44.208641,
        lat: 15.383433,
        ph: seedPhoneNumbers[11]
      }
    ];
    for (var i=0; i< demoWells.length; i++) {
      Wells.insert(demoWells[i]);
    }
  }

  // The seeding for the reports
  if (Reports.find().count() === 0) {
    // The relative amounts of different time periods
    var offsets = [0.2, 0.8, 1, 0.8, 0.6, 0.4];
    // Repeat this process for each well
    var wells = Wells.find().fetch();
    for (var j=0; j < wells.length; j++) {
      // Make a random number between one and one hundred as a coefficient for the
      // popularity of the well generally
      var historicalAverage = Math.floor(Math.random() * 100);
      // make a std for this type of well from the historical average
      var stdDev = Math.random() *  historicalAverage * 0.5;
      var currentTime = moment().subtract(3, "months").startOf("day");
      var now = moment();
      var offset = 0;
      var currentWell = wells[j];
      while (currentTime < now) {
        // Multiply by the offset to get the current standard deviation
        var baseMean = historicalAverage * offsets[offset];
        var baseStdDev = stdDev * offsets[offset];
        // the number of wells that are to be generated in this time block
        var wellUseCount = Math.abs(rnd(baseMean, baseStdDev));
        var endTime = currentTime.clone().add(2, "hours").subtract(1, "minute");
        console.log("Next time block");
        console.log(wellUseCount);
        // seconds difference between end and start time
        var diff = endTime.diff(currentTime, "seconds");
        for (var reportNum = 0; reportNum < wellUseCount; reportNum++) {
          var timestamp = currentTime.clone().add(Math.random() * diff, "seconds");
          console.log(timestamp.format("dddd, MMMM Do YYYY, h:mm:ss a"));
          Reports.insert({
            timestamp: timestamp.toDate(),
            wellCode: currentWell.shortcode
          });
        }
        // increment current time by 2 hours
        currentTime.add(2, "hours");
        offset++;
        offset %= 6;
      }
    }

  }
}
seed();

Meteor.methods({
  reseed: function() {
    console.log("Reseed called");
    Wells.remove({});
    Reports.remove({});
    seed();
  }
});

Meteor.methods({
  selectaDay: function(wellID, day) {
    
  } 
})
