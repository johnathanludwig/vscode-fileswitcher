import * as vscode from "vscode";

import {
  arrayToGlob,
  currentFile,
  displayStatusBarMessage,
  stripRootPath,
  workspaceRootPath,
} from "./utils";

const REGEX_SYMBOL = ":";

type Mapping = {
  from: string;
  to: string;
};

type Match = {
  path: string;
} & Mapping;

export function generateFilePaths(filePath: string): Match[] {
  const mappings: Mapping[] = vscode.workspace
    .getConfiguration()
    .get("fileswitcher.mappings");

  const matches = [];

  mappings.forEach((mapping) => {
    const regexp = new RegExp(mapping["from"], "i");
    const match = regexp.exec(filePath);

    if (match === null) return;

    let newFilePath = mapping["to"];

    match.forEach((item, index) => {
      newFilePath = newFilePath.replace(
        new RegExp(REGEX_SYMBOL + index, "g"),
        item
      );
    });

    matches.push({ from: mapping.from, to: mapping.to, path: newFilePath });
  });

  return matches;
}

function findMatchingFiles(file: string): Thenable<vscode.Uri[]> {
  const matches = generateFilePaths(file);

  return vscode.workspace.findFiles(
    arrayToGlob(matches.map((match) => match.path)),
    ""
  );
}

async function selectFile(files): Promise<vscode.Uri[]> {
  if (files.length <= 1) return files[0];

  const selected = await vscode.window.showQuickPick(
    files.map((file) => stripRootPath(file.path))
  );

  if (!selected) return;

  const selectedFile = files.find(
    (file) => file.path === workspaceRootPath() + selected
  );

  const file = await selectedFile;
  return file;
}

export async function findFile(): Promise<vscode.Uri[] | undefined> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const files = await findMatchingFiles(filePath);
  const selectedFile = await selectFile(files);

  if (selectedFile) {
    return selectedFile;
  } else {
    displayStatusBarMessage("No matching file found.");
  }
}
