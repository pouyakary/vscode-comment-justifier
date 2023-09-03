import { detectStartOfTheComment } from "./sign"

const maxLineSize = 40;

function* extractChunks(lines: string[]): Generator<string> {
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

export function justify(input: string[]): string {
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

  const result = commentStart + lines.join("\n" + commentStart);
  console.log(result);
  return result;
}