import * as vscode from "vscode";
import {
  switchFile,
  switchFileSplit,
  createTargetFile,
  displayMappings,
} from "./api";

export function activate(context: vscode.ExtensionContext): void {
  const switcher = vscode.commands.registerCommand(
    "fileswitcher.switchFile",
    switchFile
  );

  context.subscriptions.push(switcher);

  const switchSplit = vscode.commands.registerCommand(
    "fileswitcher.switchFileSplit",
    switchFileSplit
  );

  context.subscriptions.push(switchSplit);

  const listMappings = vscode.commands.registerCommand(
    "fileswitcher.listMappings",
    displayMappings
  );

  context.subscriptions.push(listMappings);

  const createFileCommand = vscode.commands.registerCommand(
    "fileswitcher.createFile",
    createTargetFile
  );

  context.subscriptions.push(createFileCommand);
}

export function deactivate(): void {
  // intentionally empty
}
