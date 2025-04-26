import { signalsSystem } from './05.auto-subscribe.js';

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
