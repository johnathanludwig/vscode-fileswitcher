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

export async function findFile(
  onSelect: (file: vscode.Uri) => void
): Promise<void> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const files = await findMatchingFiles(filePath);

  if (files.length === 0) {
    displayStatusBarMessage("No matching file found.");
  } else if (files.length === 1) {
    onSelect(files[0]);
  } else {
    const quickPick = vscode.window.createQuickPick();
    quickPick.title = "Select File";
    quickPick.items = files.map((file) => ({
      label: stripRootPath(file.path),
      path: file.path,
    }));
    quickPick.onDidChangeSelection((selectedFiles) => {
      const file = files.find(
        (file) => file.path === workspaceRootPath() + selectedFiles[0].label
      );
      onSelect(file);
    });
    quickPick.show();
  }
}
