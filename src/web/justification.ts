// Justifier  - A comment justifier extens-
// ion for Visual Studio Code that  justif-
// ies  the size of comments lines to under
// 40 character for better readability.
//
// (C) 2023-present Pouya Kary
// <kary@gnu.org>
//
// This  program  is free software: you can
// redistribute it and/or modify  it  under
// the  terms of the GNU General Public Li-
// cense as published by  the  Free  Softw-
// are  Foundation, either version 3 of the
// License,  or  (at   your   option)   any
// later version.
//
// This  program is distributed in the hope
// that it will be useful, but WITHOUT  ANY
// WARRANTY;  without even the implied war-
// ranty of MERCHANTABILITY or FITNESS  FOR
// A  PARTICULAR PURPOSE. See the GNU Gene-
// ral Public License for more details.
//
// You  should  have received a copy of the
// GNU General Public  License  along  with
// this program. If not,
// see <https://www.gnu.org/licenses/>.

import { detectStartOfTheComment } from "./sign";

// ─── Constants ─────────────────────────────────────────────────────────── ✣ ─

const maxLineSize = 42; // because!
const emDash = "-";

// ─── Gets The Words Of The Comment ─────────────────────────────────────── ✣ ─

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // $& means the whole matched string
}

function extractChunksStack(lines: string[], commentSign: string): string[] {
  const chunks = new Array<string>();
  const regExp = new RegExp(`^\\s*${escapeRegExp(commentSign)}`);

  let cachedSplittedWord = "";

  for (const index in lines) {
    var line = lines[index];
    var line = line.replace(regExp, "");
    const lineParts = line.split(/\s+/);

    for (let i = 0; i < lineParts.length; i++) {
      const chunk = lineParts[i];

      if (i === lineParts.length - 1 && chunk.endsWith(emDash)) {
        cachedSplittedWord = chunk.substring(0, chunk.length - 1);
        continue;
      }

      if (chunk != "") {
        chunks.push(cachedSplittedWord + chunk);
        cachedSplittedWord = "";
      }
    }
  }

  return chunks.reverse();
}

// ─── Justifies A Given Comment ─────────────────────────────────────────── ✣ ─

function splitChunkInHalf(
  chunk: string,
  availableSpace: number,
): [string, string] {
  // one  char for the space to be before the
  // chunk and one for the hyphen after it.
  const availableSpaceForChunk = availableSpace - 2;

  // trying to at least preserve 3 characters
  // of the word
  const headSize = Math.min(availableSpaceForChunk, chunk.length - 3);

  var firstHalf = chunk.substring(0, headSize);
  var secondHalf = chunk.substring(headSize);
  return [firstHalf, secondHalf];
}

export function justify(input: string[]): string {
  const lines = new Array<Array<string>>();
  const commentStart = detectStartOfTheComment(input[0]) ?? "";
  let buffer = new Array<string>();
  const bufferLength = (): number => buffer.join(" ").length;
  const chunksReverse = extractChunksStack(input, commentStart);

  // Justifying with basic logic
  while (chunksReverse.length > 0) {
    const chunk = chunksReverse.pop()!;
    const lineSizeWithChunkAdded = bufferLength() + 1 + chunk.length;

    let splittedAChunk = false;

    if (lineSizeWithChunkAdded > maxLineSize) {
      const emptySize = maxLineSize - lineSizeWithChunkAdded + chunk.length;
      const emptyFactor = emptySize / buffer.length;
      const shouldSplitChunk =
        chunksReverse.length > 3 &&
        chunk.length >= 6 &&
        emptySize >= 4 &&
        emptyFactor > 0.75; // this one is a magic number

      if (shouldSplitChunk) {
        splittedAChunk = true;
        const [head, tail] = splitChunkInHalf(chunk, emptySize);
        chunksReverse.push(tail);
        buffer.push(`${head}${emDash}`);
      }

      lines.push(buffer);
      buffer = new Array<string>();
    }

    if (splittedAChunk === false) {
      buffer.push(chunk);
    }
  }

  if (buffer.length > 0) {
    lines.push(buffer);
  }

  // handling the orphan case
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
    const spacesNeeded = words.length - 1;

    if (lineIndex === lines.length - 1 || spacesNeeded >= 10) {
      resultLines.push(words.join(" "));
      continue;
    }

    const spaces = new Array<string>();
    for (let j = 0; j < spacesNeeded; j++) {
      spaces.push("");
    }

    const lineLengthWithoutSpaces = words.join("").length;
    const emptySpaceSize = maxLineSize - lineLengthWithoutSpaces;

    if (lineIndex == lines.length - 1) {
      resultLines.push(words.join(" "));
      continue;
    }

    let insertedSpaces = 0;
    let counter = 0;

    while (insertedSpaces < emptySpaceSize) {
      spaces[counter++ % spacesNeeded] += " ";
      insertedSpaces++;
    }

    let result = "";

    // We  use  this  method here to as much as
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
