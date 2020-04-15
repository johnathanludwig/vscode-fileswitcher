import * as vscode from "vscode";

function currentFile(): string {
  const currentFile = vscode.window.activeTextEditor;

  if (currentFile === undefined) return;

  const rootPath = vscode.workspace.rootPath;
  const currentFileName = currentFile.document.fileName;

  return currentFileName.replace(rootPath + "/", "");
}

function arrayToGlob(matches): string {
  const glob = "{" + matches.join(",") + "}";

  return glob;
}

function matchFile(filePath: string, mappings): string {
  const matches = [];

  mappings.forEach((mapping) => {
    const regexp = new RegExp(mapping["from"], "i");
    const match = regexp.exec(filePath);

    if (match === null) return;

    let newFilePath = mapping["to"];

    match.forEach((i2) => {
      newFilePath = newFilePath.replace(":" + i2, match[i2]);
    });

    matches.push(newFilePath);
  });

  return arrayToGlob(matches);
}

export default function findFile(): string | undefined {
  const mappings = vscode.workspace
    .getConfiguration()
    .get("fileswitcher.mappings");

  const filePath = currentFile();

  if (filePath === undefined) return;

  return matchFile(filePath, mappings);
}
