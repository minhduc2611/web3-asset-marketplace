/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MemoryViewer from '@/components/memory-viewer';

interface NodeDetailModalProps {
  open: boolean;
  node: any | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

function NodeDetailModal({
  open,
  node,
  onOpenChange,
  onClose
}: NodeDetailModalProps) {
    console.log("node", node);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 sm:max-w-4xl mx-3 sm:mx-auto max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-slate-50">Node Details: &quot;{node?.name}&quot;</DialogTitle>
              <DialogDescription className="text-slate-400">
                Complete information about this node
              </DialogDescription>
            </div>
            <MemoryViewer />
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {node && (
              <>
                {/* Basic Information */}
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-lg font-semibold text-slate-50 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Name</label>
                      <p className="text-slate-100 mt-1">{node.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Type</label>
                      <p className="text-slate-100 mt-1 capitalize">
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
                      <label className="text-sm font-medium text-slate-300">ID</label>
                      <p className="text-slate-400 mt-1 text-xs font-mono">{node.id}</p>
                    </div>
                  </div>
                </div>

              {/* Description */}
              {node.description && node.description.trim() && (
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <h3 className="text-lg font-semibold text-slate-50 mb-3">Description</h3>
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {node.description}
                  </div>
                </div>
              )}

              {/* Knowledge (from Google Search) */}
              
              {node.knowledge && (() => {
                try {
                  const knowledgeData = JSON.parse(node.knowledge);
                  return (
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                      <h3 className="text-lg font-semibold text-slate-50 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                        Knowledge Base
                        {knowledgeData.searchDate && (
                          <span className="text-xs text-slate-400 ml-2">
                            • {new Date(knowledgeData.searchDate).toLocaleDateString()}
                          </span>
                        )}
                      </h3>
                      
                      {/* AI Insights */}
                      {knowledgeData.geminiAnswer && (
                        <div className="mb-6">
                          <h4 className="text-base font-medium text-slate-200 mb-2">AI Insights</h4>
                          <div className="text-slate-300 leading-relaxed prose prose-invert prose-slate max-w-none markdown-content">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({children}) => <h1 className="text-lg font-bold text-slate-50 mb-2 cursor-text select-text">{children}</h1>,
                                h2: ({children}) => <h2 className="text-base font-semibold text-slate-100 mb-2 cursor-text select-text">{children}</h2>,
                                h3: ({children}) => <h3 className="text-sm font-medium text-slate-200 mb-1 cursor-text select-text">{children}</h3>,
                                p: ({children}) => <p className="text-slate-300 mb-2 leading-relaxed cursor-text select-text">{children}</p>,
                                strong: ({children}) => <strong className="font-semibold text-slate-100 cursor-text select-text">{children}</strong>,
                                em: ({children}) => <em className="italic text-slate-200 cursor-text select-text">{children}</em>,
                                code: ({children}) => <code className="bg-slate-700 text-blue-300 px-1 py-0.5 rounded text-sm font-mono cursor-text select-text">{children}</code>,
                                ul: ({children}) => <ul className="list-disc list-inside text-slate-300 mb-2 space-y-1">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal list-inside text-slate-300 mb-2 space-y-1">{children}</ol>,
                                li: ({children}) => <li className="text-slate-300 cursor-text select-text">{children}</li>,
                                blockquote: ({children}) => <blockquote className="border-l-4 border-purple-400 pl-3 italic text-slate-200 mb-2 cursor-text select-text">{children}</blockquote>,
                              }}
                            >
                              {knowledgeData.geminiAnswer}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}

                      {/* Search Results */}
                      {knowledgeData.searchResults && knowledgeData.searchResults.length > 0 && (
                        <div>
                          <h4 className="text-base font-medium text-slate-200 mb-3">Search Results</h4>
                          <div className="space-y-3">
                            {knowledgeData.searchResults.map((result: any, index: number) => (
                              <div key={index} className="bg-slate-600/30 rounded-lg p-3 border border-slate-600/50">
                                <a 
                                  href={result.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="block group"
                                >
                                  <h5 className="text-blue-400 font-medium mb-1 group-hover:text-blue-300 transition-colors text-sm">
                                    {result.title}
                                  </h5>
                                  <p className="text-slate-400 text-xs mb-2 line-clamp-2">
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
                      )}
                    </div>
                  );
                } catch {
                  return (
                    <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                      <h3 className="text-lg font-semibold text-slate-50 mb-3">Knowledge</h3>
                      <p className="text-slate-400">Invalid knowledge data format</p>
                    </div>
                  );
                }
              })()}

              {/* No additional information */}
              {!node.description?.trim() && !node.knowledge && (
                <div className="text-center py-8">
                  <p className="text-slate-400">No additional information available for this node.</p>
                  <p className="text-slate-500 text-sm mt-2">Use &quot;Search with Google&quot; to add knowledge or &quot;Edit Node&quot; to add a description.</p>
                </div>
              )}
            </>
          )}
          </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 touch-manipulation"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(NodeDetailModal, (prevProps, nextProps) => {
  // Only re-render if open or node changes, ignore function prop changes
  return prevProps.open === nextProps.open;
});