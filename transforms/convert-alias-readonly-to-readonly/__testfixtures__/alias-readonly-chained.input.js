import { alias } from 'ember-alias-cps';

export default {
  foo: alias('what').readOnly().chainCall(),
};
