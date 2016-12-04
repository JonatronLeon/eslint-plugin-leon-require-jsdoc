# eslint-plugin-leon-require-jsdoc

An update to the require-jsdoc that catches more function expressions and declarations.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-leon-require-jsdoc`:

```
$ npm install eslint-plugin-leon-require-jsdoc --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-leon-require-jsdoc` globally.

## Usage

Add `leon-require-jsdoc` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "leon-require-jsdoc"
    ],
    "rules": {
        //...
        "leon-require-jsdoc/leon-require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true,
                "ArrowFunctionExpression": true
            }
        }]
        //...
    }
}
```





