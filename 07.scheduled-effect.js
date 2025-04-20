export const signalsSystem = {
  currentSubscriber: undefined,
};

export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  return {
    get: () => {
      if (signalsSystem.currentSubscriber) {
        subscribers.add(signalsSystem.currentSubscriber);
      }

      return value;
    },
    set: (newValue) => {
      if (newValue === value) return;
      value = newValue;

      for (const subscriber of subscribers) {
        subscriber();
      }
    },
  }
}

export const computed = (computation) => {
  let stale = true;
  let cachedValue = undefined;
  const subscribers = new Set();

  const markAsStale = () => {
    stale = true;
    // Notify that value could have changed
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return {
    get: () => {
      if (signalsSystem.currentSubscriber) {
        subscribers.add(signalsSystem.currentSubscriber);
      }

      if (!stale) {
        return cachedValue;
      }

      const prev = signalsSystem.currentSubscriber;
      signalsSystem.currentSubscriber = markAsStale;
      cachedValue = computation();
      stale = false;
      signalsSystem.currentSubscriber = prev;

      return cachedValue;
    },
  }
}

export const effect = (effectFn) => {
  let pending = false;

  const scheduleEffect = () => {
    if (pending) return;
    pending = true;
    queueMicrotask(runEffect);
  }

  const runEffect = () => {
    pending = false;

    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = scheduleEffect;
    effectFn();
    signalsSystem.currentSubscriber = prev;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}
