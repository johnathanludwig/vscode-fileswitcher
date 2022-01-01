# FileSwitcher

FileSwitcher allows you to quickly jump to a file related to the currently opened file. Switch to a test file or back to your code. Easily write your own rules to match any file type based on your own application structure.

### Preview

![FileSwitcher preview](https://raw.githubusercontent.com/johnathanludwig/vscode-fileswitcher/master/images/preview.gif)

## Commands and Keybindings

### Switch File

Opens a matching file in the current editor. If multiple matches are found a select will be displayed.

Default Keybind: `alt + R`

### Switch File in Split Editor

Opens a matching file like "Switch File" but in a split editor.

Default Keybind: `alt + shift + R`

### List generated mappings for current file

Displays the generated file names used for matching for the current file. Useful for debugging mappings.

### Create file from mapping

Will display a list of mappings for the current file that do not exist. When selecting one it will create the file at the given path.

## Configuration

### fileswitcher.mappings

A configurable set of rules for files to match related files. Mappings should be an array of JSON objects. Each object should include a `from` and a `to` key.

The `from` key must be a string that converts to a regex. This regex should match the file you are triggering the "Switch File" command on.

The `to` key should be a string path to the target file to open when "Switch File" is triggered. You may use matches in the regex in the `from` setting by using `:<match number>`.

#### Example

```json
"fileswitcher.mappings": [
  {
    "from": "app/(.+)\\.(.+)",
    "to": "test/:1_test.:2"
  },
  {
    "from": "test/(.+)_test\\.(.+)",
    "to": "app/:1.:2"
  }
]
```

In the example above, triggering switch file on `app/models/user.rb` will match the first mapping, set `:1` to `models/user`, and then open the related file `app/models/user_test.rb`. Triggering again on the test file will then match with the second mapping, and switch back to `app/models/user.rb`.

## Credits

Inspired by [atom-ruby-test-switcher](https://github.com/dcarral/atom-ruby-test-switcher).
