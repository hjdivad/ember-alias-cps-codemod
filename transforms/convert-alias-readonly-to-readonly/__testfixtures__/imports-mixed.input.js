import { alias, oneWay, readOnly } from 'ember-alias-cps';

export default {
  foo: alias('what').readOnly(),
  bar: alias('donteven'),
  baz: oneWay('okthen'),
  qux: readOnly('ohai'),
};
