/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { NodeDetailContent } from "@/components/node-detail-content";
import MemoryViewer from '@/components/memory-viewer';

interface GoogleSearchModalProps {
  open: boolean;
  searchTerm: string;
  searchResults: any[];
  geminiAnswer: string;
  isLoading: boolean;
  nodeId?: string;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSearchComplete?: (data: { searchResults: any[]; geminiAnswer: string }) => void;
}

function GoogleSearchModal({
  open,
  searchTerm,
  searchResults,
  geminiAnswer,
  isLoading,
  nodeId,
  onOpenChange,
  onClose,
  onSearchComplete
}: GoogleSearchModalProps) {
  const [countdown, setCountdown] = useState(60);
  const [isPolling, setIsPolling] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [localSearchResults, setLocalSearchResults] = useState(searchResults);
  const [localGeminiAnswer, setLocalGeminiAnswer] = useState(geminiAnswer);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [nodeData, setNodeData] = useState<any>(null);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Poll for search completion and node updates
  const pollSearchStatus = useCallback(async () => {
    if (!nodeId || !isPolling) return;

    try {
      const response = await fetch(`/api/google-search?nodeId=${nodeId}`);
      const data = await response.json();

      if (data.status === 'completed' && data.searchData) {
        setLocalSearchResults(data.searchData.searchResults || []);
        setLocalGeminiAnswer(data.searchData.geminiAnswer || '');
        setSearchComplete(true);
        setIsPolling(false);
        
        // Notify parent component
        if (onSearchComplete) {
          onSearchComplete({
            searchResults: data.searchData.searchResults || [],
            geminiAnswer: data.searchData.geminiAnswer || ''
          });
        }
      } else if (data.status === 'failed') {
        setSearchError(data.error || 'Search failed');
        setIsPolling(false);
      }

      // Also fetch updated node data
      if (nodeId) {
        const nodeResponse = await fetch(`/api/node/${nodeId}`);
        if (nodeResponse.ok) {
          const nodeResult = await nodeResponse.json();
          setNodeData(nodeResult);
        }
      }
    } catch (error) {
      console.error('Error polling search status:', error);
    }
  }, [nodeId, isPolling, onSearchComplete]);

  // Start polling when modal opens and we're loading
  useEffect(() => {
    if (open && isLoading && nodeId && !searchComplete) {
      setIsPolling(true);
      setCountdown(60);
      
      // Start polling immediately
      pollSearchStatus();
      
      // Set up polling interval
      const pollInterval = setInterval(pollSearchStatus, 25000);
      
      return () => clearInterval(pollInterval);
    }
  }, [open, isLoading, nodeId, searchComplete, pollSearchStatus]);

  // Countdown timer
  useEffect(() => {
    if (isLoading && countdown > 0 && !searchComplete) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, countdown, searchComplete]);

  // Reset state when modal opens with new search
  useEffect(() => {
    if (open) {
      setLocalSearchResults(searchResults);
      setLocalGeminiAnswer(geminiAnswer);
      setSearchComplete(false);
      setSearchError(null);
      
      // If we have results already, mark as complete
      if (searchResults.length > 0 || geminiAnswer) {
        setSearchComplete(true);
      }

      // Fetch node data if we have nodeId
      if (nodeId) {
        fetch(`/api/node/${nodeId}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => setNodeData(data))
          .catch(error => console.error('Error fetching node data:', error));
      }
    }
  }, [open, searchResults, geminiAnswer, nodeId]);

  const currentSearchResults = localSearchResults.length > 0 ? localSearchResults : searchResults;
  const currentGeminiAnswer = localGeminiAnswer || geminiAnswer;
  const showLoading = isLoading && !searchComplete && !searchError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 mx-3 sm:mx-auto max-h-[85vh] sm:max-w-6xl overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-slate-50">Google Search: &quot;{searchTerm}&quot;</DialogTitle>
              <DialogDescription className="text-slate-400">
                {showLoading ? "Processing search in background..." : "Search results and node analysis"}
              </DialogDescription>
            </div>
            <MemoryViewer />
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="results" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 bg-slate-700">
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>Search Results</span>
            </TabsTrigger>
            <TabsTrigger value="node" className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Node Details</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="flex-1 overflow-y-scroll space-y-6 py-4 mt-0">
            {showLoading ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
                
                {/* Progress indicators */}
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className="text-slate-300 font-medium">Searching web, documents, and generating AI insights...</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-mono text-blue-400">{formatTime(countdown)}</div>
                      <p className="text-slate-400 text-sm">Estimated time remaining</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-300">Web search</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Latest news & articles</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-300">Document search</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Your knowledge base</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-300">AI analysis</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">Combining all sources</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Your search is being processed in the background. This includes searching the web, analyzing your uploaded documents, and generating AI insights that combine both sources. 
                    This typically takes 40-60 seconds. You can close this modal and the results will be saved to your node automatically, 
                    or wait here to see them as soon as they&apos;re ready.
                  </p>
                </div>
              </div>
            ) : searchError ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Search Failed</h3>
                <p className="text-slate-400">{searchError}</p>
                <p className="text-slate-500 text-sm mt-2">Please try again with a different search term.</p>
              </div>
            ) : (
              <>
                {searchComplete && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-green-400 font-medium">Search completed and saved to knowledge base!</span>
                    </div>
                  </div>
                )}

                {/* AI Insights */}
                {currentGeminiAnswer && (
                  <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                    <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      AI Insights
                    </h3>
                    
                    {/* Document context indicator */}
                    {(() => {
                      const docResults = currentSearchResults.filter((result: any) => result.type === 'document');
                      return docResults.length > 0 ? (
                        <div className="bg-purple-900/30 border border-purple-600/40 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span className="text-purple-300 text-sm font-medium">
                              Enhanced with your personal documents ({docResults.length} relevant chunks found)
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    <MarkdownRenderer 
                      content={currentGeminiAnswer}
                      theme="dark"
                    />
                  </div>
                )}

                {/* Search Results */}
                {currentSearchResults.length > 0 && (
                  <div className="space-y-6">
                    {/* Web Search Results */}
                    {(() => {
                      const webResults = currentSearchResults.filter((result: any) => result.type === 'web');
                      return webResults.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            Web Search Results ({webResults.length})
                          </h3>
                          <div className="space-y-3">
                            {webResults.map((result: any, index: number) => (
                              <div key={`web-${index}`} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                                <a 
                                  href={result.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <h4 className="text-blue-400 font-medium mb-2 group-hover:text-blue-300 transition-colors flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                    </svg>
                                    {result.title}
                                  </h4>
                                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                                    {result.snippet}
                                  </p>
                                  <span className="text-green-400 text-xs">
                                    {result.displayLink}
                                  </span>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Document Search Results */}
                    {(() => {
                      const docResults = currentSearchResults.filter((result: any) => result.type === 'document');
                      return docResults.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Your Documents ({docResults.length})
                          </h3>
                          <div className="space-y-3">
                            {docResults.map((result: any, index: number) => (
                              <div key={`doc-${index}`} className="bg-purple-900/20 rounded-lg p-4 border border-purple-600/30 hover:border-purple-500/50 transition-colors">
                                <div className="group">
                                  <h4 className="text-purple-300 font-medium mb-2 flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                    </svg>
                                    {result.title}
                                  </h4>
                                  <p className="text-slate-400 text-sm mb-3 line-clamp-3 leading-relaxed">
                                    {result.snippet}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-purple-400 text-xs font-medium">
                                      📄 {result.filename}
                                    </span>
                                    {result.score && (
                                      <span className="text-slate-500 text-xs">
                                        Relevance: {Math.round((1 - result.score) * 100)}%
                                      </span>
                                    )}
                                  </div>
                                  {result.description && (
                                    <p className="text-slate-500 text-xs mt-2 italic">
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

                    {/* Fallback for legacy results without type */}
                    {(() => {
                      const legacyResults = currentSearchResults.filter((result: any) => !result.type);
                      return legacyResults.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            Search Results
                          </h3>
                          <div className="space-y-3">
                            {legacyResults.map((result: any, index: number) => (
                              <div key={`legacy-${index}`} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors">
                                <a 
                                  href={result.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <h4 className="text-blue-400 font-medium mb-2 group-hover:text-blue-300 transition-colors">
                                    {result.title}
                                  </h4>
                                  <p className="text-slate-400 text-sm mb-2 line-clamp-2">
                                    {result.snippet}
                                  </p>
                                  <span className="text-green-400 text-xs">
                                    {result.displayLink}
                                  </span>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {!currentGeminiAnswer && currentSearchResults.length === 0 && !showLoading && !searchError && (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No results found. Try a different search term.</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="node" className="flex-1 overflow-y-scroll py-4 mt-0">
            {nodeData ? (
              <NodeDetailContent 
                node={nodeData}
                theme="dark"
                className="space-y-6"
              />
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p className="text-slate-400">Loading node details...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 hover:bg-slate-700 touch-manipulation"
          >
            {showLoading ? "Close (will continue in background)" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Memoize component with custom comparison function
// Only re-render when data props change, not function props
export default React.memo(GoogleSearchModal, (prevProps, nextProps) => {
  return (
    prevProps.open === nextProps.open &&
    prevProps.searchTerm === nextProps.searchTerm &&
    prevProps.geminiAnswer === nextProps.geminiAnswer &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.nodeId === nextProps.nodeId &&
    JSON.stringify(prevProps.searchResults) === JSON.stringify(nextProps.searchResults)
  );
}); 