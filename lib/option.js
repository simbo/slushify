'use strict';

var arrayify = require('arrayify');

var Question = require('./question.js');

/**
 * Option constructor
 * @param {Object} data    option properties
 * @param {Config} config  config instance
 */
function Option(config, data) {
    data = typeof data === 'object' && data.hasOwnProperty('name') ? data : {name: data};
    this.config = config;
    this.name = data.hasOwnProperty('name') ? data.name : undefined;
    this.default = data.hasOwnProperty('default') ? data.default : undefined;
    this.validateFn = data.hasOwnProperty('validate') && typeof data.validate === 'function' ?
        data.validate : defaultValidateFn;
    this.filterFn = data.hasOwnProperty('filter') && typeof data.filter === 'function' ?
        data.filter : defaultFilterFn;
    this.flags = data.hasOwnProperty('flags') ? arrayify(data.flags) : [];
    this.question = false;
    this.setQuestion(data.question);
}

/**
 * regular expression for option names
 * @type {RegExp}
 */
Option.prototype.regexpName = /^[a-z0-9_]+$/i;

/**
 * test if given var is a valid option
 * @param  {Option}  option  var to test
 * @return {Boolean}         result
 */
Option.prototype.isOption = function(option) {
    option = option || this;
    return option.constructor && option.constructor.name === this.constructor.name &&
        option.hasOwnProperty('config') && option.config.constructor && option.config.constructor.name === 'Config' &&
        option.hasOwnProperty('question') &&
        (option.question === false || (option.question.constructor && option.question.constructor.name === 'Question')) &&
        option.hasOwnProperty('name') && typeof option.name === 'string' && option.name.match(this.regexpName) &&
        option.hasOwnProperty('validateFn') && typeof option.validateFn === 'function' &&
        option.hasOwnProperty('filterFn') && typeof option.filterFn === 'function' ?
            true : false;
};

/**
 * set option value
 * @param {mixed} value  value to set
 */
Option.prototype.setValue = function(value) {
    if (this.validateValue(value)) {
        this.value = this.filterValue(value);
    }
};

/**
 * return option value
 * @return {mixed} value
 */
Option.prototype.getValue = function() {
    return this.value;
};

/**
 * call defined filter function and return filtered value
 * @param  {mixed} value  value to filter
 * @return {mixed}        filtered value
 */
Option.prototype.filterValue = function(value) {
    return this.filterFn.call(this, value, this.config);
};

/**
 * call defined validation function and return test result
 * @param  {mixed} value  value to test
 * @return {Boolean}      result
 */
Option.prototype.validateValue = function(value) {
    return this.validateFn.call(this, value, this.config) === true ? true : false;
};

/**
 * return default value
 * @return {mixed} [description]
 */
Option.prototype.getDefaultValue = function() {
    return typeof this.default === 'function' ? this.default.call(this) : this.default;

};

/**
 * set option value to default
 */
Option.prototype.setDefaultValue = function() {
    this.value = this.getDefaultValue();
    return this;
};

/**
 * add a flag
 * @param {String} flag  flag name
 */
Option.prototype.addFlag = function(flag) {
    if (!this.hasFlag(flag)) {
        this.flags.push(flag);
    }
    return this;
};

/**
 * test if option has a flag
 * @param  {String}  flag  flag name
 * @return {Boolean}       test result
 */
Option.prototype.hasFlag = function(flag) {
    return this.flags.indexOf(flag) !== -1;
};

/**
 * remove a flag
 * @param  {String} flag  flag name
 * @return {Boolean}      test result
 */
Option.prototype.removeFlag = function(flag) {
    var i = this.flags.indexOf(flag);
    if (i !== -1) {
        this.flags.splice(i, 1);
    }
    return this;
};

/**
 * set corresponding question for inquirer
 * @param {mixed} questionData  data to create new question
 */
Option.prototype.setQuestion = function(questionData) {
    var question = new Question(this, questionData);
    if (questionData !== false && question.isQuestion()) {
        this.question = question;
    }
    return this;
};

/**
 * default validation function
 * @param  {mixed} value  value to test
 * @return {Boolean}      test result
 */
function defaultValidateFn(value) {
    return value ? true : false;
}

/**
 * default filter function
 * @param  {mixed} value  value to filter
 * @return {mixed}        filtered value
 */
function defaultFilterFn(value) {
    return value;
}

/**
 * module exports
 * @type {Class}
 */
module.exports = Option;
