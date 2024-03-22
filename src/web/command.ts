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

  // Replace the new justified comment with
  // the previous comment
  const startPosition = new vscode.Position(startLineIndex, 0);
  const stopPosition = new vscode.Position(stopLineIndex + 1, 0);
  const range = new vscode.Range(startPosition, stopPosition);
  const edit = new vscode.WorkspaceEdit();

  edit.replace(document.uri, range, justifiedContent);
  vscode.workspace.applyEdit(edit);
}
