import { signal } from './01.neat-syntax.js';

const reactiveNumber = signal(1);
console.log('synchronous value read:', reactiveNumber());

reactiveNumber.subscribe(() => console.log('reactiveNumber signal updated:', reactiveNumber()));
reactiveNumber.set(2);
