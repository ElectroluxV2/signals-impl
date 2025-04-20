import { signal } from './01.neat-syntax.js';
import { computed as eagerComputed } from './03.simplest-computed.js';
import { computed as lazyComputed } from './04.stale-computed.js';

const reactiveNumber = signal(1);
const reactiveParityEager = eagerComputed(
  () => {
    console.log('Eager computation');
    return reactiveNumber() % 2 === 0;
  },
  [reactiveNumber]
);

const reactiveParityLazy = lazyComputed(
  () => {
    console.log('Lazy computation');
    return reactiveNumber() % 2 === 0;
  },
  [reactiveNumber]
);


console.log('Eager:', reactiveParityEager(), 'Lazy:', reactiveParityLazy());

reactiveNumber.set(2);
reactiveNumber.set(3);
reactiveNumber.set(4);
console.log('Eager:', reactiveParityEager(), 'Lazy:', reactiveParityLazy());
