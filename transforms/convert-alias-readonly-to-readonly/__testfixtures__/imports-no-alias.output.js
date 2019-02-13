import { readOnly, oneWay } from 'ember-alias-cps';

export default {
  foo: readOnly('what'),
  bar: oneWay('donteven'),
  baz: readOnly('okthen'),
};
