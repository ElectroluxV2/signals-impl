import { signal, computed } from './05.auto-subscribe.js';
import { effect } from './08.scheduled-effect.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber() % 2 === 0 ? 'even' : 'odd');

effect(() =>
  console.log('Number is ' + reactiveNumber() + ' and it is ' + reactiveParity())
);

reactiveNumber.set(2);
reactiveNumber.set(3);

await new Promise(r => setTimeout(r, 0));

reactiveNumber.set(4);
reactiveNumber.set(5);
