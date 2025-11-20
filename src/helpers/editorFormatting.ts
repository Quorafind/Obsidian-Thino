/**
 * Editor formatting helpers for Markdown
 */

export interface FormatResult {
  newText: string;
  selectionStart: number;
  selectionEnd: number;
}

export function applyMarkdownFormat(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: string,
): FormatResult {
  const selectedText = text.substring(selectionStart, selectionEnd);
  const hasSelection = selectionStart !== selectionEnd;

  let before = text.substring(0, selectionStart);
  let after = text.substring(selectionEnd);
  let formatted = '';
  let newSelectionStart = selectionStart;
  let newSelectionEnd = selectionEnd;

  switch (format) {
    case 'bold':
      formatted = `**${selectedText || 'bold text'}**`;
      newSelectionStart = selectionStart + 2;
      newSelectionEnd = hasSelection ? selectionStart + formatted.length - 2 : newSelectionStart + 9;
      break;

    case 'italic':
      formatted = `*${selectedText || 'italic text'}*`;
      newSelectionStart = selectionStart + 1;
      newSelectionEnd = hasSelection ? selectionStart + formatted.length - 1 : newSelectionStart + 11;
      break;

    case 'strikethrough':
      formatted = `~~${selectedText || 'strikethrough text'}~~`;
      newSelectionStart = selectionStart + 2;
      newSelectionEnd = hasSelection ? selectionStart + formatted.length - 2 : newSelectionStart + 18;
      break;

    case 'code':
      formatted = `\`${selectedText || 'code'}\``;
      newSelectionStart = selectionStart + 1;
      newSelectionEnd = hasSelection ? selectionStart + formatted.length - 1 : newSelectionStart + 4;
      break;

    case 'link':
      if (hasSelection) {
        formatted = `[${selectedText}](url)`;
        newSelectionStart = selectionStart + selectedText.length + 3;
        newSelectionEnd = newSelectionStart + 3;
      } else {
        formatted = '[link text](url)';
        newSelectionStart = selectionStart + 1;
        newSelectionEnd = newSelectionStart + 9;
      }
      break;

    case 'heading1':
      // Find the start of the current line
      const lineStart1 = before.lastIndexOf('\n') + 1;
      const lineContent1 = text.substring(lineStart1, after.indexOf('\n', selectionEnd) >= 0 ? after.indexOf('\n', selectionEnd) + selectionEnd : text.length);
      const cleanLine1 = lineContent1.replace(/^#{1,6}\s*/, '');
      before = text.substring(0, lineStart1);
      after = text.substring(lineStart1 + lineContent1.length);
      formatted = `# ${cleanLine1}`;
      newSelectionStart = lineStart1;
      newSelectionEnd = lineStart1 + formatted.length;
      break;

    case 'heading2':
      const lineStart2 = before.lastIndexOf('\n') + 1;
      const lineContent2 = text.substring(lineStart2, after.indexOf('\n', selectionEnd) >= 0 ? after.indexOf('\n', selectionEnd) + selectionEnd : text.length);
      const cleanLine2 = lineContent2.replace(/^#{1,6}\s*/, '');
      before = text.substring(0, lineStart2);
      after = text.substring(lineStart2 + lineContent2.length);
      formatted = `## ${cleanLine2}`;
      newSelectionStart = lineStart2;
      newSelectionEnd = lineStart2 + formatted.length;
      break;

    case 'heading3':
      const lineStart3 = before.lastIndexOf('\n') + 1;
      const lineContent3 = text.substring(lineStart3, after.indexOf('\n', selectionEnd) >= 0 ? after.indexOf('\n', selectionEnd) + selectionEnd : text.length);
      const cleanLine3 = lineContent3.replace(/^#{1,6}\s*/, '');
      before = text.substring(0, lineStart3);
      after = text.substring(lineStart3 + lineContent3.length);
      formatted = `### ${cleanLine3}`;
      newSelectionStart = lineStart3;
      newSelectionEnd = lineStart3 + formatted.length;
      break;

    case 'bulletList':
      if (hasSelection) {
        const lines = selectedText.split('\n');
        formatted = lines.map(line => (line.trim() ? `- ${line.replace(/^[-*]\s*/, '')}` : line)).join('\n');
      } else {
        formatted = `- ${selectedText || 'list item'}`;
        newSelectionStart = selectionStart + 2;
        newSelectionEnd = newSelectionStart + 9;
      }
      break;

    case 'numberList':
      if (hasSelection) {
        const lines = selectedText.split('\n');
        formatted = lines.map((line, index) => (line.trim() ? `${index + 1}. ${line.replace(/^\d+\.\s*/, '')}` : line)).join('\n');
      } else {
        formatted = `1. ${selectedText || 'list item'}`;
        newSelectionStart = selectionStart + 3;
        newSelectionEnd = newSelectionStart + 9;
      }
      break;

    case 'quote':
      if (hasSelection) {
        const lines = selectedText.split('\n');
        formatted = lines.map(line => `> ${line.replace(/^>\s*/, '')}`).join('\n');
      } else {
        formatted = `> ${selectedText || 'quote'}`;
        newSelectionStart = selectionStart + 2;
        newSelectionEnd = newSelectionStart + 5;
      }
      break;

    case 'codeBlock':
      formatted = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
      newSelectionStart = selectionStart + 4;
      newSelectionEnd = hasSelection ? selectionStart + formatted.length - 4 : newSelectionStart + 4;
      break;

    default:
      return { newText: text, selectionStart, selectionEnd };
  }

  const newText = before + formatted + after;
  return {
    newText,
    selectionStart: newSelectionStart,
    selectionEnd: newSelectionEnd,
  };
}
