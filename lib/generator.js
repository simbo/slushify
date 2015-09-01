'use strict';

var arrayify = require('arrayify'),
    events = require('events'),
    gulpConflict = require('gulp-conflict'),
    gulpTemplate = require('gulp-template'),
    gulpUtil = require('gulp-util'),
    chalk = gulpUtil.colors,
    inquirer = require('inquirer'),
    minimist = require('minimist'),
    path = require('path'),
    util = require('util');

var Config = require('./config.js'),
    TemplateSet = require('./templateset.js');

/**
 * Generator constructor
 *
 * @param {gulp} gulp  gulp instance
 */
function Generator(gulp) {
    events.EventEmitter.call(this);
    this.gulp = gulp;
    this.inquirer = inquirer;
    this.util = gulpUtil;
    this.chalk = chalk;
    this.cwd = process.cwd();
    this.pkgDir = path.dirname(module.parent.parent.filename);
    this.templatesDir = path.join(this.pkgDir, 'templates');
    this.templateSets = [];
    this.config = new Config();
    this.parseParams()
        .addGulpTask();
}

/**
 * inherit from EventEmitter to use events
 */
util.inherits(Generator, events.EventEmitter);

/**
 * add a gulp task to generators gulp instance
 *
 * @param {String} taskName   task name
 * @param {Function} taskFn   task function
 */
Generator.prototype.addGulpTask = function(taskName, taskFn) {
    taskName = typeof taskName === 'string' && taskName.length > 0 ? taskName : 'default';
    taskFn = typeof taskName === 'function' ? taskFn : this.gulpTask.bind(this);
    this.gulp.task(taskName, taskFn);
    return this;
};

/**
 * default gulp task
 *
 * @param  {Function} done  async done()
 * @return {void}
 */
Generator.prototype.gulpTask = function(done) {
    this.done = done;
    this.emit('startingGulpTask', this);
    this.on('afterAskingQuestions', this.scaffold.bind(this));
    this.askQuestions();
};

/**
 * parse cli params
 */
Generator.prototype.parseParams = function() {
    var args = minimist(process.argv.slice(3));
    this.params = {
        nonInteractive: args['non-interactive'] || args.n ? true : false
    };
    return this;
};

Generator.prototype.addOptions = function(options) {
    this.config.addOptions(options);
    return this;
};

/**
 * add one or more templates, with or without condition
 *
 * @param {mixed} sets  template path, template object, array of template paths or template objects
 */
Generator.prototype.addTemplates = function(sets) {
    arrayify(sets).forEach(function(set) {
        var templateSet = new TemplateSet(set);
        if (templateSet.isTemplateSet()) {
            this.templateSets.push(templateSet);
        }
    }.bind(this));
    return this;
};

/**
 * retrieve template sources
 *
 * @return {Array} template paths
 */
Generator.prototype.getTemplateSources = function() {
    return this.templateSets.reduce(function(sources, templateSet) {
        sources = sources.concat(templateSet.getConditionalSources(this.config).map(function(source) {
            return path.join(this.templatesDir, source);
        }.bind(this)));
        return sources;
    }.bind(this), []);
};

/**
 * ask questions
 */
Generator.prototype.askQuestions = function() {
    if (this.params.nonInteractive === false) {
        this.emit('askingQuestions', this);
        this.inquirer.prompt(this.config.getQuestions(), function(answers) {
            this.parseAnswers(answers);
            this.emit('afterAskingQuestions', this);
        }.bind(this));
    } else {
        this.emit('afterAskingQuestions', this);
    }
    return this;
};

/**
 * change config options depending on question answers
 *
 * @param {Object} answers  answer keys and values
 */
Generator.prototype.parseAnswers = function(answers) {
    Object.keys(answers).forEach(function(key) {
        if (this.config.hasOption(key)) {
            this.config.getOption(key).setValue(answers[key]);
        }
    }.bind(this));
    return this;
};

/**
 * run scaffolding
 */
Generator.prototype.scaffold = function() {
    this.emit('scaffolding', this);
    this.gulp.src(this.getTemplateSources(), {dot: true})
        .pipe(gulpTemplate(this.config.getOptionValues()))
        .pipe(gulpConflict(this.cwd + '/'))
        .pipe(this.gulp.dest(this.cwd + '/'))
        .on('end', function() {
            this.emit('afterScaffolding', this);
            this.done();
        }.bind(this));
    return this;
};

/**
 * export Generator
 *
 * @type {Class}
 */
module.exports = Generator;
