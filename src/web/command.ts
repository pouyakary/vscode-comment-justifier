// Justifier  - A comment justifier extension
// for Visual Studio Code that justifies  the
// size   of   comments  lines  to  under  40
// character for better readability.
//
// (C) 2023-present Pouya Kary <kary@gnu.org>
//
// This  program  is  free  software: you can
// redistribute it and/or modify it under the
// terms of the GNU General Public License as
// published by the Free Software Foundation,
// either  version  3  of the License, or (at
// your option) any later version.
//
// This  program  is  distributed in the hope
// that it will be useful,  but  WITHOUT  ANY
// WARRANTY;  without even the implied warra-
// nty of MERCHANTABILITY or  FITNESS  FOR  A
// PARTICULAR  PURPOSE.  See  the GNU General
// Public License for more details.
//
// You should have received a copy of the GNU
// General Public  License  along  with  this
// program.              If              not,
// see <https://www.gnu.org/licenses/>.

import * as vscode from "vscode";
import { detectStartOfTheComment } from "./sign";
import { justify } from "./justification";

// ─── Check If The Line Is Comment ──────────────────────────────────────── ✣ ─

export function isLineACommentLine(): boolean {
  const editor = vscode.window.activeTextEditor!;
  const currentLine = editor.selection.active.line;
  const document = editor.document;
  const currentLineContent = document.lineAt(currentLine).text;
  const commentSign = detectStartOfTheComment(currentLineContent);

  return commentSign !== null;
}

// ─── Extract Comment ───────────────────────────────────────────────────── ✣ ─

export function justifyCurrentComment() {
  const editor = vscode.window.activeTextEditor!;
  const currentLine = editor.selection.active.line;
  const document = editor.document;

  const currentLineContent = document.lineAt(currentLine).text;
  const blockComment = extractBlockComment(document, currentLine);

  if (blockComment !== null) {
    const { startLineIndex, endLineIndex, bodyLines, startLine, endLine } =
      blockComment;

    const justifiedBody = justify(bodyLines);
    const newBodyLines =
      justifiedBody.length === 0 ? [] : justifiedBody.split("\n");
    const reconstructedBlock = [startLine, ...newBodyLines, endLine];
    const finalText = reconstructedBlock.join("\n") + "\n";

    const startPosition = new vscode.Position(startLineIndex, 0);
    const stopPosition = new vscode.Position(endLineIndex + 1, 0);
    const range = new vscode.Range(startPosition, stopPosition);
    const edit = new vscode.WorkspaceEdit();

    edit.replace(document.uri, range, finalText);
    vscode.workspace.applyEdit(edit);
    return;
  }

  const commentSign = detectStartOfTheComment(currentLineContent);

  if (commentSign === null) {
    vscode.window.showInformationMessage("Not detected as a supported comment");
    return;
  }

  let lines = [currentLineContent];
  let startLineIndex = currentLine - 1;
  let stopLineIndex = currentLine + 1;

  // Get lines below
  while (startLineIndex >= 0) {
    const lineContent = document.lineAt(startLineIndex).text;

    if (lineContent.startsWith(commentSign)) {
      lines = [lineContent, ...lines];
      startLineIndex--;
    } else {
      break;
    }
  }
  startLineIndex++;

  // Get lines above
  while (stopLineIndex < document.lineCount) {
    const lineContent = document.lineAt(stopLineIndex).text;

    if (lineContent.startsWith(commentSign)) {
      lines.push(lineContent);
      stopLineIndex++;
    } else {
      break;
    }
  }
  stopLineIndex--;

  // Justified content
  const justifiedContent = justify(lines) + "\n";

  // Replace the new justified comment with the
  // previous comment
  const startPosition = new vscode.Position(startLineIndex, 0);
  const stopPosition = new vscode.Position(stopLineIndex + 1, 0);
  const range = new vscode.Range(startPosition, stopPosition);
  const edit = new vscode.WorkspaceEdit();

  edit.replace(document.uri, range, justifiedContent);
  vscode.workspace.applyEdit(edit);
}

type ExtractedBlockComment = {
  startLineIndex: number;
  endLineIndex: number;
  startLine: string;
  endLine: string;
  bodyLines: string[];
};

function extractBlockComment(
  document: vscode.TextDocument,
  anchorLine: number,
): ExtractedBlockComment | null {
  const anchorText = document.lineAt(anchorLine).text;

  if (!isBlockCommentCandidate(anchorText)) {
    return null;
  }

  const startLineIndex = findBlockCommentStart(document, anchorLine);

  if (startLineIndex === null) {
    return null;
  }

  const startLineText = document.lineAt(startLineIndex).text;

  if (isSingleLineBlockComment(startLineText)) {
    return null;
  }

  const endLineIndex = findBlockCommentEnd(document, startLineIndex);

  if (endLineIndex === null || endLineIndex === startLineIndex) {
    return null;
  }

  const bodyLines = [];

  for (let line = startLineIndex + 1; line < endLineIndex; line++) {
    bodyLines.push(document.lineAt(line).text);
  }

  if (bodyLines.length === 0) {
    return null;
  }

  const bodyHasOnlyStarPrefix = bodyLines.every((line) =>
    line.trim().startsWith("*"),
  );

  if (!bodyHasOnlyStarPrefix) {
    return null;
  }

  return {
    startLineIndex,
    endLineIndex,
    startLine: startLineText,
    endLine: document.lineAt(endLineIndex).text,
    bodyLines,
  };
}

function isBlockCommentCandidate(text: string): boolean {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return false;
  }

  return (
    trimmed.startsWith("/**") ||
    (trimmed.startsWith("/*") && !trimmed.startsWith("//")) ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("*/")
  );
}

function findBlockCommentStart(
  document: vscode.TextDocument,
  fromLine: number,
): number | null {
  for (let line = fromLine; line >= 0; line--) {
    const text = document.lineAt(line).text;

    if (
      line !== fromLine &&
      containsCommentEnd(text) &&
      !containsBlockStart(text)
    ) {
      return null;
    }

    if (containsBlockStart(text)) {
      return line;
    }
  }

  return null;
}

function findBlockCommentEnd(
  document: vscode.TextDocument,
  fromLine: number,
): number | null {
  for (let line = fromLine; line < document.lineCount; line++) {
    const text = document.lineAt(line).text;

    if (containsCommentEnd(text)) {
      return line;
    }
  }

  return null;
}

function containsBlockStart(text: string): boolean {
  return text.indexOf("/*") !== -1;
}

function containsCommentEnd(text: string): boolean {
  return text.indexOf("*/") !== -1;
}

function isSingleLineBlockComment(text: string): boolean {
  const start = text.indexOf("/*");

  if (start === -1) {
    return false;
  }

  const end = text.indexOf("*/", start + 2);
  return end !== -1;
}
