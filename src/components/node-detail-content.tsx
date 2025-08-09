"use client"

import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  title: string;
  snippet: string;
  link?: string;
  displayLink?: string;
  type?: 'web' | 'document';
  filename?: string;
  chunkId?: string;
  score?: number;
  description?: string;
}

interface KnowledgeData {
  googleSearchStatus?: string;
  error?: string;
  searchHistory?: SearchResult[][];
  latestGoogleSearch?: {
    searchCompletedAt?: string;
    searchQuery?: string;
    insights?: string;
    searchResults?: SearchResult[];
    documentSearchResults?: SearchResult[];
  };
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
        <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
          No node selected.
        </p>
        <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Select a node to view its details and knowledge base.
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
      searchResultBg: 'bg-slate-700/30 border border-slate-600',
      documentResultBg: 'bg-purple-900/20 border border-purple-600/30',
      link: 'text-blue-400 hover:text-blue-300',
      documentLink: 'text-purple-300',
      displayLink: 'text-green-400',
      documentDisplayLink: 'text-purple-400'
    },
    light: {
      sectionBg: 'bg-slate-50 border border-slate-200',
      heading: 'text-slate-900',
      label: 'text-slate-600',
      text: 'text-slate-800',
      subtext: 'text-slate-600',
      muted: 'text-slate-500',
      searchResultBg: 'bg-white border border-slate-200',
      documentResultBg: 'bg-purple-50 border border-purple-200',
      link: 'text-blue-600 hover:text-blue-700',
      documentLink: 'text-purple-700',
      displayLink: 'text-green-600',
      documentDisplayLink: 'text-purple-600'
    }
  };

  const styles = themeClasses[theme];

  // Parse knowledge data
  let knowledgeData: KnowledgeData | null = null;
  let searchStatus = 'idle';
  
  try {
    if (node.knowledge) {
      console.log('node.knowledge', node.knowledge);
      knowledgeData = JSON.parse(node.knowledge) as KnowledgeData;
      console.log('knowledgeData', knowledgeData);
      searchStatus = knowledgeData.googleSearchStatus || 'idle';
      console.log('searchStatus', searchStatus);
    }
  } catch (error) {
    console.error('Error parsing knowledge data:', error);
    knowledgeData = {
      googleSearchStatus: 'completed',
      error: 'Error parsing knowledge data',
      searchHistory: [],
      latestGoogleSearch: {
        insights: node.knowledge || '',
        searchCompletedAt: '',
        searchQuery: '',
      }
    };
  }

  const getStatusBadge = (status: string) => {
    const badgeProps = {
      processing: { variant: 'secondary' as const, color: 'text-blue-400', text: 'Processing...' },
      completed: { variant: 'default' as const, color: 'text-green-400', text: 'Completed' },
      failed: { variant: 'destructive' as const, color: 'text-red-400', text: 'Failed' },
      idle: { variant: 'outline' as const, color: 'text-slate-400', text: 'No Search Data' }
    };
    
    const props = badgeProps[status as keyof typeof badgeProps] || badgeProps.idle;
    return <Badge variant={props.variant} className={props.color}>{props.text}</Badge>;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Node Info */}
      <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${styles.heading} flex items-center`}>
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {node.name}
          </h2>
          <div className="flex space-x-2">
            <Badge variant={node.type === 'original' ? 'default' : 'secondary'}>
              {node.type === 'original' ? 'Original' : 'Generated'}
            </Badge>
            {knowledgeData && getStatusBadge(searchStatus)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`text-sm font-medium ${styles.label}`}>Node ID</label>
            <p className={`mt-1 text-xs font-mono ${styles.subtext} break-all`}>{node.id}</p>
          </div>
          <div>
            <label className={`text-sm font-medium ${styles.label}`}>Content Status</label>
            <div className="mt-1 flex space-x-2">
              {node.description && (
                <Badge variant="outline" className="text-xs">
                  Has Description
                </Badge>
              )}
              {node.knowledge && (
                <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                  Has Knowledge
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {node.description && node.description.trim() && (
        <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
          <h3 className={`text-lg font-semibold mb-3 ${styles.heading} flex items-center`}>
            <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
            </svg>
            Description
          </h3>
          <div className={`whitespace-pre-wrap leading-relaxed ${styles.text} bg-slate-800/50 rounded-lg p-3 border border-slate-600/50`}>
            {node.description}
          </div>
        </div>
      )}

      {/* Knowledge Base */}
      {knowledgeData && (
        <div className="space-y-6">
          {/* Search Status and Info */}
          <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
            <h3 className={`text-lg font-semibold mb-3 flex items-center ${styles.heading}`}>
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Knowledge Base
              {knowledgeData.latestGoogleSearch?.searchCompletedAt && (
                <span className={`text-xs ml-2 ${styles.subtext}`}>
                  • Updated {new Date(knowledgeData.latestGoogleSearch.searchCompletedAt).toLocaleDateString()}
                </span>
              )}
            </h3>

            {searchStatus === 'processing' && (
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-blue-300 text-sm font-medium">
                    Search in progress... Results will appear automatically.
                  </span>
                </div>
              </div>
            )}

            {searchStatus === 'failed' && (
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-red-300 text-sm font-medium">
                    Search failed: {knowledgeData.error || 'Unknown error'}
                  </span>
                </div>
              </div>
            )}

            {/* Search History Summary */}
            {knowledgeData.searchHistory && knowledgeData.searchHistory.length > 0 && (
              <div className="text-sm">
                <p className={styles.subtext}>
                  Total searches: {knowledgeData.searchHistory.length}
                  {knowledgeData.latestGoogleSearch?.searchQuery && (
                    <span> • Last query: &quot;{knowledgeData.latestGoogleSearch.searchQuery}&quot;</span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* AI Insights */}
          {knowledgeData.latestGoogleSearch?.insights && (
            <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${styles.heading}`}>
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                AI Insights
              </h3>
              
              {/* Document context indicator */}
              {knowledgeData.latestGoogleSearch?.documentSearchResults?.length && knowledgeData.latestGoogleSearch.documentSearchResults.length > 0 && (
                <div className="bg-purple-900/30 border border-purple-600/40 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-purple-300 text-sm font-medium">
                      Enhanced with your personal documents ({knowledgeData.latestGoogleSearch?.documentSearchResults?.length || 0} relevant chunks)
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/50">
                <MarkdownRenderer 
                  content={knowledgeData.latestGoogleSearch.insights}
                  theme={theme}
                />
              </div>
            </div>
          )}

          {/* Search Results */}
          {knowledgeData.latestGoogleSearch?.searchResults && knowledgeData.latestGoogleSearch.searchResults.length > 0 && (
            <div className="space-y-6">
              {/* Web Search Results */}
              {(() => {
                const webResults = knowledgeData.latestGoogleSearch!.searchResults!.filter((result: SearchResult) => result.type === 'web');
                return webResults.length > 0 ? (
                  <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
                    <h3 className={`text-lg font-semibold mb-3 flex items-center ${styles.heading}`}>
                      <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Web Search Results ({webResults.length})
                    </h3>
                    <div className="space-y-3">
                      {webResults.map((result: SearchResult, index: number) => (
                        <div key={`web-${index}`} className={`rounded-lg p-3 ${styles.searchResultBg} hover:border-slate-500 transition-colors`}>
                          <a 
                            href={result.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <h4 className={`font-medium mb-1 group-hover:underline transition-colors text-sm ${styles.link} flex items-center`}>
                              <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                              </svg>
                              {result.title}
                            </h4>
                            <p className={`text-xs mb-2 line-clamp-2 ${styles.subtext} leading-relaxed`}>
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
                ) : null;
              })()}

              {/* Document Search Results */}
              {(() => {
                const docResults = knowledgeData.latestGoogleSearch!.searchResults!.filter((result: SearchResult) => result.type === 'document');
                return docResults.length > 0 ? (
                  <div className={`rounded-lg p-4 ${styles.sectionBg}`}>
                    <h3 className={`text-lg font-semibold mb-3 flex items-center ${styles.heading}`}>
                      <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Your Documents ({docResults.length})
                    </h3>
                    <div className="space-y-3">
                      {docResults.map((result: SearchResult, index: number) => (
                        <div key={`doc-${index}`} className={`rounded-lg p-3 ${styles.documentResultBg} hover:border-purple-500/50 transition-colors`}>
                          <div className="group">
                            <h4 className={`font-medium mb-2 text-sm ${styles.documentLink} flex items-center`}>
                              <svg className="w-3 h-3 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                              </svg>
                              {result.title}
                            </h4>
                            <p className={`text-xs mb-3 line-clamp-3 leading-relaxed ${styles.subtext}`}>
                              {result.snippet}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-medium ${styles.documentDisplayLink}`}>
                                📄 {result.filename}
                              </span>
                              {result.score && (
                                <span className={`text-xs ${styles.muted}`}>
                                  Relevance: {Math.round((1 - result.score) * 100)}%
                                </span>
                              )}
                            </div>
                            {result.description && (
                              <p className={`text-xs mt-2 italic ${styles.muted}`}>
                                {result.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}

      {/* No additional information */}
      {!node.description?.trim() && !knowledgeData && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </div>
          <p className={`text-lg font-medium mb-2 ${styles.subtext}`}>No additional information available</p>
          <p className={`text-sm ${styles.muted} max-w-md mx-auto`}>
            This node doesn&apos;t have any description or knowledge base content yet. 
            Use &quot;Search with Google&quot; to add knowledge or &quot;Edit Node&quot; to add a description.
          </p>
        </div>
      )}
    </div>
  );
} 