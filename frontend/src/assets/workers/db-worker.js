let db;

self.addEventListener("message", ({ data }) => {
  const { type, payload } = data;

  switch (type) {
    case "openDatabase":
      openDatabase(payload);
      break;
    case "getDataByTimestamp":
      getDataByTimestamp(payload);
      break;
  }
});

function openDatabase(payload) {
  const { dbName, storeName } = payload;
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "timestamp" });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    postMessage({ type: "openDatabaseSuccess" });
  };

  request.onerror = (event) => {
    postMessage({ type: "error", payload: "Error opening IndexedDB" });
  };
}

function getDataByTimestamp(payload) {
  const { storeName, timestamp } = payload;
  const transaction = db.transaction(storeName, "readonly");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore
    .index("timestamp")
    .getAll(IDBKeyRange.bound(timestamp - 500, timestamp + 500, false, true));

  request.onsuccess = (event) => {
    const result = event.target.result;
    postMessage({ type: "getDataByTimestampSuccess", payload: result });
  };

  request.onerror = (event) => {
    postMessage({
      type: "error",
      payload: "Error fetching data from IndexedDB",
    });
  };
}
