import { useEffect, useState } from "react";

// Custom hook to manage IndexedDB functionality

const useIndexedDB = (dbName, dbVersion, storeName) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });

      objectStore.createIndex("username", "username", { unique: true });
      objectStore.createIndex("email", "email", { unique: true });
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
    };
  }, [dbName, dbVersion, storeName]);

  // Function to add a new record to the object store
  const add = (data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Function to retrieve all records from the object store
  const getAll = () => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Function to update a record in the object store
  const update = (data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Function to delete a record by id
  const deleteRecord = (id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  return { db, add, getAll, update, deleteRecord };
};

export default useIndexedDB;
