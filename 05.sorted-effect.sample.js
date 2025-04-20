import { computed, effect, signal } from './05.sorted-effect.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber.get() % 2 === 0 ? 'even' : 'odd');

effect(() =>
  console.log('Number is ' + reactiveNumber.get() + ' and it is ' + reactiveParity.get())
);

reactiveNumber.set(2);
