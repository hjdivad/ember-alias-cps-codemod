const { getParser } = require("codemod-cli").jscodeshift;
const { getOptions } = require("codemod-cli");

const AliasImportNames = Object.freeze(["alias", "oneWay", "readOnly"]);

function extractAliasImports(j, importDeclarationNode) {
  let aliasImportSpecifiers = new Set();
  let importDeclaration = j(importDeclarationNode);

  // populate the alias imports from this import declaration with source @ember/object/computed
  importDeclaration
    .find(j.ImportSpecifier)
    .filter(p => AliasImportNames.includes(p.value.imported.name))
    .forEach(p => {
      aliasImportSpecifiers.add(p.node);
      j(p).remove();
    });

  // if this import declaration had any alias specifiers, add a new import
  // declaration with the same specifiers and a new source
  if (aliasImportSpecifiers.size > 0) {
    let newImport = j.importDeclaration(
      Array.from(aliasImportSpecifiers),
      j.literal("ember-alias-cps")
    );
    importDeclaration.insertAfter(newImport);
  }

  // if there were only alias imports, remove the old import declaration entirely
  if (importDeclaration.find(j.ImportSpecifier).size() === 0) {
    importDeclaration.remove();
  }
}

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const printOptions = {
    quote: "single",
    wrapColumn: 100
  };

  // cf https://github.com/rwjblue/ember-qunit-codemod/blob/master/transforms/convert-module-for-to-setup-test/index.js
  return j(file.source)
    .find(j.ImportDeclaration, { source: { value: "@ember/object/computed" } })
    .forEach(p => extractAliasImports(j, p))
    .toSource(printOptions);
};
