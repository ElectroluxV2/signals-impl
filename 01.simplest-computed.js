export const computed = (computation, dependencies) => {
  let cachedValue = computation(); // Initial computation
  const subscribers = new Set();

  for (const dependency of dependencies) {
    dependency.subscribe(() => {
      cachedValue = computation();

      for (const subscriber of subscribers) {
        subscriber();
      }
    });
  }

  return {
    get: () => cachedValue,
    subscribe: (subscriber) => {
      subscribers.add(subscriber);
    },
  }
}
