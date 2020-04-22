import * as vscode from "vscode";
import findFile from "./findFile";

function openInCurrentEditor(file): void {
  // if (files.length === 0) return;

  vscode.window.showTextDocument(file);
}

function openInSplitEditor(file): void {
  if (vscode.window.activeTextEditor.viewColumn === 1) {
    vscode.window.showTextDocument(file, vscode.ViewColumn.Two);
  } else {
    vscode.window.showTextDocument(file, vscode.ViewColumn.One);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const switcher = vscode.commands.registerCommand(
    "fileswitcher.switchFile",
    async function () {
      const newFilePath = await findFile();

      console.log("newFilePath", newFilePath);
      if (newFilePath === undefined) return;

      openInCurrentEditor(newFilePath);
    }
  );

  context.subscriptions.push(switcher);

  const switchSplit = vscode.commands.registerCommand(
    "fileswitcher.switchFileSplit",
    async function () {
      const newFilePath = await findFile();

      console.log("newFilePath", newFilePath);
      if (newFilePath === undefined) return;

      openInSplitEditor(newFilePath);
    }
  );

  context.subscriptions.push(switchSplit);
}

export function deactivate(): void {
  // intentionally empty
}
