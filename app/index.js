'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var extTypes = ['Plugin', 'Theme', 'Translation'];

var extractGeneratorName = function (_, appname) {
  var slugged = _.slugify(appname);
  var match = slugged.match(/^yourls-(.+)/);

  if (match && match.length === 2) {
    return match[1].toLowerCase();
  }

  return slugged;
};

var YourlsExtensionGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (fs.lstatSync('.git').isFile()) {
        fs.unlinkSync('.git');
      }
    });
  },

  askFor: function () {
    var done = this.async();
    var extensionName = extractGeneratorName(this._, this.appname);

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.cyan('Create YOURLS extensions: plugin, theme and translation.'));
    this.log('For more information about YOURLS extensions best practices,' +
        '\nplease see the docs at http://yourls.org/extensions.\n');

    var prompts = [{
      type: 'list',
      name: 'type',
      message: 'Extension category',
      default: extTypes[0],
      choices: extTypes
    },
    {
      name: 'name',
      message: 'Extension Name',
      default: extensionName,
      filter: function (input) {
        return input.replace(/^yourls[\-_]?/, '').replace(/[\-_]?yourls$/, '');
      }
    },
    {
      name: 'description',
      message: 'Extension Description',
      default: 'The best YOURLS plugin ever.'
    },
    {
      name: 'version',
      message: 'Extension version',
      default: '0.0.1',
      validate: function (input) {
        return /^[0-9]\.[0-9](\.[0-9])?$/.test(input);
      }
    },
    {
      name: 'homepage',
      message: 'Project homepage'
    },
    {
      name: 'repository',
      message: 'Project git repository'
    },
    {
      name: 'license',
      message: 'License',
      default: 'MIT'
    },
    {
      name: 'authorName',
      message: 'Author name',
      default: this.user.git.username,
      validate: function (input) {
        return input ? true : false;
      }
    },
    {
      name: 'authorEmail',
      message: 'Author email',
      default: this.user.git.email
    },
    {
      name: 'authorUrl',
      message: 'Author URL'
    },
    {
      name: 'yourlsVersion',
      message: 'What version of YOURLS does it need?',
      default: '2.0.0',
      validate: function (input) {
        return /^[0-9]\.[0-9](\.[0-9])?$/.test(input);
      }
    },
    {
      name: 'language',
      message: 'Language (eg: en_US)',
      validate: function (input) {
        return /^[a-z][a-z]_[A-Z][A-Z]$/.test(input);
      },
      when: function (props) {
        return props.type === extTypes[2];
      }
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      this.extName = props.name;
      this.extSlugName = this._.slugify(props.name);
      this.extFullName = 'yourls-' + this.extSlugName;
      this.extDesc = props.description;
      this.extVersion = props.version;
      if (props.homepage) {
        this.extUrl = props.homepage;
      } else {
        this.extUrl = props.repository;
      }
      this.extRepo = props.repository;
      this.license = props.license;
      this.authorName = props.authorName;
      this.authorEmail = props.authorEmail;
      this.authorUrl = props.authorUrl;
      this.yourlsMinVersion = props.yourlsVersion;
      this.language = props.language;

      done();
    }.bind(this));
  },

  app: function () {
    this.directory(this.type.toLowerCase(), '.');
  },

  licenseFile: function () {
    if (fs.existsSync(__dirname + '/templates/licenses/LICENSE-' + this.license.toUpperCase())) {
      var today = new Date();
      this.currentYear = today.getFullYear();
      this.template('licenses/LICENSE-' + this.license.toUpperCase(), 'LICENSE');
    }
  },

  packageFile: function () {
    if (this.type === extTypes[2]) {
      return;
    }

    var pkgFile = {
      name: this._.slugify(this.authorName) + '/' + this.extFullName,
      description: this.extDesc,
      keywords: [
        'yourlsextension',
        this.type.toLowerCase()
      ],
      license: this.license,
      authors: [
          {
            name: this.authorName
          }
      ]
    };

    if (this.extUrl) {
      pkgFile.homepage = this.extUrl;
    }

    if (this.authorUrl) {
      pkgFile.authors[0].url = this.authorUrl;
    }
    if (this.authorEmail) {
      pkgFile.authors[0].email = this.authorEmail;
    }

    this.writeFileFromString(JSON.stringify(pkgFile, null, 2), 'composer.json');
  }

});

module.exports = YourlsExtensionGenerator;
