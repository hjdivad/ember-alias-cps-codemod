import { readOnly } from 'ember-alias-cps';

export default {
  foo: readOnly('what').chainCall(),
};
