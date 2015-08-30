'use strict';

var arrayify = require('arrayify');

function TemplateSet(data) {
    data = typeof data === 'object' && data.hasOwnProperty('sources') ?
        data : {sources: data};
    this.sources = arrayify(data.sources).reduce(function(sources, source) {
        if (typeof source === 'string') {
            sources.push(source);
        }
        return sources;
    }, []) ;
    this.condition = typeof data.condition === 'function' || typeof data.condition === 'boolean' ?
        data.condition : true;
}

TemplateSet.prototype.isTemplateSet = function(templateSet) {
    templateSet = templateSet || this;
    return templateSet.constructor && templateSet.constructor.name === this.constructor.name &&
        Array.isArray(templateSet.sources) && templateSet.sources.length > 0 ?
        true : false;
};

TemplateSet.prototype.getConditionalSources = function(config) {
    return (typeof this.condition === 'function' && this.condition(config)) || this.condition === true ?
        this.sources : [];
};

module.exports = TemplateSet;
