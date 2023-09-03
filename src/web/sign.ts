const oneLineCommentSigns = ['//', '///', '--', '#', ';;']

export function detectStartOfTheComment(input: string): string | null {
  const sign                  = detectCommentSign(input)
  const regexp                = "^(?:\\s*\\n)*([ \\t]*" + sign + "+)"
  const commentStartingRegExp = new RegExp(regexp)
  const result                = commentStartingRegExp.exec(input)
  const start                 = result?.[1] ?? null;

  if (start == null) {
    return null;
  }

  return start + " ";
}

function detectCommentSign(line: string): string {
  for (const sign of oneLineCommentSigns) {
    if (line.trim().startsWith(sign)) {
      return sign
    }
  }

  return ""
}
