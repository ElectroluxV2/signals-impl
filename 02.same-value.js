export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  const get = () => value;
  const set = (newValue) => {
    if (newValue === value) return;
    value = newValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const subscribe = (subscriber) => {
    subscribers.add(subscriber);
  };

  const impl = get;
  impl.set = set;
  impl.subscribe = subscribe;

  return impl;
}
