import { computed, signal } from './05.auto-subscribe.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber() % 2 === 0 ? 'even' : 'odd');
const reactiveText = computed(() => 'Number is ' + reactiveNumber() + ' and it is ' + reactiveParity());

console.log(reactiveText());
reactiveNumber.set(2);
console.log(reactiveText());
