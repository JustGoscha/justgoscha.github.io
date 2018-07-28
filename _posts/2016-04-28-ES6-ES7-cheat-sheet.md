---
layout: post
title:  "ES6 & ES7 Features Overview and Cheat Sheet"
date: 2016-04-28 14:13:02
categories: programming
tags:
- javascript
- ecmascript
- es6
- es7
---


# EcmaScript 6

## Collections

#### Differences to Objects

- iterable: `for .. of` loop and `...` operator can be used
- key-value pairs not exposed as properties: no `map.key` or `map['key']`, instead `map.get('key')` and `map.set('key', value)`
- entries not inherited via prototype chain
- JSON.stringify not working on Set or Map

### Set
- unique values
- no indexing

#### Syntax

```javascript
// create a set with ["a","b","c"] content
var set = new Set("abc");
// same as 
var set = new Set(["a","b","c"]);
// new Set(iterable)
set.has("a")
// -> true
set.size
// -> 3
set.add("d")
set.delete("a")
set.forEach(function(){}) // iterate over entries, in order of insertion
set.entries() // get iterator of set
set.keys(); set.values(); // iterators for interoparability with Map
set.values === set.keys // 
set.clear() // remove all entries
```

#### Upsides

- `set.has(entry)` much fast than `array.indexOf(entry)`

#### Downsides

- no functional helpers like on array, like `.map()`, `.filter()` ,`.some()`, `.every()`
- no `.addAll(values)`, `hasAll(values)`



### Map

- store any kind of key, value pairs (not only string keys like for objects)

```javascript
var map = new Map();
var map = new Map([[2,"b"], [1, "a"]]) // -> Map { 2: "b", 1: "a" }
map.size // -> 2
map.get(2) // -> "b"
map.set(key, value); // set or overwrite key
map.delete(key);
map.clear(); // delete all keys
map.forEach(function(value,key,map){}) // iterate over entries in order of insertion
map.keys(); // iterator over all keys
map.values(); // iterator over all values
map.entries(); // iterator over all entries (pairs) 

```

### WeakMap, WeakSet

#### Differences to Map/Set:
- WeakMap only supports `new`, `.has()`, `.get()`, `.set()`, `.delete()`
- WeakSet only supports  `new`, `.has()`, `.add()`, `.delete()`
- values of `WeakSet` must be objects
- keys of `WeakMap` must be objects
- not iterable
- **weak references** to keys and values -> will be **garbage collected** when no other references

## Generators

```javascript
// returns iterator function for the body of this 
function* generate(array){
  for(var value of array){
    yield value;  
  }
}

function generate(){
  var i = 0;
  return function(){
    i++;
    return i;
  }
}

var array = ["a","b"];
var iterator = generate(array);
// calling next always executes to the next yield keyword 
// and returns the value after yield (like return)
iterator.next(); // -> {done: false, value: "a"}
iterator.next(); // -> {done: false, value: "b"}
// when the function reaches the end, the done property is set to false
iterator.next(); // -> {done: true, value: undefined}
```

## Proxies

## Default Parameters

## Classes

## Subclassing

## `let` and `const`

## Typed Arrays

## Promises

## Arrow Functions

## Destructuring

## Iterators, for-of loop

## Template Strings

## Symbols

## Function Names

## Spread Operators

## New `Math` functions

## New `Number` functions

# EcmaScript 7

## Async Functions

```javascript
// This function should return a promise
async function getValue(key){
  var awaitedValue = null;
  try {
    awaitedValue = await fetchMyValue(key);
  } catch(e) { // error handling }
  return awaitedValue;
}
```

## Typed Objects

## SIMD

## New Operators

## Class/Property Decorators


