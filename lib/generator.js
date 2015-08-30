'use strict';

var arrayify = require('arrayify'),
    gulpConflict = require('gulp-conflict'),
    gulpTemplate = require('gulp-template'),
    gulpUtil = require('gulp-util'),
    chalk = gulpUtil.colors,
    inquirer = require('inquirer'),
    minimist = require('minimist'),
    path = require('path');

var Config = require('./config.js'),
    TemplateSet = require('./templateset.js');

function Generator(gulp) {
    this.gulp = gulp;
    this.inquirer = inquirer;
    this.cwd = process.cwd();
    this.pkgDir = path.dirname(module.parent.parent.filename);
    this.templatesDir = path.join(this.pkgDir, 'templates');
    this.templateSets = [];
    this.config = new Config();
    this.parseParams()
        .addGulpTask();
}

Generator.prototype.addGulpTask = function(taskName, taskFn) {
    taskName = typeof taskName === 'string' && taskName.length > 0 ? taskName : 'default';
    taskFn = typeof taskName === 'function' ? taskFn : this.gulpTask.bind(this);
    this.gulp.task(taskName, taskFn);
    return this;
};

Generator.prototype.gulpTask = function(done) {
    this.gulpTaskDone = done;
    this.askQuestions();
};

Generator.prototype.parseParams = function() {
    var args = minimist(process.argv.slice(3));
    this.params = {
        nonInteractive: args['non-interactive'] || args.n ? true : false
    };
    return this;
};

Generator.prototype.addTemplates = function(sets) {
    arrayify(sets).forEach(function(set) {
        var templateSet = new TemplateSet(set);
        if (templateSet.isTemplateSet()) {
            this.templateSets.push(templateSet);
        }
    }.bind(this));
    return this;
};

Generator.prototype.getTemplateSources = function() {
    return this.templateSets.reduce(function(sources, templateSet) {
        sources = sources.concat(templateSet.getConditionalSources(this.config).map(function(source) {
            return path.join(this.templatesDir, source);
        }.bind(this)));
        return sources;
    }.bind(this), []);
};

Generator.prototype.askQuestions = function() {
    this.inquirer.prompt(this.config.getQuestions(), function(answers) {
        this.parseAnswers(answers);
        //this.scaffold();
        console.log(this.config.getOptionValues());
        this.gulpTaskDone();
    }.bind(this));
    return this;
};

Generator.prototype.parseAnswers = function(answers) {
    Object.keys(answers).forEach(function(key) {
        if (this.config.hasOption(key)) {
            this.config.getOption(key).setValue(answers[key]);
        }
    }.bind(this));
    return this;
};

Generator.prototype.scaffold = function() {
    this.gulp.src(this.getTemplateSources(), {dot: true})
        .pipe(gulpTemplate(this.config.getOptionValues()))
        .pipe(gulpConflict(this.cwd + '/'))
        .pipe(this.gulp.dest(this.cwd + '/'))
        .on('end', this.afterScaffolding.bind(this));
    return this;
};

Generator.prototype.afterScaffolding = function() {
};

module.exports = Generator;