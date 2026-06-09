// In-memory LRU cache with a Redis-shaped interface.
// Swap with ioredis later without touching controllers.

const MAX = 1000;
const store = new Map();

export const cache = {
  async get(key) {
    if (!store.has(key)) return null;
    const v = store.get(key);
    store.delete(key);
    store.set(key, v); // refresh recency
    return v;
  },
  async set(key, value) {
    if (store.has(key)) store.delete(key);
    store.set(key, value);
    if (store.size > MAX) {
      const oldest = store.keys().next().value;
      store.delete(oldest);
    }
  },
  async del(key) {
    store.delete(key);
  },
};
