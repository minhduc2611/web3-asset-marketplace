"use client"

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  theme?: 'dark' | 'light';
}

export function MarkdownRenderer({ 
  content, 
  className = "", 
  theme = 'dark' 
}: MarkdownRendererProps) {
  const isDark = theme === 'dark';
  
  // Base styles for light theme
  const lightStyles = {
    wrapper: "text-slate-700 leading-relaxed prose prose-slate max-w-none markdown-content",
    h1: "text-2xl font-bold text-slate-900 mb-3 cursor-text select-text",
    h2: "text-xl font-semibold text-slate-800 mb-2 cursor-text select-text",
    h3: "text-lg font-medium text-slate-700 mb-2 cursor-text select-text",
    p: "text-slate-700 mb-3 leading-relaxed cursor-text select-text",
    strong: "font-semibold text-slate-900 cursor-text select-text",
    em: "italic text-slate-600 cursor-text select-text",
    code: "bg-slate-100 text-purple-600 px-1.5 py-0.5 rounded text-sm font-mono cursor-text select-text",
    pre: "bg-slate-100 text-slate-800 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-3 cursor-text select-text",
    ul: "list-disc list-inside text-slate-700 mb-3 space-y-1",
    ol: "list-decimal list-inside text-slate-700 mb-3 space-y-1",
    li: "text-slate-700 cursor-text select-text",
    blockquote: "border-l-4 border-blue-400 pl-4 italic text-slate-600 mb-3 cursor-text select-text",
    a: "text-blue-600 hover:text-blue-500 underline cursor-pointer"
  };

  // Dark theme styles
  const darkStyles = {
    wrapper: "text-slate-300 leading-relaxed prose prose-invert prose-slate max-w-none markdown-content",
    h1: "text-2xl font-bold text-slate-50 mb-3 cursor-text select-text",
    h2: "text-xl font-semibold text-slate-100 mb-2 cursor-text select-text",
    h3: "text-lg font-medium text-slate-200 mb-2 cursor-text select-text",
    p: "text-slate-300 mb-3 leading-relaxed cursor-text select-text",
    strong: "font-semibold text-slate-100 cursor-text select-text",
    em: "italic text-slate-200 cursor-text select-text",
    code: "bg-slate-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono cursor-text select-text",
    pre: "bg-slate-700 text-slate-200 p-3 rounded-lg overflow-x-auto text-sm font-mono mb-3 cursor-text select-text",
    ul: "list-disc list-inside text-slate-300 mb-3 space-y-1",
    ol: "list-decimal list-inside text-slate-300 mb-3 space-y-1",
    li: "text-slate-300 cursor-text select-text",
    blockquote: "border-l-4 border-purple-400 pl-4 italic text-slate-200 mb-3 cursor-text select-text",
    a: "text-blue-400 hover:text-blue-300 underline cursor-pointer"
  };

  const styles = isDark ? darkStyles : lightStyles;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({children}) => <h1 className={styles.h1}>{children}</h1>,
          h2: ({children}) => <h2 className={styles.h2}>{children}</h2>,
          h3: ({children}) => <h3 className={styles.h3}>{children}</h3>,
          p: ({children}) => <p className={styles.p}>{children}</p>,
          strong: ({children}) => <strong className={styles.strong}>{children}</strong>,
          em: ({children}) => <em className={styles.em}>{children}</em>,
          code: ({children}) => <code className={styles.code}>{children}</code>,
          pre: ({children}) => <pre className={styles.pre}>{children}</pre>,
          ul: ({children}) => <ul className={styles.ul}>{children}</ul>,
          ol: ({children}) => <ol className={styles.ol}>{children}</ol>,
          li: ({children}) => <li className={styles.li}>{children}</li>,
          blockquote: ({children}) => <blockquote className={styles.blockquote}>{children}</blockquote>,
          a: ({href, children}) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.a}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 