// In-memory cache for Platform Admin dashboard navigation
// Exists purely in JavaScript memory and resets on browser reload

const adminMemoryCache = new Map();

export const getAdminCache = (key) => {
  return adminMemoryCache.get(key) || null;
};

export const setAdminCache = (key, data) => {
  adminMemoryCache.set(key, data);
};

export const clearAdminCache = (key) => {
  if (key) {
    adminMemoryCache.delete(key);
  } else {
    adminMemoryCache.clear();
  }
};
