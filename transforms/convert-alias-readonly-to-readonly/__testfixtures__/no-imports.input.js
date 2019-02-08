import { alias } from 'somewhere-totally-different';

export default {
  foo: alias('bar'),
  bar: alias('baz').readOnly(),
};
