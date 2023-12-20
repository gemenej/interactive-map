const WebSocket = require("ws");
const faker = require("faker");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 8080 });

// Function to generate random signals
function generateSignals(count, timestamp) {
  const signals = [];
  for (let i = 0; i < count; i++) {
    const point = {
      lat: parseFloat(faker.address.latitude(50.1, 49.9, 5)),
      lon: parseFloat(faker.address.longitude(30.1, 29.9, 5)),
    };
    zone = Array.from(
      { length: faker.datatype.number({ min: 0, max: 6 }) },
      () => ({
        lat: parseFloat(
          faker.address.latitude(point.lat + 0.05, point.lat - 0.05, 5)
        ),
        lon: parseFloat(
          faker.address.longitude(point.lon + 0.05, point.lon - 0.05, 5)
        ),
      })
    );
    zone.unshift(point);
    const signal = {
      timestamp: timestamp,
      frequency: faker.datatype.number({ min: 400, max: 800, precision: 0.1 }),
      point: point,
      zone: zone,
    };
    signals.push(signal);
  }
  return signals;
}

function sendRandomSignal() {
  const timestamp = Date.now();
  const signals = generateSignals(
    faker.datatype.number({ min: 1, max: 5 }),
    timestamp
  );
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(signals));
    }
  });
  writeSignalToJsonFile(signals, timestamp);
}

// Function to write signals to file
function writeSignalToJsonFile(signals, timestamp) {

  // Read the existing data
  fs.readFile("signals.json", "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file from disk: ${err}`);
    } else {
      // Parse JSON string to JSON object
      const jsonData = JSON.parse(data);

      // Add a new signal to the array
      const newSignal = signals;
      if (!jsonData[timestamp]) {
        jsonData[timestamp] = newSignal;
      }

      // Write new data back to the file
      fs.writeFile("signals.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error(`Error writing file to disk: ${err}`);
        } else {
          //console.log("Data written to file");
        }
      });
    }
  });
}

// Send signals every 5 seconds
setInterval(sendRandomSignal, 5000);

// Event handler for new connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  // Event handler for connection close
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
console.log("WebSocket server started on port 8080");
