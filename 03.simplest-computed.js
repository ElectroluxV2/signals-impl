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

  const get = () => cachedValue;
  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
  };

  const impl = get;
  impl.subscribe = subscribe;

  return impl;
}
