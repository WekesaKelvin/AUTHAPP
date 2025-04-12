import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TextEncoder } from 'node:util';

Object.defineProperty(window, 'TextEncoder', {
  writable: true,
  value: TextEncoder,
  
});


setupZoneTestEnv();




