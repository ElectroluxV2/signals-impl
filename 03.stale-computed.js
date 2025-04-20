export const computed = (computation, dependencies) => {
  let stale = true;
  let cachedValue = undefined;
  const subscribers = new Set();

  for (const dependency of dependencies) {
    dependency.subscribe(() => {
      stale = true;
      for (const subscriber of subscribers) {
        subscriber();
      }
    });
  }

  return {
    get: () => {
      if (!stale) {
        return cachedValue;
      }

      cachedValue = computation();
      stale = false;

      return cachedValue;
    },
    subscribe: (subscriber) => {
      subscribers.add(subscriber);
    },
  }
}
