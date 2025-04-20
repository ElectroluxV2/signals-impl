export const signalsSystem = {
  currentSubscriber: undefined,
  currentType: undefined,
};

const sortByType = (subscribers) => Array.from(subscribers.entries()).sort((a, b) => a[1] - b[1]);

export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Map();

  const get = () => {
    if (signalsSystem.currentSubscriber) {
      subscribers.set(signalsSystem.currentSubscriber, signalsSystem.currentType);
    }

    return value;
  }

  const set = (newValue) => {
    if (newValue === value) return;
    value = newValue;

    for (const [subscriber] of sortByType(subscribers)) {
      subscriber();
    }
  }

  const impl = get;
  impl.set = set;

  return impl;
}

export const computed = (computation) => {
  let stale = true;
  let cachedValue = undefined;
  const subscribers = new Map();

  const markAsStale = () => {
    stale = true;
    // Notify that value could have changed
    for (const [subscriber] of sortByType(subscribers)) {
      subscriber();
    }
  };

  return () => {
    if (signalsSystem.currentSubscriber) {
      subscribers.set(signalsSystem.currentSubscriber, signalsSystem.currentType);
    }

    if (!stale) {
      return cachedValue;
    }

    const prev = signalsSystem.currentSubscriber;
    const prevType = signalsSystem.currentType;
    signalsSystem.currentSubscriber = markAsStale;
    signalsSystem.currentType = 1;
    cachedValue = computation();
    stale = false;
    signalsSystem.currentSubscriber = prev;
    signalsSystem.currentType = prevType;

    return cachedValue;
  }
}

export const effect = (effectFn) => {
  const runEffect = () => {
    const prev = signalsSystem.currentSubscriber;
    const prevType = signalsSystem.currentType;
    signalsSystem.currentSubscriber = runEffect;
    signalsSystem.currentType = 2;
    effectFn();
    signalsSystem.currentSubscriber = prev;
    signalsSystem.currentType = prevType;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}
