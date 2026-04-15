const cacheStore = new Map();

const getCacheKey = (req) => `${req.method}:${req.originalUrl}`;

export const cacheResponse = (durationSeconds = 60) => (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = getCacheKey(req);
  const cached = cacheStore.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    res.set('X-Cache', 'HIT');
    res.set('Cache-Control', `public, max-age=${durationSeconds}`);
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    cacheStore.set(key, {
      data: body,
      expiresAt: Date.now() + durationSeconds * 1000,
    });
    res.set('X-Cache', 'MISS');
    res.set('Cache-Control', `public, max-age=${durationSeconds}`);
    return originalJson(body);
  };

  next();
};

export const clearCache = (req) => {
  const key = getCacheKey(req);
  cacheStore.delete(key);
};
