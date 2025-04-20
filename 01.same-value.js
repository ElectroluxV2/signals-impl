export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get: () => value,
    set: (newValue) => {
      if (newValue === value) return;

      value = newValue;
      for (const subscriber of subscribers) {
        subscriber();
      }
    },
    subscribe: (subscriber) => {
      subscribers.add(subscriber);
    },
  }
}
