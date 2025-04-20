import { signal } from './00.simplest-signal.js';

const reactiveNumber = signal(1);
console.log('synchronous value read:', reactiveNumber.get());

reactiveNumber.subscribe(() => console.log('reactiveNumber signal updated:', reactiveNumber.get()));
reactiveNumber.set(2);
