import { signalsSystem } from './05.auto-subscribe.js';

export const effect = (effectFn) => {
  const runEffect = () => {
    const prev = signalsSystem.currentSubscriber;
    signalsSystem.currentSubscriber = runEffect;
    effectFn();
    signalsSystem.currentSubscriber = prev;
  }

  // Effect is guaranteed to run at least once
  runEffect();
}
