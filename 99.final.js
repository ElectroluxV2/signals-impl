let currentSubscriber = undefined;

export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get: () => {
      if (currentSubscriber) {
        subscribers.add(currentSubscriber);
      }

      return value;
    },
    set: (newValue) => {
      value = newValue;
      for (const subscriber of subscribers) {
        subscriber(value);
      }
    },
  }
}

export const computed = (computation) => {
  let stale = true;
  let cachedValue = undefined;

  const markAsStale = () => stale = true;

  return {
    get: () => {
      if (!stale) {
        return cachedValue;
      }

      const prev = currentSubscriber;
      currentSubscriber = markAsStale;
      cachedValue = computation();
      currentSubscriber = prev;

      return cachedValue;
    },
  }
}

export const effect = (effectFn) => {
  const runEffect = () => {
    const prev = currentSubscriber;
    currentSubscriber = runEffect;
    effectFn();
    currentSubscriber = prev;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}

const reactiveNumber = signal(1);
const reactiveEmoji = signal('👀');
const reactiveParity = computed(() => reactiveNumber.get() % 2 === 0 ? 'even' : 'odd');
const reactiveText = computed(() => reactiveNumber.get() + ' is ' + reactiveParity.get() + reactiveEmoji.get())

effect(() => console.log(reactiveText.get()))

reactiveNumber.set(2);
reactiveNumber.set(3);
reactiveNumber.set(4);
