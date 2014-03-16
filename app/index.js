'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var ext_types = ['plugin', 'theme', 'translation'];

var YourlsExtensionGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            var fs = require('fs');
            fs.unlinkSync('.git');
        });
    },

    askFor: function () {
        var done = this.async();

        // have Yeoman greet the user
        this.log(this.yeoman);

        // replace it with a short and sweet description of your generator
        this.log(chalk.magenta('Create a YOURLS extension: plugin, theme or translation.'));

        var prompts = [{
            type: 'list',
            name: 'type',
            message: 'Extension type',
            default: 'plugin',
            choices: ext_types
        },
        {
            name: 'extName',
            message: 'Extension name',
            filter: function (input) {
                var contribRe = /^yourls(-)?|(-)?yourls$/;
                if (contribRe.test(input)) {
                    input = input.replace(contribRe, '');
                }
                return input;
            }
        },
        {
            name: 'extDesc',
            message: 'Extension Description'
        },
        {
            name: 'extUrl',
            message: 'Extension URL'
        },
        {
            name: 'extVersion',
            message: 'Extension version',
            default: '0.1.0',
            validate: function (input) {
                return /^[0-9]\.[0-9](\.[0-9])?$/.test(input);
            }
        },
        {
            name: 'yourlsMinVersion',
            message: 'Minimum YOURLS version',
            default: '2.0.0',
            validate: function (input) {
                return /^[0-9]\.[0-9](\.[0-9])?$/.test(input);
            }
        },
        {
            name: 'license',
            message: 'License',
            default: 'MIT'
        },
        {
            name: 'authorName',
            message: 'Author name',
            default: this.user.username
        },
        {
            name: 'authorUrl',
            message: 'Author URL'
        },
        {
            name: 'language',
            message: 'Language',
            when: function (props) {
                return props.type == ext_types[2];
            }
        }];

        this.prompt(prompts, function (props) {
            this.type = props.type;
            this.extName = props.extName;
            this.extSlugName = this._.slugify(props.extName);
            this.extFullName = 'yourls-' + this.extSlugName;
            this.extDesc = props.extDesc;
            this.extUrl = props.extUrl;
            this.extVersion = props.extVersion;
            this.yourlsMinVersion = props.yourlsMinVersion;
            this.license = props.license;
            this.authorName = props.authorName;
            this.authorUrl = props.authorUrl;
            this.language = props.language;

            done();
        }.bind(this));
    },

    app: function () {
        this.directory(this.type, '.');
    },

});

module.exports = YourlsExtensionGenerator;