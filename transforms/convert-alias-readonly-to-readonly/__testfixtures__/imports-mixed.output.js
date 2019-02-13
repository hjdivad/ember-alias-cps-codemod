import { alias, oneWay, readOnly } from 'ember-alias-cps';

export default {
  foo: readOnly('what'),
  bar: alias('donteven'),
  baz: oneWay('okthen'),
  qux: readOnly('ohai'),
};
