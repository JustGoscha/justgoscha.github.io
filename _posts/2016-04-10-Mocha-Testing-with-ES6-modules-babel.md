---
layout: post
title:  "Testing ES6 Modules with Mocha and CoffeeScript"
date:   2016-04-11 11:13:02
categories: programming
tags:
- testing
- mocha
- babel
- es6
- coffeescript
---

What I wanted to do:

- Use Mocha with CoffeeScript
- Test JavaScript ES6 code (with ES6 modules)

The only solution I found to test my JavaScript code that is organized with ES6 modules is to compile the source files with Babel first. Then in your coffeescript test files you can simply `require` them. So here's my `test.sh`:

```sh
# pre-compile js sources with babel into test folder
find ./js/*.js -type f -exec sh -c './node_modules/babel-cli/bin/babel.js "$0" > test/"$0"' {} ';'
./node_modules/mocha/bin/mocha ./test/main.coffee --compilers js:coffee-script/register --reporter spec

# now delete all compiled files again
rm -r test/js/*
```

The test/js folder has to have the same folder structure as your js/ folder or it will not work. You can probably modify the code to make a folder if it is not available, but I wanted to use `find -exec` and didn't want the hassle.

You also need a `.babelrc`:

```js
{
  presets: ["es2015"]
}
```

Now ideally I would also like to use the ES6 module import/export in my CoffeeScript test code. But it doesn't support ES6 modules, yet and doesn't even compile if I use the keyword import.

So I have to use it in js-literal syntax.

```coffeescript
`import parser from "./js/parser.js"`
```

Now if you use the normal CoffeeScript compiler of Mocha, it compiles the CoffeeScript to JS, but the js-literal stays the same and is still ES6. If you write your Mocha test code in JS then there is a babel compiler that compiles your ES6 code to ES5. 

So for me I had to write my own compiler that compiles CoffeeScript first and then it compiles it again with Babel.

```js
var fs = require('fs');
var coffee = require("coffee-script");
var babel = require("babel-core");

require.extensions['.coffee'] = function(module, filename) {
    var content = fs.readFileSync(filename, 'utf8');
    var compiled = coffee.compile(content, {bare: true});
    compiled = babel.transform(compiled, {presets:["es2015"]}).code;
    return module._compile(compiled, filename); // module._compile is not mentioned in the Node docs, what is it? And why is it private-ish?
};
```

...and use it like this...

```sh
./node_modules/mocha/bin/mocha ./test/main.coffee --compilers coffee:./coffee-babel --reporter spec
```

My compiler uses the `bare` option for coffeescript, because the `import` statements has always to be at the top-level and the coffeescript compiler wraps by default everything in a closure.

But this bare option has by itself its own downsides. Now all your top-level code in seperate coffeescript files is top-level code for all files. So ideally you have to wrap this code by yourself, for example in the first `describe`.

**Ok, that's it, that's my solution. But, the pre-compilation is slow and cumbersome. So this solution is bad.**

## What would be an ideal solution?

The ideal solution would be if there was an option in the `mocha` command to pre-compile the source files, that you're testing. But `mocha` doesn't necessarily now, which files I'll require in my tests.

This problem will also solve itself when Node starts to support the new module systems. But, I'm not sure when this will happen. Or if it will happen at all.

I think it's probably best to use the AMD modules for now for testing and writing code.