export function getTextBeforeCursor(container: Node): string {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";
  const range = sel.getRangeAt(0);
  const pre = document.createRange();
  pre.setStart(container, 0);
  pre.setEnd(range.startContainer, range.startOffset);
  return pre.toString();
}

export function getRangeForCharacterOffset(
  container: Node,
  startOffset: number,
  endOffset: number
): Range | null {
  const range = document.createRange();
  let currentOffset = 0;
  let found = false;

  function walk(node: Node): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node.textContent ?? "").length;
      if (currentOffset + len >= startOffset && currentOffset <= endOffset) {
        const s = Math.max(0, startOffset - currentOffset);
        const e = Math.min(len, endOffset - currentOffset);
        range.setStart(node, s);
        range.setEnd(node, e);
        found = true;
        return true;
      }
      currentOffset += len;
      return false;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.getAttribute("contenteditable") === "false") {
        const len = (el.textContent ?? "").length;
        if (currentOffset + len >= startOffset && currentOffset <= endOffset) {
          range.setStartBefore(node);
          range.setEndAfter(node);
          found = true;
          return true;
        }
        currentOffset += len;
        return false;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      if (walk(node.childNodes[i])) return true;
    }
    return false;
  }

  walk(container);
  return found ? range : null;
}

export function getContentForSubmit(container: Node): { text: string; refIds: string[] } {
  let text = "";
  const refIds: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? "";
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const id = el.getAttribute("data-attachment-id");
      if (id) {
        refIds.push(id);
        text += " ";
        return;
      }
    }
    node.childNodes.forEach(walk);
  }

  walk(container);
  return { text: text.trim().replace(/\s+/g, " "), refIds };
}
