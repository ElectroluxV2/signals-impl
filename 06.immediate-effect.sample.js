import { effect } from './06.immediate-effect.js';
import { computed, signal } from './05.auto-subscribe.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber() % 2 === 0 ? 'even' : 'odd');

effect(() =>
  console.log('Number is ' + reactiveNumber() + ' and it is ' + reactiveParity())
  // console.log('Number is ' + reactiveParity() + ' and it is ' + reactiveNumber())
);

reactiveNumber.set(2);
