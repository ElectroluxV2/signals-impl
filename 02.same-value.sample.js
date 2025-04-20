import { signal as signalWithoutEqualityCheck } from './01.neat-syntax.js';
import { signal as signalWithEqualityCheck } from './02.same-value.js';

const reactiveNumber1 = signalWithoutEqualityCheck(1);

reactiveNumber1.subscribe(() => console.log('reactiveNumber1 signal updated:', reactiveNumber1()));
reactiveNumber1.set(2);
reactiveNumber1.set(2);

const reactiveNumber2 = signalWithEqualityCheck(1);

reactiveNumber2.subscribe(() => console.log('reactiveNumber2 signal updated:', reactiveNumber2()));
reactiveNumber2.set(2);
reactiveNumber2.set(2);
