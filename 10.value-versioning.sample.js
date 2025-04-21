import { computed, effect, signal } from './10.value-versioning.js';

const reactiveNumber = signal(1);
const reactiveLargeEnough = computed(() => reactiveNumber() >= 10, 'large');
const reactiveText = computed(() => 'Is large enough: ' + reactiveLargeEnough(), 'text');

effect(() => console.log('Effect:', reactiveText()));

reactiveNumber.set(2);
await new Promise(r => setTimeout(r, 0));
reactiveNumber.set(3);
await new Promise(r => setTimeout(r, 0));
reactiveNumber.set(10);
