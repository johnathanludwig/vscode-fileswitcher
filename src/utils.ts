import * as vscode from "vscode";
import * as fs from "fs";
import { sep } from "path";

export function workspaceRootPath(): string {
  return vscode.workspace.workspaceFolders[0].uri.path + sep;
}

export function stripRootPath(file: string): string {
  return file.replace(workspaceRootPath(), "");
}

export function currentFile(): string {
  const currentFile = vscode.window.activeTextEditor;

  if (currentFile === undefined) return;

  return stripRootPath(currentFile.document.fileName);
}

export function arrayToGlob(matches: string[]): string {
  const glob = "{" + matches.join(",") + "}";

  return glob;
}

export const fileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

export const createFile = (filePath: string): void => {
  const folders = filePath.split(sep);
  folders.pop();
  fs.mkdirSync(folders.join(sep), { recursive: true });

  fs.appendFileSync(filePath, "", "utf-8");
};

export const createFileIfNotExists = (filePath: string): void => {
  if (fileExists(filePath)) {
    return;
  }

  createFile(filePath);
};
