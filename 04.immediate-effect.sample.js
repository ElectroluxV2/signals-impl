import { effect } from './04.immediate-effect.js';
import { computed, signal } from './03.auto-subscribe.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber.get() % 2 === 0 ? 'even' : 'odd');

effect(() =>
  console.log('Number is ' + reactiveNumber.get() + ' and it is ' + reactiveParity.get())
  // console.log('Number is ' + reactiveParity.get() + ' and it is ' + reactiveNumber.get())
);

reactiveNumber.set(2);
