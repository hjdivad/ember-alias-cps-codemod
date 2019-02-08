import { alias, readOnly } from 'ember-alias-cps';

export default {
  foo: readOnly('what'),
  bar: alias('donteven'),
  baz: readOnly('okthen'),
};

