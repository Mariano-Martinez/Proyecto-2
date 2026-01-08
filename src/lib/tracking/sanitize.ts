const decodeEntities = (input: string) =>
  input
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');

export function htmlToPlainText(input?: string | null): string {
  if (!input) return '';
  let output = input;
  output = output.replace(/<br\s*\/?>/gi, '\n');
  output = output.replace(/<\/p>/gi, '\n');
  output = output.replace(/<p[^>]*>/gi, '');
  output = output.replace(/<\/?[^>]+>/g, '');
  output = decodeEntities(output);
  output = output.replace(/\n{3,}/g, '\n\n');
  output = output.trim();
  return output;
}
