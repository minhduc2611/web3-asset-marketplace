"use client"

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface SearchResult {
  title: string;
  snippet: string;
  link?: string;
  displayLink?: string;
}

interface NodeDetailContentProps {
  node: {
    id: string;
    name: string;
    type: 'original' | 'generated';
    description?: string | null;
    knowledge?: string | null;
  } | null;
  theme?: 'light' | 'dark';
  className?: string;
}

export function NodeDetailContent({ node, theme = 'dark', className = '' }: NodeDetailContentProps) {
  if (!node) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
          No node selected.
        </p>
      </div>
    );
  }

  const themeClasses = {
    dark: {
      sectionBg: 'bg-slate-700/30 border border-slate-600',
      heading: 'text-slate-50',
      label: 'text-slate-300',
      text: 'text-slate-100',
      subtext: 'text-slate-400',
      muted: 'text-slate-500',
      searchResultBg: 'bg-slate-600/30 border border-slate-600/50',
      link: 'text-blue-400 hover:text-blue-300',
      displayLink: 'text-green-400'
    },
    light: {
      sectionBg: 'bg-slate-50 border border-slate-200',
      heading: 'text-slate-900',
      label: 'text-slate-600',
      text: 'text-slate-800',
      subtext: 'text-slate-600',
      muted: 'text-slate-500',
      searchResultBg: 'bg-white border border-slate-200',
      link: 'text-blue-600 hover:text-blue-700',
      displayLink: 'text-green-600'
    }
  };

  const styles = themeClasses[theme];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Basic Information */}
      <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
        <h3 className={`text-lg font-semibold mb-3 ${styles.heading}`}>Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-sm font-medium ${styles.label}`}>Name</label>
            <p className={`mt-1 ${styles.text}`}>{node.name}</p>
          </div>
          <div>
            <label className={`text-sm font-medium ${styles.label}`}>Type</label>
            <p className={`mt-1 ${styles.text} capitalize`}>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                node.type === 'original' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {node.type}
              </span>
            </p>
          </div>
          <div>
            <label className={`text-sm font-medium ${styles.label}`}>ID</label>
            <p className={`mt-1 text-xs font-mono ${styles.subtext}`}>{node.id}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {node.description && node.description.trim() && (
        <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
          <h3 className={`text-lg font-semibold mb-3 ${styles.heading}`}>Description</h3>
          <div className={`whitespace-pre-wrap leading-relaxed ${styles.label}`}>
            {node.description}
          </div>
        </div>
      )}

      {/* Knowledge (from Google Search) */}
      {node.knowledge && (() => {
        try {
          const knowledgeData = JSON.parse(node.knowledge);
          return (
            <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${styles.heading}`}>
                <svg className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                Knowledge Base
                {knowledgeData.searchDate && (
                  <span className={`text-xs ml-2 ${styles.subtext}`}>
                    • {new Date(knowledgeData.searchDate).toLocaleDateString()}
                  </span>
                )}
              </h3>
              
              {/* AI Insights */}
              {knowledgeData.geminiAnswer && (
                <div className="mb-6">
                  <h4 className={`text-base font-medium mb-2 ${styles.label}`}>AI Insights</h4>
                  <MarkdownRenderer 
                    content={knowledgeData.geminiAnswer}
                    theme={theme}
                  />
                </div>
              )}

              {/* Search Results */}
              {knowledgeData.searchResults && knowledgeData.searchResults.length > 0 && (
                <div>
                  <h4 className={`text-base font-medium mb-3 ${styles.label}`}>Search Results</h4>
                  <div className="space-y-3">
                    {knowledgeData.searchResults.map((result: SearchResult, index: number) => (
                      <div key={index} className={`rounded-lg p-3 ${styles.searchResultBg}`}>
                        <a 
                          href={result.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <h5 className={`font-medium mb-1 group-hover:underline transition-colors text-sm ${styles.link}`}>
                            {result.title}
                          </h5>
                          <p className={`text-xs mb-2 line-clamp-2 ${styles.subtext}`}>
                            {result.snippet}
                          </p>
                          {result.displayLink && (
                            <span className={`text-xs ${styles.displayLink}`}>
                              {result.displayLink}
                            </span>
                          )}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        } catch {
          return (
            <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
              <h3 className={`text-lg font-semibold mb-3 ${styles.heading}`}>Knowledge</h3>
              <p className={styles.subtext}>Invalid knowledge data format</p>
            </div>
          );
        }
      })()}

      {/* No additional information */}
      {!node.description?.trim() && !node.knowledge && (
        <div className="text-center py-8">
          <p className={styles.subtext}>No additional information available for this node.</p>
          <p className={`text-sm mt-2 ${styles.muted}`}>
            Use &quot;Search with Google&quot; to add knowledge or &quot;Edit Node&quot; to add a description.
          </p>
        </div>
      )}
    </div>
  );
} 