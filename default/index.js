var generator = require('yeoman-generator');
var _ = require('lodash');

module.exports = generator.Base.extend({
  initializing: function () {
    // Read the original package.json
    this.pkg = this.fs.readJSON(
      this.destinationPath('package.json'), {}
    );

    // Maintain a list of all files we want to copy over
    this.files = [
      '.editorconfig',
      '.jshintrc'
    ];
  },

  prompting: function () {
    var done = this.async();

    // Create a prompt setting the `indent_style` property
    // to `tab` or `space`
    this.prompt([{
      type: 'list',
      name: 'indent_style',
      message: 'What indentation style do you want to use?',
      default: 'tab',
      choices: [
        {
          name: 'Tabs',
          value: 'tab'
        },
        {
          name: 'Spaces',
          value: 'space'
        }
      ]
    }], function (answers) {
      this.props = answers;
      done();
    }.bind(this));
  },

  writing: function () {
    var pkg = this.pkg;

    // Update `package.json` with the `jshint` command
    // and update the `test` script
    pkg.scripts = _.extend(pkg.scripts, {
      test: 'npm run jshint && ' +
        _.get(pkg, 'scripts.test',
          'echo "No tests specified"'),
      jshint: 'jshint ' +
        _.get(pkg, 'system.directories.lib',
          'src') +
        '/. --config'
    });

    // Write to `package.json`
    // This will prompt you to overwrite
    this.fs.writeJSON('package.json', pkg);
    // Install jshint as a development dependency
    this.npmInstall([ 'jshint' ], { saveDev: true});

    // Got through every file and copy it
    this.files.forEach(function(file) {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.props
      );
    }.bind(this));
  }
});
