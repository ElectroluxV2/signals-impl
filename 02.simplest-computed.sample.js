import { signal } from './00.simplest-signal.js';
import { computed } from './02.simplest-computed.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(
  () => reactiveNumber.get() % 2 === 0,
  [reactiveNumber]
);

console.log('synchronous reactiveNumber read:', reactiveNumber.get());
console.log('synchronous reactiveParity read:', reactiveParity.get());

reactiveNumber.subscribe(() => console.log('reactiveNumber updated:', reactiveNumber.get()));
reactiveParity.subscribe(() => console.log('reactiveParity updated:', reactiveParity.get()));

reactiveNumber.set(2);
