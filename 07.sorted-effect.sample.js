import { computed, effect, signal } from './07.sorted-effect.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber() % 2 === 0 ? 'even' : 'odd');

effect(() =>
  console.log('Number is ' + reactiveNumber() + ' and it is ' + reactiveParity())
);

reactiveNumber.set(2);
reactiveNumber.set(3);
