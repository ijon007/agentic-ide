export interface ParsedDiffLine {
  content: string;
  lineNumber?: number;
  type: "add" | "remove" | "context";
}

export function parseUnifiedDiff(raw: string): ParsedDiffLine[] {
  const lines = raw.split("\n");
  const result: ParsedDiffLine[] = [];

  for (const line of lines) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      result.push({ type: "add", content: line.slice(1) });
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      result.push({ type: "remove", content: line.slice(1) });
    } else {
      result.push({ type: "context", content: line });
    }
  }

  return result;
}
