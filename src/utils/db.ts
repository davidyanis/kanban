import type { KanbanState } from "../types/kanban";

const DB_NAME = "kanban-db";
const DB_VERSION = 1;
const STORE_NAME = "kanban-state";
const STATE_KEY = "current-state";

/**
 * Initialize IndexedDB database
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Load Kanban state from IndexedDB
 */
export async function loadStateFromDB(): Promise<KanbanState | null> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(STATE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const state = request.result as KanbanState | undefined;
        resolve(state || null);
      };
    });
  } catch (error) {
    console.error("Failed to load state from IndexedDB:", error);
    return null;
  }
}

/**
 * Save Kanban state to IndexedDB
 */
export async function saveStateToDB(state: KanbanState): Promise<void> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(state, STATE_KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Failed to save state to IndexedDB:", error);
  }
}

/**
 * Clear all data from IndexedDB
 */
export async function clearDB(): Promise<void> {
  try {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Failed to clear IndexedDB:", error);
  }
}
