# convert-ember-alias-imports-to-alias-cp-imports

## Usage

```
npx ember-alias-cps-codemod convert-ember-alias-imports-to-alias-cp-imports path/of/files/ or/some**/*glob.js

# or

yarn global add ember-alias-cps-codemod
ember-alias-cps-codemod convert-ember-alias-imports-to-alias-cp-imports path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->

- [imports-mixed-with-existing-alias-cps-import](#imports-mixed-with-existing-alias-cps-import)
- [imports-multiple-alias-mixed](#imports-multiple-alias-mixed)
- [imports-multiple-alias](#imports-multiple-alias)
- [imports-multiple-declarations](#imports-multiple-declarations)
- [imports-multiple-redundant-declarations](#imports-multiple-redundant-declarations)
- [imports-no-alias](#imports-no-alias)
- [imports-only-alias](#imports-only-alias)
- [lacks-import-module](#lacks-import-module)
  <!--FIXTURES_TOC_END-->

## <!--FIXTURES_CONTENT_START-->

<a id="imports-mixed-with-existing-alias-cps-import">**imports-mixed-with-existing-alias-cps-import**</a>

**Input** (<small>[imports-mixed-with-existing-alias-cps-import.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-mixed-with-existing-alias-cps-import.input.js)</small>):

```js
import { alias, mapBy } from "@ember/object/computed";
```

**Output** (<small>[imports-mixed-with-existing-alias-cps-import.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-mixed-with-existing-alias-cps-import.output.js)</small>):

```js
import { mapBy } from "@ember/object/computed";
import { alias } from "ember-alias-cps";
```

---

<a id="imports-multiple-alias-mixed">**imports-multiple-alias-mixed**</a>

**Input** (<small>[imports-multiple-alias-mixed.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-alias-mixed.input.js)</small>):

```js
import {
  oneWay,
  mapBy,
  readOnly,
  alias,
  something
} from "@ember/object/computed";
import { oneWay, alias, readOnly } from "something-totally-different";
```

**Output** (<small>[imports-multiple-alias-mixed.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-alias-mixed.output.js)</small>):

```js
import { mapBy, something } from "@ember/object/computed";
import { oneWay, readOnly, alias } from "ember-alias-cps";
import { oneWay, alias, readOnly } from "something-totally-different";
```

---

<a id="imports-multiple-alias">**imports-multiple-alias**</a>

**Input** (<small>[imports-multiple-alias.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-alias.input.js)</small>):

```js
import { oneWay, readOnly } from "@ember/object/computed";
```

**Output** (<small>[imports-multiple-alias.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-alias.output.js)</small>):

```js
import { oneWay, readOnly } from "ember-alias-cps";
```

---

<a id="imports-multiple-declarations">**imports-multiple-declarations**</a>

**Input** (<small>[imports-multiple-declarations.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-declarations.input.js)</small>):

```js
```

**Output** (<small>[imports-multiple-declarations.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-declarations.output.js)</small>):

```js
```

---

<a id="imports-multiple-redundant-declarations">**imports-multiple-redundant-declarations**</a>

**Input** (<small>[imports-multiple-redundant-declarations.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-redundant-declarations.input.js)</small>):

```js
```

**Output** (<small>[imports-multiple-redundant-declarations.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-multiple-redundant-declarations.output.js)</small>):

```js
```

---

<a id="imports-no-alias">**imports-no-alias**</a>

**Input** (<small>[imports-no-alias.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-no-alias.input.js)</small>):

```js
import { mapBy } from "@ember/object/computed";
```

**Output** (<small>[imports-no-alias.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-no-alias.output.js)</small>):

```js
import { mapBy } from "@ember/object/computed";
```

---

<a id="imports-only-alias">**imports-only-alias**</a>

**Input** (<small>[imports-only-alias.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-only-alias.input.js)</small>):

```js
import { alias } from "@ember/object/computed";
```

**Output** (<small>[imports-only-alias.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/imports-only-alias.output.js)</small>):

```js
import { alias } from "ember-alias-cps";
```

---

<a id="lacks-import-module">**lacks-import-module**</a>

**Input** (<small>[lacks-import-module.input.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/lacks-import-module.input.js)</small>):

```js
import { something } from "somewhere";

export default class SomethingOrOther {}
```

**Output** (<small>[lacks-import-module.output.js](transforms/convert-ember-alias-imports-to-alias-cp-imports/__testfixtures__/lacks-import-module.output.js)</small>):

```js
import { something } from "somewhere";

export default class SomethingOrOther {}
```

<!--FIXTURE_CONTENT_END-->
