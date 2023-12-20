const express = require("express");
const fs = require("fs");
const app = express();
const moment = require("moment");
const cors = require("cors");
const port = 8081;

app.use(cors());

app.get("/history/:timestamp/signals", (req, res) => {
  const timestamp = req.params.timestamp;
  //console.log(`Received request for signals at ${timestamp}`);

  fs.readFile("signals.json", "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
      res.status(500).send("Server error");
    } else {
      const signals = JSON.parse(data);

      if (signals[timestamp]) {
        res.json(signals[timestamp]);
        //console.log(`Sent signals for timestamp ${timestamp}`);
      } else {
        //res.status(404).send("No signals found for this timestamp");
        const response = [];
        res.json(response);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

function convertTimestampToDateTime(timestamp) {
  const dateTime = moment(+timestamp).format("YYYY-MM-DD HH:mm:ss");
  return dateTime;
}

app.get("/timestamps", (req, res) => {
  fs.readFile("signals.json", "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
      res.status(500).send("Server error");
    } else {
      const signals = JSON.parse(data);
      const timestamps = Object.keys(signals).map(Number);

      // Check if the timestamp older than 30 minutes it will return only 30 minutes data
      const currentTimestamp = Date.now();
      const halfAnHourAgo = currentTimestamp - 1800000;
      const halfAnHourAgoDateTime = convertTimestampToDateTime(halfAnHourAgo);
      //console.log(halfAnHourAgoDateTime);
      const halfAnHourAgoTimestamp = Date.parse(halfAnHourAgoDateTime);
      const filteredTimestamps = timestamps.filter(
        (timestamp) => timestamp >= halfAnHourAgoTimestamp
      );
      res.json(filteredTimestamps);

      //res.json(timestamps);
      //console.log(`Sent timestamps`);
    }
  });
});
