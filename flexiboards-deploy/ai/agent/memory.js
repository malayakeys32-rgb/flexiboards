
// backend/ai/agent/memory.js
const store = {};

export default {
  set(key, value) {
    store[key] = value;
  },
  get(key) {
    return store[key];
  },
  getAll() {
    return store;
  },
};
