export const signalsSystem = {
  currentSubscriber: undefined,
};

export const signal = (initialValue) => {
  let value = initialValue;
  const subscribers = new Set();

  const get = () => {
    if (signalsSystem.currentSubscriber) {
      const temp = signalsSystem.currentSubscriber.notify;
      signalsSystem.currentSubscriber.addDependency(() => subscribers.delete(temp));
      subscribers.add(temp);
    }

    return value;
  }

  const set = (newValue) => {
    if (newValue === value) return;
    value = newValue;

    for (const subscriber of subscribers) {
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
  const subscribers = new Set();
  const dependencies = new Set();

  const markAsStale = () => {
    stale = true;
    // Notify that value could have changed
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return () => {
    if (signalsSystem.currentSubscriber) {
      const temp = signalsSystem.currentSubscriber.notify;
      signalsSystem.currentSubscriber.addDependency(() => subscribers.delete(temp));
      subscribers.add(temp);
    }

    if (!stale) {
      return cachedValue;
    }

    for (const removeNotifySubscription of dependencies) {
      removeNotifySubscription(markAsStale);
    }
    dependencies.clear();

    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = {
      notify: markAsStale,
      addDependency: (removeDependencyFn) => dependencies.add(removeDependencyFn),
    };
    cachedValue = computation();
    stale = false;
    signalsSystem.currentSubscriber = prev;

    return cachedValue;
  }
}

export const effect = (effectFn) => {
  const dependencies = new Set();
  let pending = false;

  const scheduleEffect = () => {
    if (pending) return;
    pending = true;
    queueMicrotask(runEffect);
  }

  const runEffect = () => {

    for (const removeNotifySubscription of dependencies) {
      removeNotifySubscription(runEffect);
    }
    dependencies.clear();

    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = {
      notify: scheduleEffect,
      addDependency: (removeDependencyFn) => dependencies.add(removeDependencyFn),
    };
    effectFn();
    pending = false;
    signalsSystem.currentSubscriber = prev;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}
