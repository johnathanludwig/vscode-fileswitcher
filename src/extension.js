// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var switcher = vscode.commands.registerCommand('fileswitcher.switchFile', function () {
        var newFilePath = findFile();
        if (newFilePath == null) {
            return;
        }
        vscode.workspace.findFiles(newFilePath, '').then(openInCurrentEditor);
    });

    context.subscriptions.push(switcher);

    switcher = vscode.commands.registerCommand('fileswitcher.switchFileSplit', function () {
        var newFilePath = findFile();
        if (newFilePath == null) {
            return;
        }
        vscode.workspace.findFiles(newFilePath, '').then(openInSplitEditor);
    });

    context.subscriptions.push(switcher);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;

function openInCurrentEditor(files) {
    if (files.length > 0) {
        vscode.window.showTextDocument(files[0]);
    }
}

function openInSplitEditor(files) {
    if (files.length > 0) {
        if (vscode.window.activeTextEditor.viewColumn == 1) {
            vscode.window.showTextDocument(files[0], vscode.ViewColumn.Two);
        } else {
            vscode.window.showTextDocument(files[0], vscode.ViewColumn.One);
        }
    }
}

function findFile() {
    const mappings = vscode.workspace.getConfiguration().get('fileswitcher.mappings');
    var filePath = currentFile();
    if (filePath == null) {
        return;
    }
    return matchFile(filePath, mappings);
}

function currentFile() {
    var currentFile = vscode.window.activeTextEditor;
    if (currentFile == null) {
        return;
    }
    var currentFileName = currentFile.document.fileName;
    var rootPath = vscode.workspace.rootPath;
    currentFileName = currentFileName.replace(rootPath + '/', '');
    return currentFileName;
}

function matchFile(filePath, mappings) {
    var matches = []

    for(var i in mappings) {
        var regexp = new RegExp(mappings[i]['from'], 'i');
        var match = regexp.exec(filePath);

        if (match != null) {
            var newFilePath = mappings[i]['to']

            for (var i2 in match) {
                newFilePath = newFilePath.replace(":" + i2, match[i2]);
            }

            matches.push(newFilePath);
        }
    }

    return arrayToGlob(matches);
}

function arrayToGlob(array) {
    var glob = "{" + array.join(',') + "}"
    return glob;
}
