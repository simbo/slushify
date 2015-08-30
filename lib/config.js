'use strict';

var arrayify = require('arrayify');

var Option = require('./option.js');

function Config() {
    this.options = {};
}

Config.prototype.addOptions = function(options) {
    arrayify(options).forEach(function(data) {
        this.addOption(data);
    }.bind(this));
    return this;
};

Config.prototype.addOption = function(data) {
    var option = new Option(this, data);
    if (option.isOption() && !this.hasOption(option.name)) {
        this.options[option.name] = option;
    }
    return this;
};

Config.prototype.getOption = function(name) {
    return this.hasOption(name) ? this.options[name] : undefined;
};

Config.prototype.getOptions = function() {
    return this.options;
};

Config.prototype.getOptionsByFlag = function(flag) {
    return this.options.filter(function(option) {
        return option.hasFlag(flag);
    });
};

Config.prototype.hasOption = function(name) {
    return this.options.hasOwnProperty(name) ? true : false;
};

Config.prototype.removeOption = function(name) {
    if (this.hasOption(name)) {
        delete this.options[name];
    }
    return this;
};

Config.prototype.setOptionValue = function(name, value) {
    if (this.hasOption(name)) {
        this.options[name].setValue(value);
    }
    return this;
};

Config.prototype.getOptionValue = function(name) {
    return this.hasOption(name) ? this.options[name].getValue() : undefined;
};

Config.prototype.getOptionValues = function() {
    return Object.keys(this.options).reduce(function(values, optionId) {
        values[optionId] = this.options[optionId].getValue();
        return values;
    }.bind(this), {});
};

Config.prototype.getQuestions = function() {
    return Object.keys(this.options).reduce(function(questions, optionName) {
        var option = this.options[optionName];
        if (option.question !== false) {
            questions.push(option.question.getQuestion());
        }
        return questions;
    }.bind(this), []);
};

module.exports = Config;
