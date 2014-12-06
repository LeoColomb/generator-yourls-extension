'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs');
var extTypes = ['Plugin', 'Theme', 'Translation'];
var licenses = [
  {
    name: 'No License', value: false
  }, {
    name: 'Apache License 2.0', value: 'APACHE-2.0'
  }, {
    name: 'GNU General Public Licensem version 2,0 (GPLv2)', value: 'GPL-2.0'
  }, {
    name: 'GNU General Public License, version 3.0 (GPLv3)', value: 'GPL-3.0'
  }, {
    name: 'MIT license', value: 'MIT'
  }, {
    name: 'Artistic License 2.0', value: 'ARTISTIC-2.0'
  }, {
    name: 'BSD 2-Clause "Simplified" or "FreeBSD" license', value: 'BSD-2-Clause'
  }, {
    name: 'BSD 3-Clause "New" or "Revised" license', value: 'BSD-3-Clause'
  }, {
    name: 'Eclipse Public License', value: 'EPL-1.0'
  }, {
    name: 'GNU Lesser General Public License, version 2.1 (LGPL-2.1)', value: 'LGPL-2.1'
  }, {
    name: 'GNU Lesser General Public License, version 3.0 (LGPL-3.0)', value: 'LGPL-3.0'
  }, {
    name: 'Mozilla Public License 2.0', value: 'MPL-2.0'
  }, {
    name: 'The Unlicense', value: 'UNLICENSE'
  }, {
    name: 'Public Domain Dedication', value: 'CC0-1.0'
  }, {
    name: 'Other...', value: false
  }
];

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
      type: 'list',
      name: 'license',
      message: 'License',
      default: 'MIT',
      choices: licenses
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
    },
    {
      type: 'confirm',
      name: 'composer',
      message: 'Manage the extension with Composer?',
      default: true,
      when: function (props) {
        return props.type !== extTypes[2];
      }
    }];

    this.prompt(prompts, function (props) {
      this.type = props.type;
      this.extName = this._.humanize(props.name);
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
      this.composer = props.composer;

      done();
    }.bind(this));
  },

  app: function () {
    this.directory(this.type.toLowerCase(), '.');
    this.template('_README.md', 'README.md');
    this.copy('editorconfig', '.editorconfig');
    this.copy('gitattributes', '.gitattributes');
    this.copy('gitignore', '.gitignore');
  },

  licenseFile: function () {
    if (this.license && fs.existsSync(__dirname + '/templates/licenses/' + this.license)) {
      var today = new Date();
      this.currentYear = today.getFullYear();
      this.template('licenses/' + this.license, 'LICENSE');
    }
  },

  packageFile: function () {
    if (this.type === extTypes[2] || !this.composer) {
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
