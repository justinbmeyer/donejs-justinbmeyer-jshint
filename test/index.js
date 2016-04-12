var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('donejs-<username>-jshint', function() {
  before(function(done) {
    // Run the generator in a temprorary directory
    helpers.run(path.join(__dirname, '../default'))
      .inTmpDir()
      // Mock the user input by setting
      // `indent_style` to `tab`
      .withPrompts({
        'indent_style': 'tab'
      }).on('end', done);
  });

  // Verify that `.jshintrc` got written
  // and has some content
  it('created .jshintrc', function() {
    assert.file(['.jshintrc']);
    assert.fileContent('.jshintrc',
      /"latedef": "nofunc"/);
  });

  // Verify that `.editorconfig` got written
  // with `indent_style` set to our selection
  it('.editorconfig with indent_style', function() {
    assert.file(['.editorconfig']);
    assert.fileContent('.editorconfig',
      /indent_style = tab/);
  });

  // Make sure that `package.json` got updated
  // with the `jshint` npm script
  it('update package.json', function() {
    assert.jsonFileContent('package.json', {
      scripts: {
        jshint: 'jshint src/. --config'
      }
    });
  });
});
