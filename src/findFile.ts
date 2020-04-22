import * as vscode from "vscode";

const REGEX_SYMBOL = ":";

function stripRootPath(file: string): string {
  const rootPath = vscode.workspace.rootPath;

  return file.replace(rootPath + "/", "");
}

function currentFile(): string {
  const currentFile = vscode.window.activeTextEditor;

  if (currentFile === undefined) return;

  return stripRootPath(currentFile.document.fileName);
}

function arrayToGlob(matches): string {
  const glob = "{" + matches.join(",") + "}";

  return glob;
}

type Mapping = {
  from: string;
  to: string;
};

function generateFilePaths(filePath: string): string {
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
      newFilePath = newFilePath.replace(REGEX_SYMBOL + index, item);
    });

    matches.push(newFilePath);
  });

  return arrayToGlob(matches);
}

function findMatchingFiles(file: string): Thenable<vscode.Uri[]> {
  const matches = generateFilePaths(file);

  return vscode.workspace.findFiles(matches, "");
}

async function selectFile(files): Promise<vscode.Uri[]> {
  if (files.length <= 1) return files[0];

  const selected = await vscode.window.showQuickPick(files.map((f) => f.path));

  if (!selected) return;

  return files.find((f) => f.path === selected);
}

export default async function findFile(): Promise<vscode.Uri[] | undefined> {
  const filePath = currentFile();
  if (filePath === undefined) return;

  const files = await findMatchingFiles(filePath);
  const selectedFile = selectFile(files);

  return selectedFile;
}
