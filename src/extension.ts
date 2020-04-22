import * as vscode from "vscode";
import findFile from "./findFile";

function openFile(file, column = vscode.ViewColumn.Active): void {
  if (file === undefined) return;

  vscode.window.showTextDocument(file, column);
}

export function activate(context: vscode.ExtensionContext): void {
  const switcher = vscode.commands.registerCommand(
    "fileswitcher.switchFile",
    async function () {
      const file = await findFile();

      openFile(file);
    }
  );

  context.subscriptions.push(switcher);

  const switchSplit = vscode.commands.registerCommand(
    "fileswitcher.switchFileSplit",
    async function () {
      const file = await findFile();
      const column =
        vscode.window.activeTextEditor.viewColumn === 1
          ? vscode.ViewColumn.Two
          : vscode.ViewColumn.One;

      openFile(file, column);
    }
  );

  context.subscriptions.push(switchSplit);
}

export function deactivate(): void {
  // intentionally empty
}
