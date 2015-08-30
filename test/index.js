'use strict';

var assert = require('assert'),
    pkgJson = require('../package.json'),
    pkgName = pkgJson.name,
    pkg = require('../index.js');

var Config = pkg.Config,
    Option = pkg.Option;

describe(pkgName + '.Option', function() {

    it('bla', function() {
        var config = new Config();
        assert.equal(config, true);
    });

});

describe(pkgName + '.Config', function() {

    it('bla', function() {
        var config = new Config();
            option = new Option({}, config);
        assert.equal(config, true);
    });

});
