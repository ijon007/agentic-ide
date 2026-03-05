export interface ParsedDiffLine {
  content: string;
  lineNumber?: number;
  type: "add" | "remove" | "context";
  /** Set when this is a hunk header @@ -x,y +a,b @@ */
  hunkStart?: { oldStart: number; newStart: number };
}

export interface SideBySideLine {
  oldLineNum: number | null;
  newLineNum: number | null;
  oldContent: string;
  newContent: string;
  type: "add" | "remove" | "context";
}

export function parseUnifiedDiff(raw: string): ParsedDiffLine[] {
  const lines = raw.split("\n");
  const result: ParsedDiffLine[] = [];
  let oldLineNum = 0;
  let newLineNum = 0;

  for (const line of lines) {
    const hunkMatch = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    if (hunkMatch) {
      const oldStart = Number.parseInt(hunkMatch[1], 10);
      const newStart = Number.parseInt(hunkMatch[3], 10);
      oldLineNum = oldStart;
      newLineNum = newStart;
      result.push({
        type: "context",
        content: line,
        hunkStart: { oldStart, newStart },
      });
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      result.push({
        type: "add",
        content: line.slice(1),
        lineNumber: newLineNum,
      });
      newLineNum++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      result.push({
        type: "remove",
        content: line.slice(1),
        lineNumber: oldLineNum,
      });
      oldLineNum++;
    } else {
      result.push({
        type: "context",
        content: line,
        lineNumber: oldLineNum,
      });
      oldLineNum++;
      newLineNum++;
    }
  }

  return result;
}

export function getDiffStats(parsed: ParsedDiffLine[]): { adds: number; removes: number } {
  let adds = 0;
  let removes = 0;
  for (const line of parsed) {
    if (line.type === "add") adds++;
    else if (line.type === "remove") removes++;
  }
  return { adds, removes };
}

export function toSideBySideLines(parsed: ParsedDiffLine[]): SideBySideLine[] {
  const result: SideBySideLine[] = [];
  let oldNum = 0;
  let newNum = 0;

  for (const line of parsed) {
    if (line.hunkStart) {
      oldNum = line.hunkStart.oldStart - 1;
      newNum = line.hunkStart.newStart - 1;
      continue;
    }
    const { content, type } = line;

    if (type === "add") {
      newNum++;
      result.push({
        oldLineNum: null,
        newLineNum: newNum,
        oldContent: "",
        newContent: content,
        type: "add",
      });
    } else if (type === "remove") {
      oldNum++;
      result.push({
        oldLineNum: oldNum,
        newLineNum: null,
        oldContent: content,
        newContent: "",
        type: "remove",
      });
    } else {
      oldNum++;
      newNum++;
      result.push({
        oldLineNum: oldNum,
        newLineNum: newNum,
        oldContent: content,
        newContent: content,
        type: "context",
      });
    }
  }

  return result;
}
