import { readOnly } from 'ember-alias-cps';

export default {
  foo: readOnly('what'),
  bar: readOnly('donteven'),
  baz: readOnly('okthen'),
};
