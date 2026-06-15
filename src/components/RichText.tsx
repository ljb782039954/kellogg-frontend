import { marked } from "marked";

interface RichTextProps {
  value?: string;
  className?: string;
  inline?: boolean;
}

export function decodeHtml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export default function RichText({ value = "", className, inline = false }: RichTextProps) {
  const html = inline
    ? marked.parseInline(decodeHtml(value))
    : marked.parse(decodeHtml(value));

  return <div className={className} dangerouslySetInnerHTML={{ __html: html as string }} />;
}
