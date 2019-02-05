"use strict";

const { runTransformTest } = require("codemod-cli");

runTransformTest({
  type: "jscodeshift",
  name: "convert-ember-alias-imports-to-alias-cp-imports"
});
