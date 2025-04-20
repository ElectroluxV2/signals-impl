import { computed, effect, signal } from './09.dynamic-dependency-tracking.js';

console.log('Dynamic dependency tracking');
const reactiveVariable1 = signal('var-1 [0]');
const reactiveVariable2 = signal('var-2 [0]');

const shouldUse1 = signal(true);

const reactiveConditionalComputed = computed(() => {
  const value = shouldUse1() ? reactiveVariable1() : reactiveVariable2();
  return `Computed value: ${value}`;
});

effect(() =>
  console.log(reactiveConditionalComputed()),
);

shouldUse1.set(false);
await new Promise(r => setTimeout(r, 0));
console.log('Updates to `reactiveVariable1` below, should not trigger effect');

await new Promise(r => setTimeout(r, 1));
reactiveVariable1.set('var-1 [1]');

await new Promise(r => setTimeout(r, 1));
reactiveVariable1.set('var-1 [2]');

await new Promise(r => setTimeout(r, 1));
console.log('But changes to `reactiveVariable2` should');
reactiveVariable2.set('var-2 [1]');
