import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'AdventureCacheDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<unknown>> | null = null;

function getDb(): Promise<IDBPDatabase<unknown>> {
  if (!dbPromise) {
    if (!window.indexedDB) {
        console.warn("IndexedDB not supported. Image caching will be disabled.");
        // Retorna um objeto dummy que não faz nada para evitar erros em navegadores sem suporte
        return Promise.resolve({
            get: async () => undefined,
            put: async () => '',
            getAll: async () => [],
            getAllKeys: async () => [],
            clear: async () => {},
        } as any);
    }
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

export async function storeImage(key: string, value: string): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_NAME, value, key);
  } catch (error) {
    console.error('Failed to store image in IndexedDB:', error);
    // Isso pode falhar no modo de navegação anônima/privada. Apenas registramos o erro
    // e continuamos sem cache para esta sessão.
  }
}

export async function getImage(key: string): Promise<string | undefined> {
  try {
    const db = await getDb();
    return db.get(STORE_NAME, key);
  } catch (error) {
    console.error('Failed to get image from IndexedDB:', error);
    return undefined;
  }
}

export async function getAllImages(): Promise<Record<string, string>> {
  try {
    const db = await getDb();
    const keys = await db.getAllKeys(STORE_NAME);
    const values = await db.getAll(STORE_NAME);
    const imageMap: Record<string, string> = {};
    keys.forEach((key, index) => {
      if (typeof key === 'string') {
        imageMap[key] = values[index];
      }
    });
    return imageMap;
  } catch (error) {
    console.error('Failed to get all images from IndexedDB:', error);
    return {};
  }
}

export async function clearImages(): Promise<void> {
  try {
    const db = await getDb();
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error('Failed to clear images from IndexedDB:', error);
  }
}
