import { findFile, generateFilePaths } from "./findFile";
import { currentFile } from "./utils";
import * as vscode from "vscode";
import { createFileIfNotExists, fileExists, workspaceRootPath } from "./utils";
import { sep } from "path";

function openFile(file, column = vscode.ViewColumn.Active): void {
  if (file === undefined) return;

  vscode.window.showTextDocument(file, column);
}

export async function switchFile(): Promise<void> {
  const file = await findFile();

  openFile(file);
}

export async function switchFileSplit(): Promise<void> {
  const file = await findFile();
  const column =
    vscode.window.activeTextEditor.viewColumn === 1
      ? vscode.ViewColumn.Two
      : vscode.ViewColumn.One;

  openFile(file, column);
}

export async function displayMappings(): Promise<void> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const matches = generateFilePaths(filePath);

  const quickPick = vscode.window.createQuickPick();
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

  const quickPick = vscode.window.createQuickPick();
  quickPick.items = matches
    .map((match) => {
      if (fileExists(workspaceRootPath() + match.path)) return;
      return {
        label: match.path,
        detail: `From ${match.from} — To ${match.to}`,
        value: match.path,
      };
    })
    .filter(Boolean);
  quickPick.onDidChangeSelection((selection) => {
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const filePath = vscode.Uri.file(wsPath + sep + selection[0].label);

    createFileIfNotExists(filePath.path);
    quickPick.hide();
    vscode.window.showTextDocument(filePath);
  });

  quickPick.show();
}
