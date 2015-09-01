slushify
========

  > For faster slush generator development.

[![npm Package Version](https://img.shields.io/npm/v/slushify.svg?style=flat-square)](https://www.npmjs.com/package/slushify)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Travis Build Status](https://img.shields.io/travis/simbo/slushify/master.svg?style=flat-square)](https://travis-ci.org/simbo/slushify)

[![Dependencies Status](https://img.shields.io/david/simbo/slushify.svg?style=flat-square)](https://david-dm.org/simbo/slushify)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/slushify.svg?style=flat-square)](https://david-dm.org/simbo/slushify#info=devDependencies)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/simbo/slushify.svg?style=flat-square)](https://codeclimate.com/github/simbo/slushify)
[![Code Climate Test Coverage](https://img.shields.io/codeclimate/coverage/github/simbo/slushify.svg?style=flat-square)](https://codeclimate.com/github/simbo/slushify)

---

# WORK IN PROGRESS

<!-- MarkdownTOC -->

- [How to…](#how-to…)
    - [Create a Generator](#create-a-generator)
    - [Add Options](#add-options)
    - [Add Templates](#add-templates)
- [Module classes](#module-classes)
    - [Generator](#generator)
    - [Config](#config)
    - [Option](#option)
    - [Question](#question)
    - [TemplateSet](#templateset)
- [License](#license)

<!-- /MarkdownTOC -->

## How to…

### Create a Generator

``` javascript
var gulp = require('gulp'),
    Generator = require('slushify');

var generator = new Generator(gulp);
```


### Add Options


### Add Templates


## Module classes


### Generator


#### Properties


#### Methods


#### Events

All event callbacks get current Generator instance as first argument.

  - `startingGulpTask`
  - `askingQuestions`
  - `afterAskingQuestions`
  - `scaffolding`
  - `afterScaffolding`


### Config


#### Properties


#### Methods


### Option


#### Properties


#### Methods


#### Properties


#### Methods


### Question


#### Properties


#### Methods


### TemplateSet


#### Properties


#### Methods


## License

[MIT &copy; Simon Lepel 2015](http://simbo.mit-license.org/)
