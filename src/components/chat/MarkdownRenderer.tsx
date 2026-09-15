import React, { useState } from 'react';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
}

type MarkdownPart =
  | { type: 'code'; code: string; language?: string }
  | { type: 'text'; text: string };

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Break into code blocks and normal text blocks
  const parts = parseMarkdown(content);

  return (
    <div className="study-md">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock key={index} code={part.code} language={part.language} />
          );
        }
        return <TextBlock key={index} text={part.text} />;
      })}
    </div>
  );
}

/* -------------------------------- Code Block ------------------------------- */

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="study-codeblock">
      <div className="study-codeblock__header">
        <span className="study-codeblock__lang">{language || 'code'}</span>
        <button
          className={`study-codeblock__copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="study-codeblock__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* -------------------------------- Text Block ------------------------------- */

function TextBlock({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="study-md__ul">
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="study-md__ol">
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${i}`} className="study-md__h4">
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="study-md__h3">
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="study-md__h2">
          {renderInline(trimmed.replace(/^#\s+/, ''))}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${i}`} className="study-md__quote">
          {renderInline(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="study-md__hr" />);
      continue;
    }

    // Table rows starting with |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      // Check if divider row
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) {
        continue;
      }
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      elements.push(
        <div key={`tbl-row-${i}`} className="study-md__tablerow">
          {cells.map((c, cIdx) => (
            <div key={cIdx} className="study-md__tablecell">
              {renderInline(c)}
            </div>
          ))}
        </div>
      );
      continue;
    }

    // Unordered List (- or * or •)
    const ulMatch = trimmed.match(/^[-*•]\s+(.+)/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Ordered List (1. or 2.)
    const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[1]);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="study-md__p">
        {renderInline(rawLine)}
      </p>
    );
  }

  flushList();

  return <>{elements}</>;
}

/* ------------------------------- Markdown Parser -------------------------- */

function parseMarkdown(md: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(md)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        text: md.substring(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'code',
      code: match[2].trimEnd(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < md.length) {
    parts.push({
      type: 'text',
      text: md.substring(lastIndex),
    });
  }

  return parts;
}

/* ----------------------------- Inline Markdown ---------------------------- */

function renderInline(str: string): React.ReactNode {
  // Process bold `**bold**`, inline code `` `code` ``, italic `*italic*`
  const parts: React.ReactNode[] = [];
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={`b-${match.index}`}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={`c-${match.index}`} className="study-md__inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={`i-${match.index}`}>
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}
