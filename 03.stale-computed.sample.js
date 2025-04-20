import { signal } from './00.simplest-signal.js';
import { computed as eagerComputed } from './02.simplest-computed.js';
import { computed as lazyComputed } from './03.stale-computed.js';

const reactiveNumber = signal(1);
const reactiveParityEager = eagerComputed(
  () => {
    console.log('Eager computation');
    return reactiveNumber.get() % 2 === 0;
  },
  [reactiveNumber]
);

const reactiveParityLazy = lazyComputed(
  () => {
    console.log('Lazy computation');
    return reactiveNumber.get() % 2 === 0;
  },
  [reactiveNumber]
);


console.log('Eager:', reactiveParityEager.get(), 'Lazy:', reactiveParityLazy.get());

reactiveNumber.set(2);
reactiveNumber.set(3);
reactiveNumber.set(4);
console.log('Eager:', reactiveParityEager.get(), 'Lazy:', reactiveParityLazy.get());
