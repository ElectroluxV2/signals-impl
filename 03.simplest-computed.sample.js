import { signal } from './01.neat-syntax.js';
import { computed } from './03.simplest-computed.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(
  () => reactiveNumber() % 2 === 0,
  [reactiveNumber]
);

console.log('synchronous reactiveNumber read:', reactiveNumber());
console.log('synchronous reactiveParity read:', reactiveParity());

reactiveNumber.subscribe(() => console.log('reactiveNumber updated:', reactiveNumber()));
reactiveParity.subscribe(() => console.log('reactiveParity updated:', reactiveParity()));

reactiveNumber.set(2);
