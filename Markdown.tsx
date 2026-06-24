// Lightweight, dependency-free Markdown renderer for chat responses.
// Supports: headings (##, ###), bold (**), italics (*), inline code (`),
// code blocks (```), bullet lists (-), numbered lists (1.), blockquotes (>),
// tables (| a | b |), and paragraphs with horizontal rules (---).

import { type ReactNode } from 'react';

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Tokenize: inline code, bold, italics. Use a regex split approach.
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(regex);
  parts.forEach((part, i) => {
    if (!part) return;
    const k = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(<code key={k} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-brand-700 dark:text-brand-300 text-[0.85em] font-mono">{part.slice(1, -1)}</code>);
    } else if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(<strong key={k} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith('*') && part.endsWith('*')) {
      nodes.push(<em key={k} className="italic">{part.slice(1, -1)}</em>);
    } else {
      nodes.push(<span key={k}>{part}</span>);
    }
  });
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let listItems: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listType && listItems.length > 0) {
      const k = `list-${blocks.length}`;
      if (listType === 'ul') {
        blocks.push(
          <ul key={k} className="list-disc pl-5 space-y-1 my-2 text-slate-700 dark:text-slate-300">
            {listItems.map((it, j) => <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>)}
          </ul>
        );
      } else {
        blocks.push(
          <ol key={k} className="list-decimal pl-5 space-y-1 my-2 text-slate-700 dark:text-slate-300">
            {listItems.map((it, j) => <li key={`${k}-${j}`}>{renderInline(it, `${k}-${j}`)}</li>)}
          </ol>
        );
      }
    }
    listItems = [];
    listType = null;
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code block
    if (trimmed.startsWith('```')) {
      flushList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <pre key={`code-${blocks.length}`} className="my-3 p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto scrollbar-thin">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push(<h4 key={`h4-${blocks.length}`} className="font-serif font-semibold text-base mt-3 mb-1 text-slate-900 dark:text-white">{renderInline(trimmed.slice(4), `h4-${blocks.length}`)}</h4>);
      i++; continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(<h3 key={`h3-${blocks.length}`} className="font-serif font-bold text-lg mt-4 mb-2 text-slate-900 dark:text-white">{renderInline(trimmed.slice(3), `h3-${blocks.length}`)}</h3>);
      i++; continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push(<h2 key={`h2-${blocks.length}`} className="font-serif font-bold text-xl mt-4 mb-2 text-slate-900 dark:text-white">{renderInline(trimmed.slice(2), `h2-${blocks.length}`)}</h2>);
      i++; continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***') {
      flushList();
      blocks.push(<hr key={`hr-${blocks.length}`} className="my-3 border-slate-200 dark:border-slate-700" />);
      i++; continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      blocks.push(
        <blockquote key={`bq-${blocks.length}`} className="my-2 pl-3 border-l-2 border-brand-400 italic text-slate-600 dark:text-slate-400">
          {renderInline(trimmed.slice(2), `bq-${blocks.length}`)}
        </blockquote>
      );
      i++; continue;
    }

    // Numbered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(olMatch[2]);
      i++; continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(trimmed.slice(2));
      i++; continue;
    }

    // Empty line — flush list and move on
    if (trimmed === '') {
      flushList();
      i++; continue;
    }

    // Paragraph (merge consecutive non-empty, non-special lines)
    flushList();
    const paraLines: string[] = [trimmed];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (next === '' || next.startsWith('#') || next.startsWith('-') || next.startsWith('*') ||
          next.startsWith('```') || next.startsWith('> ') || /^\d+\.\s/.test(next) || next === '---') break;
      paraLines.push(next);
      i++;
    }
    blocks.push(<p key={`p-${blocks.length}`} className="my-2 leading-relaxed">{renderInline(paraLines.join(' '), `p-${blocks.length}`)}</p>);
  }
  flushList();

  return <div className="text-sm">{blocks}</div>;
}
