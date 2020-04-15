import * as vscode from "vscode";
import findFile from "./findFile";

function openInCurrentEditor(files): void {
  if (files.length > 0) {
    vscode.window.showTextDocument(files[0]);
  }
}

function openInSplitEditor(files): void {
  if (files.length > 0) {
    if (vscode.window.activeTextEditor.viewColumn === 1) {
      vscode.window.showTextDocument(files[0], vscode.ViewColumn.Two);
    } else {
      vscode.window.showTextDocument(files[0], vscode.ViewColumn.One);
    }
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const switcher = vscode.commands.registerCommand(
    "fileswitcher.switchFile",
    function () {
      const newFilePath = findFile();
      if (newFilePath === undefined) {
        return;
      }
      vscode.workspace.findFiles(newFilePath, "").then(openInCurrentEditor);
    }
  );

  context.subscriptions.push(switcher);

  const switchSplit = vscode.commands.registerCommand(
    "fileswitcher.switchFileSplit",
    function () {
      const newFilePath = findFile();
      if (newFilePath === undefined) {
        return;
      }
      vscode.workspace.findFiles(newFilePath, "").then(openInSplitEditor);
    }
  );

  context.subscriptions.push(switchSplit);
}

export function deactivate(): void {
  // empty intentionally
}
