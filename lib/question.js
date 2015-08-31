'use strict';

/**
 * Question constructor
 *
 * @param {Option} option corresponding option instance
 * @param {mixed} data initial data
 */
function Question(option, data) {
    data = data === true || data === undefined ? option.name :
        (typeof data === 'string' ? {message: data} : data);
    this.option = option;
    this.message = data.hasOwnProperty('message') ? data.message : option.name;
    this.type = data.hasOwnProperty('type') ? data.type : 'input';
    this.choices = data.hasOwnProperty('choices') ? data.choices : [];
    this.when = data.hasOwnProperty('when') ? data.when : true;
}

Question.isQuestion = function(question) {
    return question.constructor && question.constructor.name === 'Question' &&
        question.option && question.option.constructor && question.option.constructor.name === 'Option' ?
        true : false;
}

Question.prototype.isQuestion = function() {
    return Question.isQuestion(this);
};

Question.prototype.getQuestion = function() {
    var question = {
        message: this.message,
        type: this.type,
        choices: this.choices,
        when: this.when,
        name: this.option.name,
        default: function() {
            return this.option.getDefaultValue();
        }.bind(this),
        validate: function(value) {
            return this.option.validateFn.call(this, value);
        }.bind(this),
        filter: function(value) {
            return this.option.filterFn.call(this, value);
        }.bind(this)
    };
    return question;
};

module.exports = Question;
