# FileSwitcher

FileSwitcher allows you to quickly jump to a file related to the currently opened file. Switch to a test file or back to your code. Easily write your own rules to match any file type based on your own application structure.

### Preview

![FileSwitcher preview](https://raw.githubusercontent.com/johnathanludwig/vscode-fileswitcher/master/images/preview.gif)

## Commands and Keybindings

Command         | Default Binding | Description
---                           | --- | ---
FileSwitcher: Switch File | alt + R | Open first matched file in current editor
FileSwitcher: Switch File in Split Editor | alt + shift + R | Open first matched file in a split editor

## Configuration

### fileswitcher.mappings

A configurable set of rules for files to match related files. Mappings should be an array of JSON objects. Each object should include a `from` and a `to` key.

#### Example

```json
"fileswitcher.mappings": [
  {
    "from": "app/(.+).rb",
    "to": "test/:1_test.rb"
  },
  {
    "from": "test/(.+)_test.rb",
    "to": "app/:1.rb"
  }
]
```

The `from` key must be a string that converts to a regex. This regex should match the file you are triggering the "Switch File" command on.

The `to` key should be a string path to the target file to open when "Switch File" is triggered. You may use matches in the regex in the `from` setting by using `:<match number>`.

In the example above, triggering switch file on `app/models/user.rb` will match the first mapping, set `:1` to `models/user`, and then open the related file `app/models/user_test.rb`. Triggering again on the test file will then match with the second mapping, and switch back to `app/models/user.rb`.

## Credits

Inspired by [atom-ruby-test-switcher](https://github.com/dcarral/atom-ruby-test-switcher).
