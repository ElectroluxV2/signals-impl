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

  const get = () => {
    if (!stale) {
      return cachedValue;
    }

    cachedValue = computation();
    stale = false;

    return cachedValue;
  }

  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
  }

  const impl = get;
  impl.subscribe = subscribe;

  return impl;
}
