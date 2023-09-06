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
  const lines 			    = new Array<string>()
  const commentStart 	  = detectStartOfTheComment(input[0])
  let   buffer          = ""

  for (const chunk of extractChunks(input)) {
    if (buffer.length + chunk.length > maxLineSize) {
      lines.push(buffer.trimEnd())
      buffer = chunk + " "
    }

    else {
      buffer += chunk + " "
    }
  }

  if (buffer != "") {
    lines.push(buffer);
  }

  return (commentStart + lines.join("\n" + commentStart)).trimEnd();
}
