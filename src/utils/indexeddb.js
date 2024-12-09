import { INDEXED_DB_CONFIG } from "../constants";

const DATABASES = {
  [INDEXED_DB_CONFIG.DB_NAME]: {
    name: INDEXED_DB_CONFIG.DB_NAME,
    version: 1,
    stores: [
      INDEXED_DB_CONFIG.STORES.STATUS_STORE,
      INDEXED_DB_CONFIG.STORES.CATEGORIES_STORE,
    ],
  },
};

const dbs = {};

export const initDB = (dbName = INDEXED_DB_CONFIG.DB_NAME) => {
  const { name, version, stores } = DATABASES[dbName];

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      stores.forEach((storeName) => {
        db.createObjectStore(storeName);
      });
    };

    request.onsuccess = (event) => {
      dbs[dbName] = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const addRecord = (
  storeName,
  records,
  dbName = INDEXED_DB_CONFIG.DB_NAME
) => {
  return new Promise((resolve, reject) => {
    const db = dbs[dbName];

    if (!db) {
      reject(new Error(`Database "${dbName}" not initialized.`));
      return;
    }

    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    objectStore.clear();
    records.forEach((record) => {
      const request = objectStore.add(record, record.id);

      request.onerror = (event) => {
        reject(`Error adding record to store: ${event.target.error}`);
      };
    });

    transaction.oncomplete = () => {
      resolve("Records added to store successfully.");
    };

    transaction.onerror = (event) => {
      reject(`Error adding records to store: ${event.target.error}`);
    };
  });
};

export const getAllRecords = (
  storeName,
  dbName = INDEXED_DB_CONFIG.DB_NAME
) => {
  return new Promise((resolve, reject) => {
    const db = dbs[dbName];

    if (!db) {
      reject(new Error(`Database "${dbName}" not initialized.`));
      return;
    }
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const updateRecord = (
  storeName,
  record,
  dbName = INDEXED_DB_CONFIG.DB_NAME
) => {
  return new Promise((resolve, reject) => {
    const db = dbs[dbName];

    if (!db) {
      reject(new Error(`Database "${dbName}" not initialized.`));
      return;
    }
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.put(record);

    request.onsuccess = () => {
      resolve(record.id);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const deleteRecord = (
  storeName,
  id,
  dbName = INDEXED_DB_CONFIG.DB_NAME
) => {
  return new Promise((resolve, reject) => {
    const db = dbs[dbName];

    if (!db) {
      reject(new Error(`Database "${dbName}" not initialized.`));
      return;
    }
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const deleteDB = (dbName = INDEXED_DB_CONFIG.DB_NAME) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
