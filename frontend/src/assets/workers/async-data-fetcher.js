const EVENT_TYPES = {
    INIT: 'INIT'
};

const DATA_BASES = {
    SIGNALS: 'signals',
    USERS: 'users'
}

const DATA_BASE_MODES = {
    RW: "readwrite"
}

const DATA_STORES = {
    SIGNALS: 'signals',
}

self.socket = undefined;
self.socketURL = undefined;
self.db = undefined;

self.onmessage = (event) => {
    let [eventType, eventData] = event.data;
    switch (eventType) {
        case EVENT_TYPES.INIT:
            initDB();
            return socketCreate(eventData);
    }
};

function initDB() {
    // TODO(s1z): Move all async handlers into args!
    if (!self.indexedDB) {
        console.error("This browser doesn't support IndexedDB.");
        return;
    }

    /*
     * Uncomment the code below if you want to DELETE DB
     */
    // self.indexedDB.deleteDatabase(DATA_BASES.SIGNALS).onsuccess = () => {
    //     console.log("ok, deleted");
    // }

    const dbPromise = self.indexedDB.open(DATA_BASES.SIGNALS, 1);

    dbPromise.onupgradeneeded = (event) => {
        self.db = event.target.result;
        if (!self.db.objectStoreNames.contains(DATA_STORES.SIGNALS)) {
            // TODO(s1z): Create models and remove hardcode (e.g. 'timestamp').
            const signalsOS = self.db.createObjectStore(
                DATA_STORES.SIGNALS,
                // KeyPath (PrimaryKey) is null - default num autogenerate.
                {keyPath: null, autoIncrement: true}
            );
            // Two indexes for timestamp and freq.
            signalsOS.createIndex('timestamp', 'timestamp', {unique: false});
            signalsOS.createIndex('frequency', 'frequency', {unique: false});
        }
    }
    dbPromise.onsuccess = (event) => {
        self.db = event.target.result;
    }
    dbPromise.onerror = (event) => {
        console.error("Failed to create a DB!", event);
    };
}

function clearSocketCallbacks() {
    if (self.socket !== undefined) {
        self.socket.onopen    = () => {};
        self.socket.onclose   = () => {};
        self.socket.onerror   = () => {};
        self.socket.onmessage = () => {};
        self.socket.close();
    }
}

function socketCreate(url) {
    console.log("self::socketCreate::url:", url);
    clearSocketCallbacks();
    self.socket = new WebSocket(url);
    self.socket.onopen    = socketOnOpen;
    self.socket.onclose   = socketOnClose;
    self.socket.onerror   = socketOnError;
    self.socket.onmessage = socketOnMessage;
}


function socketOnOpen(event) {
}

function socketOnClose(_event) {
    socketCreate(self.socketURL);
}

function socketOnError(_event) {
    // reopen socket
    socketCreate(self.socketURL);
}

function onDBError(event) {
    // TODO(s1z): Try to refresh instance maybe ?
    console.error(`Database error: ${event}`);
}

function socketOnMessage(event) {
    // TODO(s1z): handle errors with DB and try to reconnect if any!
    const store = self.db?.transaction([DATA_BASES.SIGNALS], DATA_BASE_MODES.RW).objectStore(DATA_STORES.SIGNALS);
    if (store) {
        JSON.parse(event.data).forEach((packet) => store.add(packet));
    } else {
        console.log('DB instance does not exist, handle me :)');
    }
}
