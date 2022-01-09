import { sep } from "path";

import * as vscode from "vscode";

import { findFile, generateFilePaths } from "./findFile";
import { currentFile } from "./utils";
import {
  createFileIfNotExists,
  displayStatusBarMessage,
  fileExists,
  openFile,
  workspaceRootPath,
} from "./utils";

export async function switchFile(): Promise<void> {
  findFile((file) => openFile(file));
}

export async function switchFileSplit(): Promise<void> {
  findFile((file) => {
    const column =
      vscode.window.activeTextEditor.viewColumn === 1
        ? vscode.ViewColumn.Two
        : vscode.ViewColumn.One;

    openFile(file, column);
  });
}

export async function displayMappings(): Promise<void> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const matches = generateFilePaths(filePath);

  if (matches.length === 0) {
    displayStatusBarMessage(
      'No mappings match current file. Check the "from" of your mappings.'
    );
    return;
  }

  const quickPick = vscode.window.createQuickPick();
  quickPick.title = "Generated Mappings";
  quickPick.items = matches.map((match) => ({
    label: match.path,
    detail: `From ${match.from} — To ${match.to}`,
  }));

  quickPick.show();
}

export async function createTargetFile(): Promise<void> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const matches = generateFilePaths(filePath);

  if (matches.length === 0) {
    displayStatusBarMessage("No mappings match current file.");
    return;
  }

  const items = matches
    .map((match) => {
      if (fileExists(workspaceRootPath() + match.path)) return;
      return {
        label: match.path,
        description: `From ${match.from} — To ${match.to}`,
        value: match.path,
      };
    })
    .filter(Boolean);

  if (items.length === 0) {
    displayStatusBarMessage("All matching files already exist.");
    return;
  }

  const quickPick = vscode.window.createQuickPick();
  quickPick.title = "Create File";
  quickPick.items = items;
  quickPick.onDidChangeSelection((selection) => {
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + sep + selection[0].label);

    createFileIfNotExists(filePath.path);
    quickPick.hide();
    vscode.window.showTextDocument(filePath);
  });

  quickPick.show();
}
