// Do not use this in production, this particular implementation calls `compute` way too often, but it works for purpose of showing why do we need versioning

export const signalsSystem = {
  currentSubscriber: undefined,
};

export const signal = (initialValue, equalityFn) => {
  let value = initialValue;
  const subscribers = new Set();
  let version = 0;

  const get = () => {
    if (signalsSystem.currentSubscriber) {
      const temp = signalsSystem.currentSubscriber.notify;
      signalsSystem.currentSubscriber.addDependency(() => subscribers.delete(temp), version, () => version);
      subscribers.add(temp);
    }

    return value;
  }

  const set = (newValue) => {
    if (equalityFn && (equalityFn(newValue, value)) || newValue === value) return;
    version++;
    value = newValue;

    for (const subscriber of subscribers) {
      subscriber();
    }
  }

  const impl = get;
  impl.set = set;

  return impl;
}

export const computed = (computation, dbg, equalityFn) => {
  let stale = true;
  let cachedValue = undefined;
  const subscribers = new Set();
  const dependencies = new Map();
  let version = 0;

  const markAsStale = () => {
    stale = true;
    // Notify that value could have changed
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  const addCurrentSubscriber = () => {
    if (signalsSystem.currentSubscriber) {
      const temp = signalsSystem.currentSubscriber.notify;
      signalsSystem.currentSubscriber.addDependency(() => subscribers.delete(temp), version, () => {
        recompute();
        return version;
      });
      subscribers.add(temp);
    }
  }

  const recompute = () => {
    if (!stale) return;
    stale = false;

    // console.log('r', dbg)

    const computedValue = computation();
    if (equalityFn && !equalityFn(computedValue, cachedValue) || computedValue !== cachedValue) {
      // console.log('version bump of', dbg, 'to', version + 1)
      version++;
    }
    cachedValue = computedValue;

  }

  const get = () => {
    if (!stale) {
      addCurrentSubscriber();
      return cachedValue;
    }

    let needsRecomputation = false;
    for (const [_, {lastVersion, getCurrentVersionFn}] of dependencies) {
      // if (dbg) {
      //   console.log('last', lastVersion, 'current', getCurrentVersionFn())
      // }

      if (lastVersion !== getCurrentVersionFn()) {
        // console.log('version missmatch', lastVersion, getCurrentVersionFn())
        needsRecomputation = true;
        break;
      }
    }

    if (!needsRecomputation && version > 0) {
      stale = false;
      addCurrentSubscriber();
      return cachedValue;
    }

    for (const [removeNotifySubscription] of dependencies) {
      removeNotifySubscription(markAsStale);
    }
    dependencies.clear();

    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = {
      notify: markAsStale,
      addDependency: (removeDependencyFn, lastVersion, getCurrentVersionFn) => {
        return dependencies.set(removeDependencyFn, {lastVersion, getCurrentVersionFn});
      },
    };

    recompute();

    signalsSystem.currentSubscriber = prev;

    addCurrentSubscriber();
    return cachedValue;
  }

  const impl = get;
  Object.defineProperty(impl, 'version', {
    get: () => version,
  });

  return impl;
}

export const effect = (effectFn) => {
  const dependencies = new Map();
  let pending = false;

  const scheduleEffect = () => {
    if (pending) return;

    let needsScheduleDueToChange = false;
    for (const [_, {lastVersion, getCurrentVersionFn}] of dependencies) {
      if (lastVersion !== getCurrentVersionFn()) {
        needsScheduleDueToChange = true;
        break;
      }
    }

    if (!needsScheduleDueToChange) {
      return;
    }

    pending = true;
    queueMicrotask(runEffect);
  }

  const runEffect = () => {

    for (const [removeNotifySubscription] of dependencies) {
      removeNotifySubscription(runEffect);
    }
    dependencies.clear();

    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = {
      notify: scheduleEffect,
      addDependency: (removeDependencyFn, lastVersion, getCurrentVersionFn) =>
        dependencies.set(removeDependencyFn, {lastVersion, getCurrentVersionFn}),
    };
    effectFn();
    pending = false;
    signalsSystem.currentSubscriber = prev;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}
