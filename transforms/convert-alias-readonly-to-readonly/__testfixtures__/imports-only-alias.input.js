import { alias } from 'ember-alias-cps';

export default {
  foo: alias('what').readOnly(),
  bar: alias('donteven'),
  baz: alias('okthen').readOnly(),
};
