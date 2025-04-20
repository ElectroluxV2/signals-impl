import { computed, signal } from './04.auto-subscribe.js';

const reactiveNumber = signal(1);
const reactiveParity = computed(() => reactiveNumber.get() % 2 === 0 ? 'even' : 'odd');
const reactiveText = computed(() => 'Number is ' + reactiveNumber.get() + ' and it is ' + reactiveParity.get());

console.log(reactiveText.get());
reactiveNumber.set(2);
console.log(reactiveText.get());
