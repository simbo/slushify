'use strict';

var gulp = require('gulp'),
    Slushify = require('..');

var generator = new Slushify(gulp);

generator.config.addOptions([{
    name: 'projectName',
    question: 'project name:'
}, {
    name: 'projectDescription',
    question: 'project description:'
}]);

generator.addTemplates('README.md');
