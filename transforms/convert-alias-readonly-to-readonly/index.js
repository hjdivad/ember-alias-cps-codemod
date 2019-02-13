const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');
const recast = require('recast');

global.d = function d(o) {
  if (!o) {
    return null;
  }

  if (o.constructor.name === 'NodePath') {
    return recast.print(o).code;
  } else if (o.forEach) {
    let result = [];
    o.forEach(path => result.push(recast.print(path).code));
    return result;
  }

  throw `No idea what this is: '${o}'`;
};

function findAliasImport(j, ast) {
  let importDeclarations = ast.find(j.ImportDeclaration, { source: { value: 'ember-alias-cps' } });

  let matchingImportDeclaration = importDeclarations
    .filter(n => j(n).find(j.ImportSpecifier, { imported: { name: 'alias' } }))
    .at(0);

  return matchingImportDeclaration.find(j.ImportSpecifier, { imported: { name: 'alias' } }).at(0);
}

function readOnlyCallInAliasReadOnlyChain(j, aliasCall) {
  // false-positive: aliasCall occurs in MemberExpression.property
  //  eg `foo[alias()]`
  // false-negative: call via string literal
  //  eg `alias('ok')['readOnly']()`
  return j(aliasCall).closest(j.CallExpression, {
    callee: {
      property: {
        name: 'readOnly',
      },
    },
  });
}

function isAliasCallInChainWithReadOnly(j, aliasCall) {
  return readOnlyCallInAliasReadOnlyChain(j, aliasCall).length > 0;
}

function findAliasCalls(j, aliasImportSpecifier, ast) {
  let localAliasName = aliasImportSpecifier.get('local').value.name;
  // This is scope-unaware, so has
  //  false-negative: imported name assigned to var; that var called
  //  false-positive: imported name is shadowed in this scope
  return ast.find(j.CallExpression, { callee: { name: localAliasName } });
}

function findAliasReadOnlyCalls(j, aliasImportSpecifier, ast) {
  let aliasCalls = findAliasCalls(j, aliasImportSpecifier, ast);
  let aliasReadOnlyCalls = aliasCalls.filter(n => isAliasCallInChainWithReadOnly(j, n));

  return aliasReadOnlyCalls;
}

function ensureReadOnlyImported(j, aliasImport) {
  let importDeclaration = aliasImport.closest(j.ImportDeclaration, {
    source: { value: 'ember-alias-cps' },
  });
  let readOnlySpecifier = importDeclaration.find(j.ImportSpecifier, {
    imported: { name: 'readOnly' },
  });
  if (readOnlySpecifier.length > 0) {
    return readOnlySpecifier;
  }

  // Does not handle name collisions (eg if readOnly is already imported and we
  // need to import readOnly as readOnly2
  readOnlySpecifier = j.importSpecifier(j.identifier('readOnly'), j.identifier('readOnly'));

  // append as last specifier
  importDeclaration
    .find(j.ImportSpecifier)
    .at(-1)
    .insertAfter(readOnlySpecifier);

  // return the last specifier (the one we just created & appended)
  return importDeclaration.find(j.ImportSpecifier).at(-1);
}

function transformAliasReadOnlyCallsToReadOnly(j, readOnlyImportSpecifier, aliasReadOnlyCalls) {
  // import { readOnly as wat } => 'wat'
  let localReadOnlyName = readOnlyImportSpecifier.get('local').get('name').value;

  // alias('x').y().readOnly() => alias('x').y()
  aliasReadOnlyCalls.forEach(aliasCall => {
    let readOnlyCall = readOnlyCallInAliasReadOnlyChain(j, aliasCall);
    let memObj = readOnlyCall.get('callee').get('object');
    readOnlyCall.replaceWith([memObj.value]);
  });
  // alias('x').y() => readOnly('x').y()
  aliasReadOnlyCalls.forEach(aliasCall => {
    j(aliasCall.get('callee')).replaceWith(j.identifier(localReadOnlyName));
  });
}

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const printOptions = {
    quote: 'single',
    wrapColumn: 100,
  };

  let ast = j(file.source);
  // do we import { alias } from 'ember-alias-cps' ?
  let aliasImportSpecifier = findAliasImport(j, ast);

  if (aliasImportSpecifier.size() > 0) {
    let aliasReadOnlyCalls = findAliasReadOnlyCalls(j, aliasImportSpecifier, ast);
    if (aliasReadOnlyCalls.size() > 0) {
      let readOnlyImportSpecifier = ensureReadOnlyImported(j, aliasImportSpecifier);
      transformAliasReadOnlyCallsToReadOnly(j, readOnlyImportSpecifier, aliasReadOnlyCalls);

      let remainingAliasCalls = findAliasCalls(j, aliasImportSpecifier, ast);
      if (remainingAliasCalls.length === 0) {
        aliasImportSpecifier.remove();
      }
    }
  }

  return ast.toSource(printOptions);
};
