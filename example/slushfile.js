'use strict';

var gulp = require('gulp'),
    Slushify = require('..');

var generator = new Slushify(gulp);

generator.config.addOptions([{
    name: 'projectName',
    question: 'Your project name:'
}, {
    name: 'projectDescription'
}]);

generator.addTemplates('README.md');
