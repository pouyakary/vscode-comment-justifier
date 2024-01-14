// Justifier - A comment justifier
// extension for Visual Studio Code that
// justifies the size of comments lines to
// under 40 character for better
// readability.
//
// (C) 2023-present Pouya Kary
// <kary@gnu.org>
//
// This program is free software: you can
// redistribute it and/or modify it under
// the terms of the GNU General Public
// License as published by the Free
// Software Foundation, either version 3 of
// the License, or (at your option) any
// later version.
//
// This program is distributed in the hope
// that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.
//
// You should have received a copy of the
// GNU General Public License along with
// this program. If not, see
// <https://www.gnu.org/licenses/>.

import { detectStartOfTheComment } from "./sign"

// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

const maxLineSize = 40;

// ─── Gets The Words Of The Comment ─────────────────────────────────────── ✣ ─

function*
extractChunks(lines: string[]): Generator<string> {
  for (const index in lines) {
    var line = lines[index]
    var line = line.replace(/^\s*\/+/, "")

    for (const chunk of line.split(/\s+/)) {
      if (chunk != '') {
        yield chunk
      }
    }
  }
}

// ─── Justifies A Given Comment ─────────────────────────────────────────── ✣ ─

export function
justify(input: string[]): string {
  const lines 			    = new Array<Array<string>>()
  const commentStart 	  = detectStartOfTheComment(input[0])
  let   buffer          = new Array<string>();
  const bufferLength    = (): number => buffer.join(' ').length;

  // Justifiying with basic logic
  for (const chunk of extractChunks(input)) {
    if (bufferLength() + 1 + chunk.length > maxLineSize) {
      lines.push(buffer)
      buffer = new Array<string>();
    }
    buffer.push(chunk);
  }

  if (buffer.length > 0) {
    lines.push(buffer);
  }

  // handling the orphan word case.
  let lastLine = lines[lines.length - 1];

  if (lastLine.length == 1 && lines.length > 1) {
    const lineToTheEnd = lines[lines.length - 2];

    if (lineToTheEnd.length > 1) {
      lines[lines.length - 1] = [lineToTheEnd.pop()!, ...lastLine];
    }
  }

  // stringified lines
  const stringifiedLines = insertSpaces(lines);
  return (commentStart + stringifiedLines.join("\n" + commentStart)).trimEnd();
}

// ─── Insert Spaces ─────────────────────────────────────────────────────── ✣ ─

function insertSpaces(lines: string[][]): string[] {
  const resultLines = new Array<string>();

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const words = lines[lineIndex];

    if (lineIndex === lines.length - 1) {
      resultLines.push(words.join(' '));
      continue;
    }

    const spacesNeeded = words.length - 1;
    const spaces = new Array<string>();
    for (let j = 0; j < spacesNeeded; j++) {
      spaces.push('');
    }

    const lineLengthWithoutSpaces = words.join('').length;
    const emptySpaceSize = maxLineSize - lineLengthWithoutSpaces;

    if (emptySpaceSize > 15) {
      resultLines.push(words.join(' '));
      continue;
    }

    let insertedSpaces = 0;
    let counter = 0;

    while(insertedSpaces < emptySpaceSize) {
      spaces[counter++ % spacesNeeded] += ' ';
      insertedSpaces++;
    }

    let result = '';

    // We use this method here to as much as
    // possible avoid rivers.
    for (let j = 0; j < words.length - 1; j++) {
      let spaceIndex = lineIndex % 2 === 0 ? j : spacesNeeded - j - 1;
      result += words[j] + spaces[spaceIndex];
    }
    result += words[words.length - 1];

    resultLines.push(result);
  }

  return resultLines;
}
